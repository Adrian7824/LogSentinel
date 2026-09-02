import { useEffect, useRef, useState, type FormEvent } from 'react'
import { aiSuggestedPrompts } from '../../data/aiAssistantMock'
import type { AiMessage as AiMessageType } from '../../types/aiAssistant'
import { Icon } from '../icons/Icon'
import { AiMessage } from './AiMessage'
import { AiPromptSuggestions } from './AiPromptSuggestions'
import { AiTypingIndicator } from './AiTypingIndicator'

type AiChatPanelProps = {
  messages: AiMessageType[]
  isLoading: boolean
  onClose: () => void
  onSend: (message: string) => void
}

export function AiChatPanel({ messages, isLoading, onClose, onSend }: AiChatPanelProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [isLoading, messages])

  const sendCurrentMessage = () => {
    const message = input.trim()
    if (!message || isLoading) return
    onSend(message)
    setInput('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendCurrentMessage()
  }

  return (
    <section
      aria-label="Asistente IA de demostración"
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-slate-50 shadow-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(680px,calc(100vh-3rem))] sm:w-[420px] sm:rounded-3xl sm:border sm:border-slate-200"
    >
      <header className="relative overflow-hidden bg-ink-900 px-5 py-4 text-white">
        <span className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-ink-900 shadow-lg shadow-cyan-500/20">
              <Icon className="h-5 w-5" name="sparkles" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Asistente IA</h2>
                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-amber-300/20">
                  Mock
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Demo local · Sin conexión a IA real
              </p>
            </div>
          </div>
          <button
            aria-label="Cerrar asistente"
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-white/5 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <Icon name="x" />
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-5 sm:px-5">
        {messages.map((message) => (
          <AiMessage key={message.id} message={message} onNavigate={onClose} />
        ))}
        {isLoading && <AiTypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <AiPromptSuggestions
          disabled={isLoading}
          onSelect={onSend}
          prompts={aiSuggestedPrompts}
        />
      )}

      <form className="border-t border-slate-200 bg-white p-3 sm:p-4" onSubmit={handleSubmit}>
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-cyan-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-100">
          <textarea
            aria-label="Pregunta para el asistente"
            className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-xs leading-5 text-slate-700 outline-none placeholder:text-slate-400"
            disabled={isLoading}
            maxLength={400}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                sendCurrentMessage()
              }
            }}
            placeholder="Pregunta sobre logs o incidentes..."
            rows={1}
            value={input}
          />
          <button
            aria-label="Enviar mensaje"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-500 text-white shadow-sm transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!input.trim() || isLoading}
            type="submit"
          >
            <Icon className="h-4 w-4" name="send" />
          </button>
        </div>
        <p className="mt-2 text-center text-[9px] text-slate-400">
          Las respuestas se generan con reglas y datos mock del frontend.
        </p>
      </form>
    </section>
  )
}
