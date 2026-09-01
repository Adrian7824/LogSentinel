import { Icon } from '../components/icons/Icon'

type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>LogSentinel</span>
          <Icon className="h-3.5 w-3.5" name="chevron" />
          <span className="text-slate-600">{title}</span>
        </div>
        <h2
          className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
          id="page-title"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel sm:min-h-[440px]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-400 via-sky-500 to-indigo-500" />
        <div className="grid min-h-[360px] place-items-center px-6 text-center sm:min-h-[440px]">
          <div className="max-w-md">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 ring-8 ring-slate-50">
              <Icon className="h-6 w-6" name="dashboard" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              Área de trabajo preparada
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              El contenido de {title.toLowerCase()} se incorporará en su tarea funcional correspondiente.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
