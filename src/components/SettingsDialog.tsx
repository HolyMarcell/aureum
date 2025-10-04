import React from 'react'
import { useApp, ANALYSIS_PROMPT_PRESETS } from '../context/AppContext'

type Props = { onClose?: () => void }

export default function SettingsDialog({ onClose }: Props) {
  const { state, update } = useApp()
  const [mode, setMode] = React.useState<'standard' | 'concise' | 'custom'>(state.analysisPromptMode || 'standard')
  const [custom, setCustom] = React.useState<string>(state.customAnalysisPrompt || '')

  const handleSave = () => {
    update({ analysisPromptMode: mode, customAnalysisPrompt: custom })
    onClose?.()
  }

  const renderPresetPreview = (text: string) => (
    <div className="mt-2 max-h-40 overflow-auto rounded-md bg-gray-950 border border-gray-800 p-2 text-xs text-gray-300 whitespace-pre-wrap">
      {text}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 rounded-xl bg-gray-900 border border-gray-800 shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-aureum-yellow">Einstellungen</h2>
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <div>
            <label className="block text-sm font-medium text-gray-200">Analyse-Prompt</label>
            <p className="text-xs text-gray-400 mt-1">Wähle einen vordefinierten Prompt oder gib einen eigenen ein. Dieser steuert die Auswertung (ChatGPT) des Transkripts.</p>

            <div className="mt-3 space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="radio"
                  name="prompt_mode"
                  className="mt-1 accent-aureum-yellow"
                  checked={mode === 'standard'}
                  onChange={() => setMode('standard')}
                />
                <div>
                  <div className="text-sm text-gray-200">Standard (ausführlich)</div>
                  {mode === 'standard' && renderPresetPreview(ANALYSIS_PROMPT_PRESETS.standard)}
                </div>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="radio"
                  name="prompt_mode"
                  className="mt-1 accent-aureum-yellow"
                  checked={mode === 'concise'}
                  onChange={() => setMode('concise')}
                />
                <div>
                  <div className="text-sm text-gray-200">Klinisch fokussiert (knapp)</div>
                  {mode === 'concise' && renderPresetPreview(ANALYSIS_PROMPT_PRESETS.concise)}
                </div>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="radio"
                  name="prompt_mode"
                  className="mt-1 accent-aureum-yellow"
                  checked={mode === 'custom'}
                  onChange={() => setMode('custom')}
                />
                <div className="flex-1">
                  <div className="text-sm text-gray-200">Benutzerdefiniert</div>
                  <textarea
                    rows={8}
                    placeholder="Eigenen System-Prompt hier eingeben…"
                    className="mt-2 w-full rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-aureum-yellow/60 text-sm"
                    value={custom}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustom(e.target.value)}
                    disabled={mode !== 'custom'}
                  />
                  {mode !== 'custom' && (
                    <p className="mt-1 text-xs text-gray-500">Wähle „Benutzerdefiniert“, um das Textfeld zu bearbeiten.</p>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-md border border-gray-700 px-3 py-1.5 text-sm hover:bg-gray-800">Abbrechen</button>
          <button onClick={handleSave} className="rounded-md bg-aureum-yellow text-aureum-buttonText font-semibold px-3 py-1.5 text-sm hover:brightness-110">Speichern</button>
        </div>
      </div>
    </div>
  )
}
