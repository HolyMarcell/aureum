import React from 'react'
import { useApp } from '../context/AppContext'

export default function RecorderUpload() {
  const { state, update, setAudioFromBlob, setAudioFromFile, removeAudio, processAudio } = useApp()
  const [mediaRecorder, setMediaRecorder] = React.useState(null)
  const [chunks, setChunks] = React.useState([])
  const fileInputRef = React.useRef(null)

  const isRecording = state.status === 'recording'
  const inFlight = ['uploading', 'transcribing', 'analyzing'].includes(state.status)
  const canProcess = Boolean(state.audio) && !isRecording && !inFlight

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      const c = []
      mr.ondataavailable = (e) => { if (e.data.size > 0) c.push(e.data) }
      mr.onstop = async () => {
        const blob = new Blob(c, { type: 'audio/webm' })
        setChunks([])
        await setAudioFromBlob(blob, `aufnahme-${new Date().toISOString()}.webm`)
        // Store locally only; wait for explicit Process
        update({ status: 'idle', progress: 0 })
      }
      setMediaRecorder(mr)
      setChunks(c)
      mr.start()
      update({ status: 'recording', progress: 5, error: null })
    } catch (e) {
      console.error(e)
      update({ status: 'error', error: 'Mikrofon-Zugriff verweigert oder nicht verfügbar.' })
    }
  }

  const stopRecording = () => {
    try {
      mediaRecorder?.stop()
      mediaRecorder?.stream?.getTracks?.().forEach((t) => t.stop())
    } catch {}
  }

  const onUploadClick = () => fileInputRef.current?.click()
  const onFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await setAudioFromFile(file)
    // Store locally only; wait for explicit Process
    update({ progress: 0, status: 'idle', error: null })
    e.target.value = ''
  }

  const onRemoveAudio = () => removeAudio()

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-full sm:w-auto flex-1 text-center text-lg font-semibold rounded-2xl px-6 py-6 transition-colors shadow-lg border ${isRecording ? 'bg-red-600 border-red-500' : 'bg-aureum-yellow text-aureum-buttonText border-aureum-yellow hover:brightness-110'}`}
        >
          {isRecording ? 'Aufnahme beenden' : 'Aufnahme starten'}
        </button>
        <button
          onClick={processAudio}
          disabled={!canProcess}
          className="w-full sm:w-auto flex-1 text-center text-lg font-semibold rounded-2xl px-6 py-6 transition-colors shadow-lg border bg-aureum-yellow text-aureum-buttonText border-aureum-yellow hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verarbeiten
        </button>
        <button
          onClick={onUploadClick}
          className="w-full sm:w-auto sm:flex-none text-center text-lg font-semibold rounded-2xl px-6 py-6 transition-colors shadow-lg border bg-gray-900 border-gray-800 hover:bg-gray-800"
        >
          Oder Datei hochladen
        </button>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
        />
      </div>

      {state.audio && (
        <div className="mt-4 bg-gray-900/60 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">Ausgewählt: {state.audio.name}</div>
            <button onClick={onRemoveAudio} className="text-xs text-red-400 hover:underline">Entfernen</button>
          </div>
          <audio
            className="mt-3 w-full"
            controls
            src={state.audio.dataUrl}
          />
        </div>
      )}
    </div>
  )
}
