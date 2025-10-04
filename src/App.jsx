import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import ProgressBar from './components/ProgressBar'
import RecorderUpload from './components/RecorderUpload'
import ParagraphsForm from './components/ParagraphsForm'
import SettingsDialog from './components/SettingsDialog'
import ApiKeyInput from './components/ApiKeyInput'
import ConsentDialog from './components/ConsentDialog'

function Content() {
  const { state, reset } = useApp()
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  return (
    <div className="min-h-screen pb-24">
      <ProgressBar />

      <header className="relative pt-16 px-4 sm:px-8">
        <button
          aria-label="Einstellungen"
          title="Einstellungen"
          onClick={() => setSettingsOpen(true)}
          className="absolute right-4 top-4 sm:right-8 sm:top-6 inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-800 bg-gray-900/60 hover:bg-gray-800 text-gray-300 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M11.49 3.17a1 1 0 011.02 0l1.09.63a2 2 0 001.93 0l1.09-.63a1 1 0 011.49.87v1.26a2 2 0 00.58 1.4l.9.9a1 1 0 010 1.41l-.9.9a2 2 0 00-.58 1.4v1.26a1 1 0 01-1.49.87l-1.09-.63a2 2 0 00-1.93 0l-1.09.63a1 1 0 01-1.02 0l-1.09-.63a2 2 0 00-1.93 0l-1.09.63a1 1 0 01-1.49-.87v-1.26a2 2 0 00-.58-1.4l-.9-.9a1 1 0 010-1.41l.9-.9a2 2 0 00.58-1.4V4.04a1 1 0 011.49-.87l1.09.63a2 2 0 001.93 0l1.09-.63zM12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="max-w-3xl mx-auto ">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight ">
            <span className="text-aureum-yellow">RadApp Reporting</span>
              <br/>
            <span className="text-gray-400 text-xl">KI Gestütze Radiologische Befunde</span>
          </h1>
        </div>
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

        {settingsOpen && (
          <SettingsDialog onClose={() => setSettingsOpen(false)} />
        )}

        <div className="mt-10 flex items-center justify-between">
          <div className="text-xs text-gray-500">Status: {state.status}</div>
          <button
            onClick={reset}
            className="text-sm rounded-md border border-gray-700 px-3 py-1.5 hover:bg-gray-800"
          >Zurücksetzen</button>
        </div>
      </main>
      {/* Content-blocking popover shown on first visit */}
      <ConsentDialog />
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
