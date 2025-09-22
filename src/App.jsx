import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import ProgressBar from './components/ProgressBar'
import RecorderUpload from './components/RecorderUpload'
import ParagraphsForm from './components/ParagraphsForm'
import ApiKeyInput from './components/ApiKeyInput'

function Content() {
  const { state, reset } = useApp()
  return (
    <div className="min-h-screen pb-24">
      <ProgressBar />

      <header className="pt-16 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          <span className="text-aureum-yellow">Aureum</span>
          <span className="text-gray-400"> — Medizinische Sprachaufnahme & Auswertung</span>
        </h1>
        <p className="mt-2 text-gray-400 max-w-2xl">
          Eine einfache Ein-Seiten-App: Aufnahme oder Upload einer Audiodatei, automatische Transkription und strukturierte Auswertung in sieben Abschnitten auf Deutsch.
        </p>
      </header>

      <main className="px-4 sm:px-8 max-w-5xl mx-auto">
        <ApiKeyInput />
        <RecorderUpload />

        {state.error && (
          <div className="mt-4 p-3 rounded-lg border border-red-700 bg-red-900/30 text-red-200">
            {state.error}
          </div>
        )}

        {state.transcript && (
          <div className="mt-8 bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-aureum-yellow">Transkript</h2>
            <p className="mt-1 text-sm text-gray-300 whitespace-pre-wrap">{state.transcript}</p>
          </div>
        )}

        <ParagraphsForm />

        <div className="mt-10 flex items-center justify-between">
          <div className="text-xs text-gray-500">Status: {state.status}</div>
          <button
            onClick={reset}
            className="text-sm rounded-md border border-gray-700 px-3 py-1.5 hover:bg-gray-800"
          >Zurücksetzen</button>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  )
}

