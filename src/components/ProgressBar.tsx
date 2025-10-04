import React from 'react'
import { useApp } from '../context/AppContext'

export default function ProgressBar() {
  const { state } = useApp()
  const { progress, status } = state
  const display = Math.min(100, Math.max(0, Math.floor(progress)))
  const statusLabel = {
    idle: 'Bereit',
    recording: 'Aufnahme läuft…',
    uploading: 'Hochladen…',
    transcribing: 'Transkription…',
    analyzing: 'Auswertung…',
    complete: 'Fertig',
    error: 'Fehler',
  }[status] || 'Status'

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="h-1.5 w-full bg-gray-800">
        <div
          className="h-full bg-aureum-yellow transition-all"
          style={{ width: `${display}%` }}
        />
      </div>
      <div className="px-4 py-2 text-xs text-gray-400 bg-gray-950/60 backdrop-blur">
        <span className="text-aureum-yellow font-semibold mr-2">{display}%</span>
        {statusLabel}
      </div>
    </div>
  )
}
