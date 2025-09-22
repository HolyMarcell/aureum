import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'aureum_app_state_v1'

const defaultSections = {
  anamnese: '',
  klinischeFragestellung: '',
  untersuchungsart: '',
  befund: '',
  beurteilung: '',
  befundLaien: '',
  beurteilungLaien: '',
}

// Preset analysis prompts for ChatGPT evaluation
export const ANALYSIS_PROMPT_PRESETS = {
  standard: `
  Ich bin Radiologie mit 30 Jahren Berufserfahrung. 
  Im Folgenden benötige ich Hilfe bei der Erstellung von radiologischen 
  Befundberichten, bestehend aus Befund und Beurteilung.
   Ich werde dir jeweils immer die Modalität (Röntgen, CT oder MRT), 
   die Körperregion, die Kontrastmittelphase(n) (falls vorhanden), 
   die klinische Fragestellung und auffällige Pathologien als Audioeingabe 
   nennen. Im Folgenden bitte ich dich anhand dieser Angaben einen 
   vollständigen radiologischen Befund mit auf die Fragestellung angepasster 
   Beurteilung zu erstellen. Alle nicht pathologischen Veränderungen sollen 
   entsprechend eines Normalbefundes ergänzt werden.  
  
  Du bist ein medizinisches Assistenzsystem. Analysiere das folgende transkribierte 
  Arzt-Patient:innengespräch oder radiologische Beschreibung und erstelle GENAU die folgenden sieben Abschnitte, 
  ausschließlich auf Deutsch. Antworte NUR als JSON-Objekt ohne zusätzliche Erklärungen.

Felder:
- anamnese
- klinischeFragestellung
- untersuchungsart
- befund
- beurteilung
- befundLaien
- beurteilungLaien

Richtlinien:
- Sei präzise, fachlich korrekt und konsistent.
- Wenn Informationen fehlen, schreibe "k. A.".
- In den Laien-Varianten nutze klare, leicht verständliche Sprache.`,
  concise: `Du bist ein radiologisches Assistenzsystem. Erstelle aus dem folgenden Transkript GENAU die sieben Felder unten als JSON (ohne weitere Erklärungen), ausschließlich auf Deutsch.

Felder:
- anamnese
- klinischeFragestellung
- untersuchungsart
- befund
- beurteilung
- befundLaien
- beurteilungLaien

Richtlinien:
- Fasse dich kurz und fokussiere klinisch Relevantes.
- Begrenze jedes Feld auf 3–5 knappe Sätze.
- Fehlen Informationen, trage "k. A." ein.
- Laien-Felder: einfache, klare Sprache ohne Fachjargon.`,
}

