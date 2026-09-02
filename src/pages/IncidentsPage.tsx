import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { IncidentDetailPanel } from '../components/incidents/IncidentDetailPanel'
import { IncidentFilters } from '../components/incidents/IncidentFilters'
import { IncidentsTable } from '../components/incidents/IncidentsTable'
import { Pagination } from '../components/ui/Pagination'
import { Icon } from '../components/icons/Icon'
import { mockIncidents } from '../data/incidentsMock'
import { useAiAssistantActions } from '../hooks/useAiAssistantActions'
import type { Incident, IncidentFiltersState, IncidentStatus } from '../types/incident'

const pageSize = 6
const initialFilters: IncidentFiltersState = { status: 'all', severity: 'all' }

const summaryConfig: Array<{ status: IncidentStatus; label: string; style: string }> = [
  { status: 'OPEN', label: 'Abiertos', style: 'text-rose-700 bg-rose-50' },
  { status: 'INVESTIGATING', label: 'Investigando', style: 'text-amber-700 bg-amber-50' },
  { status: 'RESOLVED', label: 'Resueltos', style: 'text-emerald-700 bg-emerald-50' },
]

export function IncidentsPage() {
  const [searchParams] = useSearchParams()
  const { openAssistant } = useAiAssistantActions()
  const [filters, setFilters] = useState<IncidentFiltersState>(initialFilters)
  const [page, setPage] = useState(1)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)

  useEffect(() => {
    const linkedIncidentId = searchParams.get('incident')
    if (linkedIncidentId) {
      setSelectedIncident(
        mockIncidents.find((incident) => incident.id === linkedIncidentId) ?? null,
      )
    }
  }, [searchParams])

  const filteredIncidents = useMemo(
    () =>
      mockIncidents.filter(
        (incident) =>
          (filters.status === 'all' || incident.status === filters.status) &&
          (filters.severity === 'all' || incident.severity === filters.severity),
      ),
    [filters],
  )

  const totalPages = Math.max(1, Math.ceil(filteredIncidents.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visibleIncidents = filteredIncidents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const updateFilters = (nextFilters: IncidentFiltersState) => {
    setFilters(nextFilters)
    setPage(1)
  }

  return (
    <section aria-labelledby="incidents-title" className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>LogSentinel</span>
            <Icon className="h-3.5 w-3.5" name="chevron" />
            <span className="text-slate-600">Incidentes</span>
          </div>
          <h2
            className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            id="incidents-title"
          >
            Gestión de incidentes
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Consulta los problemas detectados y el avance de su investigación.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          {summaryConfig.map((item) => {
            const count = mockIncidents.filter((incident) => incident.status === item.status).length
            return (
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" key={item.status}>
                <p className={`inline-flex rounded-md px-1.5 py-0.5 text-lg font-semibold ${item.style}`}>
                  {count}
                </p>
                <p className="mt-1 text-[10px] font-medium text-slate-500">{item.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      <IncidentFilters
        filters={filters}
        onChange={updateFilters}
        onReset={() => updateFilters(initialFilters)}
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Incidentes registrados</h3>
            <p className="mt-1 text-xs text-slate-500">
              {filteredIncidents.length}{' '}
              {filteredIncidents.length === 1 ? 'incidente encontrado' : 'incidentes encontrados'}
            </p>
          </div>
          <p className="text-[10px] font-medium text-slate-400">Datos de demostración</p>
        </div>

        <IncidentsTable incidents={visibleIncidents} onSelect={setSelectedIncident} />
        <Pagination
          currentPage={currentPage}
          onPageChange={setPage}
          pageSize={pageSize}
          totalItems={filteredIncidents.length}
          totalPages={totalPages}
        />
      </div>

      <IncidentDetailPanel
        incident={selectedIncident}
        onAnalyze={(incident) => {
          setSelectedIncident(null)
          openAssistant(`Analiza el incidente ${incident.id}`)
        }}
        onClose={() => setSelectedIncident(null)}
      />
    </section>
  )
}
