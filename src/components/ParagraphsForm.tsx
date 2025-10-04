import React from 'react'
import { useApp, type Sections } from '../context/AppContext'

const fields: { key: keyof Sections; label: string }[] = [
  { key: 'anamnese', label: 'Anamnese' },
  { key: 'klinischeFragestellung', label: 'Klinische Fragestellung' },
  { key: 'untersuchungsart', label: 'Untersuchungsart' },
  { key: 'befund', label: 'Befund' },
  { key: 'beurteilung', label: 'Beurteilung' },
  { key: 'befundLaien', label: 'Befund in Laienverständlicher Sprache' },
  { key: 'beurteilungLaien', label: 'Beurteilung in Laienverständlicher Sprache' },
]

export default function ParagraphsForm() {
  const { state, setSection } = useApp()
  const [copied, setCopied] = React.useState<Partial<Record<keyof Sections, boolean>>>({})

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map(({ key, label }) => (
        <div
          key={key}
          className={`flex flex-col ${key === 'untersuchungsart' ? 'md:col-span-2' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-aureum-yellow font-semibold">{label}</label>
            {( ['untersuchungsart', 'befund', 'beurteilung'] as (keyof Sections)[] ).includes(key) && (
              <button
                type="button"
                title="Text in Zwischenablage kopieren"
                aria-label="Text in Zwischenablage kopieren"
                onClick={async () => {
                  const text = state.sections[key] || ''
                  try {
                    if (navigator.clipboard?.writeText && window.isSecureContext) {
                      await navigator.clipboard.writeText(text)
                    } else {
                      const ta = document.createElement('textarea')
                      ta.value = text
                      ta.style.position = 'fixed'
                      ta.style.opacity = '0'
                      document.body.appendChild(ta)
                      ta.focus()
                      ta.select()
                      document.execCommand('copy')
                      document.body.removeChild(ta)
                    }
                    setCopied((c) => ({ ...c, [key]: true }))
                    setTimeout(() => setCopied((c) => ({ ...c, [key]: false })), 1500)
                  } catch (e) {
                    console.error('Clipboard copy failed', e)
                  }
                }}
                className="text-xs rounded-md border border-gray-700 px-2 py-1 text-gray-300 hover:text-white hover:bg-gray-800 inline-flex items-center gap-1"
              >
                {copied[key] ? (
                  <>
                    <span className="text-green-400">✓</span>
                    <span>Kopiert</span>
                  </>
                ) : (
                  <span>Kopieren</span>
                )}
              </button>
            )}
          </div>
          <textarea
            rows={6}
            className="rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-aureum-yellow/60 resize-y"
            placeholder="Noch leer…"
            value={state.sections[key] || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSection(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}
