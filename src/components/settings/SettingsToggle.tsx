type SettingsToggleProps = {
  checked: boolean
  label: string
  description: string
  onChange: (checked: boolean) => void
}

export function SettingsToggle({
  checked,
  label,
  description,
  onChange,
}: SettingsToggleProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300">
      <span>
        <span className="block text-xs font-semibold text-slate-700">{label}</span>
        <span className="mt-1 block text-[10px] leading-4 text-slate-400">{description}</span>
      </span>
      <input
        checked={checked}
        className="peer sr-only"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-slate-200 transition peer-checked:bg-cyan-600 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-300 peer-focus-visible:ring-offset-2">
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked ? 'left-6' : 'left-1'}`} />
      </span>
    </label>
  )
}
