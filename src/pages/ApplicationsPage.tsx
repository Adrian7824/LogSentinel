import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ApplicationDetailPanel } from '../components/applications/ApplicationDetailPanel'
import { ApplicationEditorDrawer } from '../components/applications/ApplicationEditorDrawer'
import { ApplicationFilters } from '../components/applications/ApplicationFilters'
import {
  ApplicationsGrid,
  type ApplicationGridItem,
} from '../components/applications/ApplicationsGrid'
import { Icon } from '../components/icons/Icon'
import {
  getApplicationContext,
  getApplicationStats,
  getSessionApplications,
  saveSessionApplications,
} from '../services/applicationMockService'
import type {
  ApplicationFiltersState,
  ApplicationStatus,
  MonitoredApplication,
} from '../types/application'

const initialFilters: ApplicationFiltersState = {
  search: '',
  status: 'all',
  environment: 'all',
}

function getEffectiveStatus(application: MonitoredApplication): ApplicationStatus {
  return application.monitored ? application.health : 'PAUSED'
}

function getNextApplicationId(applications: MonitoredApplication[]) {
  const nextNumber =
    Math.max(
      ...applications.map((application) => Number(application.id.replace('APP-', ''))),
      0,
    ) + 1
  return `APP-${String(nextNumber).padStart(3, '0')}`
}

export function ApplicationsPage() {
  const [searchParams] = useSearchParams()
  const [applications, setApplications] = useState<MonitoredApplication[]>(getSessionApplications)
  const [filters, setFilters] = useState<ApplicationFiltersState>(initialFilters)
  const [selectedApplication, setSelectedApplication] = useState<MonitoredApplication | null>(null)
  const [editingApplication, setEditingApplication] = useState<MonitoredApplication | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  useEffect(() => {
    const linkedApplication = searchParams.get('app')
    if (linkedApplication) {
      setSelectedApplication(
        getSessionApplications().find(
          (application) => application.name === linkedApplication,
        ) ?? null,
      )
    }
  }, [searchParams])

  const filteredItems = useMemo<ApplicationGridItem[]>(() => {
    const search = filters.search.trim().toLocaleLowerCase('es-MX')
    return applications
      .filter((application) => {
        const searchableText = [
          application.name,
          application.description,
          application.team,
          ...application.technologies,
        ]
          .join(' ')
          .toLocaleLowerCase('es-MX')

        return (
          (search === '' || searchableText.includes(search)) &&
          (filters.status === 'all' || getEffectiveStatus(application) === filters.status) &&
          (filters.environment === 'all' || application.environment === filters.environment)
        )
      })
      .map((application) => ({
        application,
        stats: getApplicationStats(application.name),
      }))
  }, [applications, filters])

  const selectedContext = useMemo(
    () => selectedApplication ? getApplicationContext(selectedApplication.name) : null,
    [selectedApplication],
  )

  const summary = useMemo(
    () => ({
      monitored: applications.filter((application) => application.monitored).length,
      healthy: applications.filter(
        (application) => application.monitored && application.health === 'HEALTHY',
      ).length,
      attention: applications.filter(
        (application) =>
          application.monitored &&
          (application.health === 'DEGRADED' || application.health === 'CRITICAL'),
      ).length,
      paused: applications.filter((application) => !application.monitored).length,
    }),
    [applications],
  )

  const updateFilters = (nextFilters: ApplicationFiltersState) => {
    setFilters(nextFilters)
  }

  const openEditor = (application: MonitoredApplication | null) => {
    setSelectedApplication(null)
    setEditingApplication(application)
    setIsEditorOpen(true)
  }

  const saveApplication = (application: MonitoredApplication) => {
    setApplications((currentApplications) => {
      const exists = currentApplications.some((item) => item.id === application.id)
      const nextApplications = exists
        ? currentApplications.map((item) => (item.id === application.id ? application : item))
        : [application, ...currentApplications]
      saveSessionApplications(nextApplications)
      return nextApplications
    })
    setIsEditorOpen(false)
    setEditingApplication(null)
    setSelectedApplication(application)
  }

  const toggleMonitoring = (applicationId: string) => {
    setApplications((currentApplications) => {
      const nextApplications = currentApplications.map<MonitoredApplication>((application) =>
        application.id === applicationId
          ? { ...application, monitored: !application.monitored }
          : application,
      )
      saveSessionApplications(nextApplications)
      return nextApplications
    })
    setSelectedApplication((currentApplication) =>
      currentApplication?.id === applicationId
        ? { ...currentApplication, monitored: !currentApplication.monitored }
        : currentApplication,
    )
  }

  return (
    <section aria-labelledby="applications-title" className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>LogSentinel</span>
            <Icon className="h-3.5 w-3.5" name="chevron" />
            <span className="text-slate-600">Aplicaciones</span>
          </div>
          <h2
            className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            id="applications-title"
          >
            Catálogo de aplicaciones
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Centraliza la metadata y el contexto de observabilidad disponible para cada servicio.
          </p>
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-800 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-ink-700"
          onClick={() => openEditor(null)}
          type="button"
        >
          <Icon className="h-4 w-4 text-cyan-300" name="apps" />
          Registrar aplicación
        </button>
      </div>

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-cyan-200 bg-cyan-50/60 px-4 py-3 text-cyan-900 sm:px-5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" name="apps" />
        <p className="text-[11px] leading-5">
          Catálogo de demostración sin backend ni conexiones. Las métricas se calculan con los datos mock existentes y los cambios se pierden al recargar.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['Monitoreadas', summary.monitored, 'text-cyan-700 bg-cyan-50'],
          ['Saludables', summary.healthy, 'text-emerald-700 bg-emerald-50'],
          ['Requieren atención', summary.attention, 'text-amber-700 bg-amber-50'],
          ['Pausadas', summary.paused, 'text-slate-600 bg-slate-100'],
        ].map(([label, value, style]) => (
          <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4" key={label}>
            <p className={`inline-flex min-w-8 justify-center rounded-lg px-2 py-1 text-lg font-semibold ${style}`}>
              {value}
            </p>
            <p className="mt-2 text-[10px] font-medium text-slate-500">{label}</p>
          </article>
        ))}
      </div>

      <ApplicationFilters
        filters={filters}
        onChange={updateFilters}
        onReset={() => updateFilters(initialFilters)}
      />

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <p className="text-xs text-slate-500">
            {filteredItems.length}{' '}
            {filteredItems.length === 1 ? 'aplicación encontrada' : 'aplicaciones encontradas'}
          </p>
          <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400">Datos locales</p>
        </div>
        <ApplicationsGrid
          items={filteredItems}
          onEdit={openEditor}
          onSelect={setSelectedApplication}
          onToggleMonitoring={toggleMonitoring}
        />
      </div>

      <ApplicationDetailPanel
        application={selectedApplication}
        context={selectedContext}
        onClose={() => setSelectedApplication(null)}
        onEdit={openEditor}
        onToggleMonitoring={toggleMonitoring}
      />

      {isEditorOpen && (
        <ApplicationEditorDrawer
          application={editingApplication}
          key={editingApplication?.id ?? 'new-application'}
          newApplicationId={getNextApplicationId(applications)}
          onClose={() => {
            setIsEditorOpen(false)
            setEditingApplication(null)
          }}
          onSave={saveApplication}
        />
      )}
    </section>
  )
}
