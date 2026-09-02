import { useState, type FormEvent } from 'react'
import type {
  ApplicationEnvironment,
  ApplicationHealth,
  MonitoredApplication,
} from '../../types/application'
import { DetailDrawer } from '../ui/DetailDrawer'

type ApplicationEditorDrawerProps = {
  application: MonitoredApplication | null
  newApplicationId: string
  onClose: () => void
  onSave: (application: MonitoredApplication) => void
}

const inputClassName =
  'mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-50 disabled:text-slate-400'

function createEmptyApplication(id: string): MonitoredApplication {
  return {
    id,
    name: '',
    description: '',
    team: '',
    version: '1.0.0',
    environment: 'development',
    health: 'HEALTHY',
    monitored: true,
    lastDeploymentAt: null,
    technologies: [],
  }
}

export function ApplicationEditorDrawer({
  application,
  newApplicationId,
  onClose,
  onSave,
}: ApplicationEditorDrawerProps) {
  const [draft, setDraft] = useState<MonitoredApplication>(() =>
    application
      ? { ...application, technologies: [...application.technologies] }
      : createEmptyApplication(newApplicationId),
  )
  const [technologies, setTechnologies] = useState(draft.technologies.join(', '))
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft.name.trim() || !draft.description.trim() || !draft.team.trim()) {
      setError('Completa el nombre, la descripción y el equipo responsable.')
      return
    }

    onSave({
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      team: draft.team.trim(),
      version: draft.version.trim() || '1.0.0',
      technologies: technologies
        .split(',')
        .map((technology) => technology.trim())
        .filter(Boolean),
    })
  }

  return (
    <DetailDrawer
      headerContent={
        <span className="mb-2 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
          Catálogo local
        </span>
      }
      onClose={onClose}
      title={application ? 'Editar aplicación' : 'Registrar aplicación'}
    >
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 px-4 py-3 text-[10px] leading-5 text-cyan-800">
          Este formulario solo registra metadata de demostración. No solicita endpoints, hosts ni credenciales.
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:col-span-2">
            Nombre
            <input
              className={inputClassName}
              disabled={Boolean(application)}
              maxLength={70}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="Nombre del servicio"
              type="text"
              value={draft.name}
            />
            {application && (
              <span className="mt-1 block normal-case tracking-normal text-slate-400">
                El nombre se mantiene para conservar la relación con los datos mock existentes.
              </span>
            )}
          </label>

          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:col-span-2">
            Descripción
            <textarea
              className="mt-1.5 min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs leading-5 text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              maxLength={240}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              placeholder="Responsabilidad principal de la aplicación"
              value={draft.description}
            />
          </label>

          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Equipo responsable
            <input
              className={inputClassName}
              maxLength={60}
              onChange={(event) => setDraft({ ...draft, team: event.target.value })}
              placeholder="Ej. Plataforma"
              type="text"
              value={draft.team}
            />
          </label>

          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Versión
            <input
              className={inputClassName}
              maxLength={30}
              onChange={(event) => setDraft({ ...draft, version: event.target.value })}
              placeholder="1.0.0"
              type="text"
              value={draft.version}
            />
          </label>

          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Entorno
            <select
              className={inputClassName}
              onChange={(event) => setDraft({
                ...draft,
                environment: event.target.value as ApplicationEnvironment,
              })}
              value={draft.environment}
            >
              <option value="production">Producción</option>
              <option value="staging">Staging</option>
              <option value="development">Desarrollo</option>
            </select>
          </label>

          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Salud simulada
            <select
              className={inputClassName}
              onChange={(event) => setDraft({
                ...draft,
                health: event.target.value as ApplicationHealth,
              })}
              value={draft.health}
            >
              <option value="HEALTHY">Saludable</option>
              <option value="DEGRADED">Degradada</option>
              <option value="CRITICAL">Crítica</option>
            </select>
          </label>

          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:col-span-2">
            Tecnologías
            <input
              className={inputClassName}
              onChange={(event) => setTechnologies(event.target.value)}
              placeholder="Java, Kafka, PostgreSQL"
              type="text"
              value={technologies}
            />
            <span className="mt-1 block normal-case tracking-normal text-slate-400">Separa cada valor con una coma.</span>
          </label>
        </div>

        <label className="mt-5 flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <span>
            <span className="block text-xs font-semibold text-slate-700">Monitoreo visual activo</span>
            <span className="mt-1 block text-[10px] leading-4 text-slate-400">
              Solo cambia el estado mostrado; no inicia ninguna conexión.
            </span>
          </span>
          <input
            checked={draft.monitored}
            className="h-4 w-4 accent-cyan-600"
            onChange={(event) => setDraft({ ...draft, monitored: event.target.checked })}
            type="checkbox"
          />
        </label>

        {error && (
          <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700" role="alert">
            {error}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="rounded-xl bg-ink-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-ink-700"
            type="submit"
          >
            {application ? 'Guardar cambios' : 'Registrar aplicación'}
          </button>
        </div>
      </form>
    </DetailDrawer>
  )
}
