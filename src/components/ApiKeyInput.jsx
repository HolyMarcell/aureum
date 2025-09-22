import React from 'react'
import { useApp } from '../context/AppContext'

export default function ApiKeyInput() {
  const { state, setApiKey } = useApp()
  const [key, setKey] = React.useState(state.apiKey || '')
  const [remember, setRemember] = React.useState(state.rememberApiKey)

  React.useEffect(() => {
    setKey(state.apiKey || '')
    setRemember(state.rememberApiKey)
  }, [state.apiKey, state.rememberApiKey])

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
          onClick={() => setApiKey(key.trim(), remember)}
          className="text-sm bg-aureum-yellow text-black font-semibold rounded-md px-3 py-1.5 hover:brightness-110"
        >Speichern</button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Hinweis: Der Key wird clientseitig verwendet. Bei Nutzung ohne Backend ist er im Browser sichtbar.
      </p>
    </div>
  )
}

