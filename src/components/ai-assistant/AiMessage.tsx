import { Link } from 'react-router-dom'
import type { AiMessage as AiMessageType } from '../../types/aiAssistant'
import { Icon } from '../icons/Icon'

type AiMessageProps = {
  message: AiMessageType
  onNavigate: () => void
}

const timeFormatter = new Intl.DateTimeFormat('es-MX', {
  hour: '2-digit',
  minute: '2-digit',
})

export function AiMessage({ message, onNavigate }: AiMessageProps) {
  const isAssistant = message.role === 'assistant'

  return (
    <article className={`flex gap-2.5 ${isAssistant ? 'items-start' : 'justify-end'}`}>
      {isAssistant && (
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
          <Icon className="h-3.5 w-3.5" name="sparkles" />
        </span>
      )}
      <div className={`max-w-[82%] ${isAssistant ? '' : 'text-right'}`}>
        <div
          className={`rounded-2xl px-3.5 py-3 text-left text-xs leading-5 ${
            isAssistant
              ? 'rounded-tl-md border border-slate-200 bg-white text-slate-600 shadow-sm'
              : 'rounded-tr-md bg-ink-800 text-slate-100'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          {message.analysis && message.analysis.length > 0 && (
            <div className="mt-3 space-y-2.5">
              {message.analysis.map((section, index) => (
                <section
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-3"
                  key={`${message.id}-${section.title}-${index}`}
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">
                    {section.title}
                  </h3>
                  <p className="mt-1 whitespace-pre-wrap text-[11px] leading-5 text-slate-600">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>
          )}
          {message.evidence && message.evidence.length > 0 && (
            <div className={`mt-3 flex flex-wrap gap-2 border-t pt-2.5 ${isAssistant ? 'border-slate-100' : 'border-white/10'}`}>
              {message.evidence.map((evidence) => (
                <Link
                  className="inline-flex items-center gap-1 rounded-lg bg-cyan-50 px-2 py-1 text-[10px] font-semibold text-cyan-700 transition hover:bg-cyan-100"
                  key={`${message.id}-${evidence.label}`}
                  onClick={onNavigate}
                  to={evidence.path}
                >
                  {evidence.label}
                  <Icon className="h-3 w-3" name="chevron" />
                </Link>
              ))}
            </div>
          )}
        </div>
        <time className="mt-1 block px-1 text-[9px] text-slate-400">
          {timeFormatter.format(new Date(message.createdAt))}
        </time>
      </div>
    </article>
  )
}