const defaultState = {
  apiKey: '',
  rememberApiKey: true,
  audio: null, // { name, type, dataUrl } or null
  transcript: '',
  sections: { ...defaultSections },
  progress: 0,
  status: 'idle', // idle | recording | uploading | transcribing | analyzing | complete | error
  error: null,
  analysisPromptMode: 'standard', // 'standard' | 'concise' | 'custom'
  customAnalysisPrompt: '',
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    return { ...defaultState }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      // Ignore storage errors (e.g., quota exceeded)
      console.error('LocalStorage write failed:', e)
    }
  }, [state])

  const update = useCallback((patch) => {
    setState((s) => ({ ...s, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setState({ ...defaultState, apiKey: state.rememberApiKey ? state.apiKey : '' })
  }, [state.rememberApiKey, state.apiKey])

  const setApiKey = useCallback((apiKey, remember = true) => {
    update({ apiKey, rememberApiKey: remember })
  }, [update])

  const setAudioFromBlob = useCallback(async (blob, name = 'aufnahme.webm') => {
    const dataUrl = await blobToDataURL(blob)
    update({ audio: { name, type: blob.type || 'audio/webm', dataUrl } })
  }, [update])

  const setAudioFromFile = useCallback(async (file) => {
    const dataUrl = await blobToDataURL(file)
    update({ audio: { name: file.name, type: file.type || 'audio/webm', dataUrl } })
  }, [update])

  const removeAudio = useCallback(() => {
    update({ audio: null })
  }, [update])

  const setSection = useCallback((key, value) => {
    update({ sections: { ...state.sections, [key]: value } })
  }, [state.sections, update])

  // OpenAI calls
  const processAudio = useCallback(async () => {
    // prevent duplicate starts
    if (['uploading', 'transcribing', 'analyzing'].includes(state.status)) return
    if (!state.apiKey) {
      update({ status: 'error', error: 'Kein OpenAI API Key angegeben.' })
      return
    }
    if (!state.audio?.dataUrl) {
      update({ status: 'error', error: 'Keine Audiodatei vorhanden.' })
      return
    }

    try {
      update({ progress: 10, status: 'uploading', error: null })
      const audioBlob = await dataURLToBlob(state.audio.dataUrl)

      // Step 1: Transcription
      update({ progress: 30, status: 'transcribing' })
      const transcript = await transcribeWithWhisper(audioBlob, state.apiKey)
      update({ transcript })

      // Step 2: Analysis with specific prompt
      update({ progress: 60, status: 'analyzing' })
      const systemPrompt =
        (state.analysisPromptMode === 'custom' && state.customAnalysisPrompt?.trim())
          ? state.customAnalysisPrompt.trim()
          : (ANALYSIS_PROMPT_PRESETS[state.analysisPromptMode] || ANALYSIS_PROMPT_PRESETS.standard)
      const sections = await analyzeTranscript(transcript, state.apiKey, systemPrompt)
      update({ sections, progress: 100, status: 'complete' })
    } catch (err) {
      console.error(err)
      update({ status: 'error', error: err?.message || 'Unbekannter Fehler' })
    }
  }, [state.apiKey, state.audio, state.status])

  const value = useMemo(() => ({
    state,
    update,
    reset,
    setApiKey,
    setAudioFromBlob,
    setAudioFromFile,
    removeAudio,
    setSection,
    processAudio,
    defaultSections,
  }), [state, update, reset, setApiKey, setAudioFromBlob, setAudioFromFile, removeAudio, setSection, processAudio])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

// Helpers
async function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function dataURLToBlob(dataUrl) {
  const res = await fetch(dataUrl)
  return await res.blob()
}

async function transcribeWithWhisper(blob, apiKey) {
  const form = new FormData()
  const file = new File([blob], 'audio.webm', { type: blob.type || 'audio/webm' })
  form.append('file', file)
  form.append('model', 'whisper-1')
  form.append('response_format', 'json')
  // Optional: form.append('language', 'de')

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })
  if (!res.ok) {
    const t = await safeText(res)
    throw new Error(`Transkription fehlgeschlagen (${res.status}): ${t}`)
  }
  const data = await res.json()
  return data.text || ''
}

async function analyzeTranscript(transcript, apiKey, system) {
  const user = `Transkript:\n\n${transcript}`

  const body = {
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const t = await safeText(res)
    throw new Error(`Auswertung fehlgeschlagen (${res.status}): ${t}`)
  }
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content || ''
  const json = extractJSON(text)
  return normalizeSections(json)
}

function extractJSON(text) {
  // Try direct parse
  try { return JSON.parse(text) } catch {}
  // Try code block fenced JSON
  const match = text.match(/```(?:json)?\n([\s\S]*?)```/i)
  if (match) {
    try { return JSON.parse(match[1]) } catch {}
  }
  // Try braces slice
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    const slice = text.slice(start, end + 1)
    try { return JSON.parse(slice) } catch {}
  }
  throw new Error('Konnte JSON-Antwort nicht parsen.')
}

function normalizeSections(obj) {
  const s = { ...defaultSections }
  if (!obj || typeof obj !== 'object') return s
  const map = {
    anamnese: 'anamnese',
    klinischeFragestellung: 'klinischeFragestellung',
    untersuchungsart: 'untersuchungsart',
    befund: 'befund',
    beurteilung: 'beurteilung',
    befundLaien: 'befundLaien',
    beurteilungLaien: 'beurteilungLaien',
  }
  for (const k of Object.keys(map)) {
    const v = obj[k]
    if (typeof v === 'string') s[k] = v
  }
  return s
}

async function safeText(res) {
  try { return await res.text() } catch { return '' }
}
