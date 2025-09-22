import React from 'react'
import { useApp } from '../context/AppContext'

const fields = [
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

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map(({ key, label }) => (
        <div
          key={key}
          className={`flex flex-col ${key === 'untersuchungsart' ? 'md:col-span-2' : ''}`}
        >
          <label className="text-sm text-aureum-yellow font-semibold mb-2">{label}</label>
          <textarea
            rows={6}
            className="rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-aureum-yellow/60 resize-y"
            placeholder="Noch leer…"
            value={state.sections[key] || ''}
            onChange={(e) => setSection(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}
