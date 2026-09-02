import type { AiMessage } from '../../types/aiAssistant'
import { Icon } from '../icons/Icon'
import { AiChatPanel } from './AiChatPanel'

type AiAssistantProps = {
  messages: AiMessage[]
  isLoading: boolean
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  onSend: (message: string) => void
}

export function AiAssistant({
  messages,
  isLoading,
  isOpen,
  onClose,
  onOpen,
  onSend,
}: AiAssistantProps) {

  return (
    <>
      {!isOpen && (
        <button
          aria-label="Abrir asistente IA de demostración"
          className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-2xl bg-ink-800 p-3.5 text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-ink-700 sm:bottom-6 sm:right-6 sm:px-4"
          onClick={onOpen}
          type="button"
        >
          <span className="relative grid h-7 w-7 place-items-center rounded-lg bg-cyan-400 text-ink-900">
            <Icon className="h-4 w-4" name="sparkles" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-ink-800 bg-emerald-400" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-semibold">Asistente IA</span>
            <span className="block text-[9px] text-slate-400">Demostración mock</span>
          </span>
        </button>
      )}

      {isOpen && (
        <AiChatPanel
          isLoading={isLoading}
          messages={messages}
          onClose={onClose}
          onSend={onSend}
        />
      )}
    </>
  )
}
