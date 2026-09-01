import { useMemo, useState } from 'react'
import { AlertFilters } from '../components/alerts/AlertFilters'
import { AlertsTable } from '../components/alerts/AlertsTable'
import { Icon } from '../components/icons/Icon'
import { Pagination } from '../components/ui/Pagination'
import { alertApplications, mockAlerts } from '../data/alertsMock'
import type { AlertFiltersState, AlertRule } from '../types/alert'

const pageSize = 7
const initialFilters: AlertFiltersState = {
  search: '',
  status: 'all',
  severity: 'all',
  application: 'all',
}

export function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertRule[]>(mockAlerts)
  const [filters, setFilters] = useState<AlertFiltersState>(initialFilters)
  const [page, setPage] = useState(1)

  const filteredAlerts = useMemo(() => {
    const search = filters.search.trim().toLocaleLowerCase('es-MX')

    return alerts.filter(
      (alert) =>
        (search === '' ||
          `${alert.name} ${alert.rule}`.toLocaleLowerCase('es-MX').includes(search)) &&
        (filters.status === 'all' || alert.status === filters.status) &&
        (filters.severity === 'all' || alert.severity === filters.severity) &&
        (filters.application === 'all' || alert.application === filters.application),
    )
  }, [alerts, filters])

  const activeCount = alerts.filter((alert) => alert.status === 'ACTIVE').length
  const inactiveCount = alerts.length - activeCount
  const triggerCount = alerts.reduce((total, alert) => total + alert.triggerCount24h, 0)
  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visibleAlerts = filteredAlerts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const updateFilters = (nextFilters: AlertFiltersState) => {
    setFilters(nextFilters)
    setPage(1)
  }

  const toggleAlert = (alertId: string) => {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: alert.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : alert,
      ),
    )
  }

  return (
    <section aria-labelledby="alerts-title" className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>LogSentinel</span>
            <Icon className="h-3.5 w-3.5" name="chevron" />
            <span className="text-slate-600">Alertas</span>
          </div>
          <h2
            className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            id="alerts-title"
          >
            Reglas de alertas
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Consulta las reglas que vigilan tus aplicaciones y su actividad reciente.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-lg font-semibold text-emerald-700">{activeCount}</p>
            <p className="mt-1 text-[10px] font-medium text-slate-500">Activas</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-lg font-semibold text-slate-600">{inactiveCount}</p>
            <p className="mt-1 text-[10px] font-medium text-slate-500">Inactivas</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-lg font-semibold text-cyan-700">{triggerCount}</p>
            <p className="mt-1 text-[10px] font-medium text-slate-500">Activaciones 24 h</p>
          </div>
        </div>
      </div>

      <AlertFilters
        applications={alertApplications}
        filters={filters}
        onChange={updateFilters}
        onReset={() => updateFilters(initialFilters)}
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Alertas configuradas</h3>
            <p className="mt-1 text-xs text-slate-500">
              {filteredAlerts.length} {filteredAlerts.length === 1 ? 'alerta encontrada' : 'alertas encontradas'}
            </p>
          </div>
          <p className="text-[10px] font-medium text-slate-400">Cambios locales de demostración</p>
        </div>

        <AlertsTable alerts={visibleAlerts} onToggle={toggleAlert} />
        <Pagination
          currentPage={currentPage}
          onPageChange={setPage}
          pageSize={pageSize}
          totalItems={filteredAlerts.length}
          totalPages={totalPages}
        />
      </div>
    </section>
  )
}
