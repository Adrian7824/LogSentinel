type AiPromptSuggestionsProps = {
  prompts: readonly string[]
  disabled: boolean
  onSelect: (prompt: string) => void
}

export function AiPromptSuggestions({
  prompts,
  disabled,
  onSelect,
}: AiPromptSuggestionsProps) {
  return (
    <div className="px-4 pb-3 sm:px-5">
      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Preguntas sugeridas
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap">
        {prompts.map((prompt) => (
          <button
            className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-medium text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            key={prompt}
            onClick={() => onSelect(prompt)}
            type="button"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
