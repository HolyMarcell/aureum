import React from 'react'
import { useApp } from '../context/AppContext'

export default function ApiKeyInput() {
  const { state, setApiKey } = useApp()
  const [key, setKey] = React.useState(state.apiKey || '')
  const [remember, setRemember] = React.useState(state.rememberApiKey)
  const [expanded, setExpanded] = React.useState(!state.apiKey)

  React.useEffect(() => {
    setKey(state.apiKey || '')
    setRemember(state.rememberApiKey)
    // Auto-collapse when a key exists; expand when it's empty
    setExpanded(!state.apiKey)
  }, [state.apiKey, state.rememberApiKey])

  if (!expanded && state.apiKey) {
    return (
      <div className="mt-4">
        <button
          aria-label="API Key bearbeiten"
          title="API Key bearbeiten"
          onClick={() => setExpanded(true)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-800 bg-gray-900/60 hover:bg-gray-800 text-gray-300 hover:text-white"
        >
          {/* Lock Closed Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12 1.5a4.5 4.5 0 00-4.5 4.5v3a3 3 0 00-3 3v6.75A3.75 3.75 0 008.25 22.5h7.5A3.75 3.75 0 0019.5 18.75V12a3 3 0 00-3-3v-3A4.5 4.5 0 0012 1.5zm3 7.5v-3a3 3 0 10-6 0v3h6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <label className="text-sm text-gray-300">OpenAI API Key</label>
        <a
          href="https://platform.openai.com/account/api-keys"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-aureum-yellow hover:underline"
        >Key erhalten</a>
      </div>
      <input
        type="password"
        placeholder="sk-..."
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="mt-2 w-full rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-aureum-yellow/60"
      />
      <div className="mt-2 flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-aureum-yellow"
          />
          In diesem Browser merken (LocalStorage)
        </label>
        <button
          onClick={() => {
            const trimmed = key.trim()
            setApiKey(trimmed, remember)
            if (trimmed) setExpanded(false)
          }}
          className="text-sm bg-aureum-yellow text-aureum-buttonText font-semibold rounded-md px-3 py-1.5 hover:brightness-110"
        >Speichern</button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Hinweis: Der Key wird clientseitig verwendet. Bei Nutzung ohne Backend ist er im Browser sichtbar.
      </p>
    </div>
  )
}
