export function AiTypingIndicator() {
  return (
    <div aria-label="El asistente está generando una respuesta" className="flex items-start gap-2.5" role="status">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cyan-50 text-[10px] font-bold text-cyan-700 ring-1 ring-cyan-100">
        AI
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
        {[0, 1, 2].map((dot) => (
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-500"
            key={dot}
            style={{ animationDelay: `${dot * 120}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
