import type {
  AiAnalysisSection,
  AiEvidenceLink,
  AiMockResponse,
} from '../types/aiAssistant'
import type { LogEntry, Severity } from '../types/log'

const errorSeverities: Severity[] = ['ERROR', 'CRITICAL']

function plural(value: number, singular: string, pluralForm: string) {
  return `${value} ${value === 1 ? singular : pluralForm}`
}

function formatMetadata(log: LogEntry) {
  return Object.entries(log.metadata)
    .slice(0, 5)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(', ')
}

function possibleMeaning(log: LogEntry) {
  const statusCode = Number(log.metadata.status_code)

  if (statusCode >= 500 || /timeout|timed out/i.test(log.message)) {
    return 'La solicitud podría haber fallado por indisponibilidad o demora de una dependencia.'
  }
  if (/token|login|auth|signature/i.test(`${log.message} ${log.raw}`)) {
    return 'El evento podría estar relacionado con validación de identidad, sesión o credenciales.'
  }
  if (/queue|capacity|pool/i.test(`${log.message} ${log.raw}`)) {
    return 'Los datos disponibles sugieren presión sobre un recurso o una cola de procesamiento.'
  }
  if (/provider|smtp|delivery/i.test(`${log.message} ${log.raw}`)) {
    return 'El evento podría estar relacionado con un proveedor externo o con su mecanismo de entrega.'
  }
  if (log.severity === 'INFO') {
    return 'Parece un evento informativo del flujo normal de la aplicación.'
  }
  return 'El mensaje indica una condición fuera de lo esperado que conviene contrastar con eventos cercanos.'
}

function recommendation(log: LogEntry) {
  const checks = [`los eventos de ${log.application} próximos a esta marca de tiempo`]
  if (log.durationMs >= 1000) checks.push('la latencia y disponibilidad de sus dependencias')
  if (log.incidentId) checks.push(`la actividad del incidente ${log.incidentId}`)
  if (log.metadata.retries) checks.push('la política de reintentos configurada')

  return `Sería recomendable revisar ${checks.join(', ')} y seguir el trace ID ${log.traceId} antes de establecer una causa.`
}

function buildLinks(logs: LogEntry[]): AiEvidenceLink[] {
  const firstLog = logs[0]
  if (!firstLog) return []

  return [
    { label: `Ver ${firstLog.id}`, path: `/logs?log=${firstLog.id}` },
    { label: `Buscar ${firstLog.traceId}`, path: `/logs?search=${firstLog.traceId}` },
    {
      label: `Ver ${firstLog.application}`,
      path: `/aplicaciones?app=${encodeURIComponent(firstLog.application)}`,
    },
    ...(firstLog.incidentId
      ? ([
          {
            label: `Ver ${firstLog.incidentId}`,
            path: `/incidentes?incident=${firstLog.incidentId}`,
          },
        ] satisfies AiEvidenceLink[])
      : []),
  ]
}

export function findRelatedLogs(log: LogEntry, logs: LogEntry[]) {
  return logs
    .filter(
      (candidate) =>
        candidate.id !== log.id &&
        (candidate.traceId === log.traceId || candidate.application === log.application),
    )
    .slice(0, 3)
}

export function explainLogMock(log: LogEntry, logs: LogEntry[]): AiMockResponse {
  const relatedLogs = findRelatedLogs(log, logs)
  const evidence = [log, ...relatedLogs]

  const analysis: AiAnalysisSection[] = [
    {
      title: 'Resumen',
      content: `${log.application} registró un evento ${log.severity}: “${log.message}”. Ocurrió en ${log.environment} y tomó ${log.durationMs.toLocaleString('es-MX')} ms.`,
    },
    {
      title: 'Evidencia encontrada',
      content: `Origen ${log.source}; trace ID ${log.traceId}; metadata relevante: ${formatMetadata(log)}.${relatedLogs.length > 0 ? ` También encontré ${plural(relatedLogs.length, 'evento cercano', 'eventos cercanos')} de la misma aplicación: ${relatedLogs.map((item) => item.id).join(', ')}.` : ''}`,
    },
    {
      title: 'Posible causa',
      content: `${possibleMeaning(log)} Esta interpretación se basa únicamente en reglas y datos mock, por lo que no confirma una causa definitiva.`,
    },
    {
      title: 'Recomendación',
      content: recommendation(log),
    },
  ]

  return {
    content: `Análisis simulado de ${log.id}`,
    analysis,
    evidence: buildLinks(evidence),
  }
}

export function summarizeEventsMock(logs: LogEntry[]): AiMockResponse {
  const errorLogs = logs.filter((log) => errorSeverities.includes(log.severity))
  const applications = new Set(logs.map((log) => log.application))
  const severityCounts = logs.reduce<Record<Severity, number>>(
    (counts, log) => ({ ...counts, [log.severity]: counts[log.severity] + 1 }),
    { INFO: 0, WARNING: 0, ERROR: 0, CRITICAL: 0 },
  )
  const predominantSeverity = Object.entries(severityCounts).sort((a, b) => b[1] - a[1])[0]
  const relevant = errorLogs.slice(0, 3)

  return {
    content: 'Resumen simulado de los eventos disponibles',
    analysis: [
      {
        title: 'Resumen',
        content: `Se analizaron ${plural(logs.length, 'evento', 'eventos')} de ${plural(applications.size, 'aplicación', 'aplicaciones')}. ${plural(errorLogs.length, 'evento es ERROR o CRITICAL', 'eventos son ERROR o CRITICAL')}.`,
      },
      {
        title: 'Evidencia encontrada',
        content: `Distribución: INFO ${severityCounts.INFO}, WARNING ${severityCounts.WARNING}, ERROR ${severityCounts.ERROR} y CRITICAL ${severityCounts.CRITICAL}. La severidad predominante es ${predominantSeverity?.[0] ?? 'sin datos'}. Eventos destacados: ${relevant.map((log) => `${log.id} (${log.application})`).join(', ') || 'ninguno'}.`,
      },
      {
        title: 'Posible causa',
        content: 'El resumen no determina una causa. Los eventos de mayor severidad podrían señalar los flujos que requieren revisión prioritaria.',
      },
      {
        title: 'Recomendación',
        content: 'Sería recomendable comenzar por los eventos CRITICAL y continuar con los ERROR que tengan un incidente o código 5xx relacionado.',
      },
    ],
    evidence: buildLinks(relevant),
  }
}

export function detectPatternsMock(logs: LogEntry[]): AiMockResponse {
  const errorLogs = logs.filter((log) => errorSeverities.includes(log.severity))
  const failuresByApplication = errorLogs.reduce<Record<string, number>>(
    (counts, log) => ({
      ...counts,
      [log.application]: (counts[log.application] ?? 0) + 1,
    }),
    {},
  )
  const rankedApplications = Object.entries(failuresByApplication).sort((a, b) => b[1] - a[1])
  const repeatedApplications = rankedApplications.filter(([, count]) => count > 1)
  const fiveHundreds = logs.filter((log) => {
    const statusCode = Number(log.metadata.status_code)
    return statusCode >= 500 && statusCode < 600
  })
  const recentErrors = errorLogs.filter(
    (log) => Date.now() - new Date(log.timestamp).getTime() <= 60 * 60 * 1000,
  )
  const evidence = errorLogs.slice(0, 3)

  return {
    content: 'Patrones detectados mediante reglas locales de demostración',
    analysis: [
      {
        title: 'Resumen',
        content: `${plural(errorLogs.length, 'falla', 'fallas')} distribuidas entre ${plural(rankedApplications.length, 'aplicación', 'aplicaciones')}; ${plural(recentErrors.length, 'ocurrió', 'ocurrieron')} durante la última hora de datos mock.`,
      },
      {
        title: 'Evidencia encontrada',
        content: `${repeatedApplications.length > 0 ? `Aplicaciones con errores repetidos: ${repeatedApplications.map(([application, count]) => `${application} (${count})`).join(', ')}.` : 'No hay una aplicación con más de un error en la muestra.'} Se encontraron ${plural(fiveHundreds.length, 'respuesta 5xx', 'respuestas 5xx')}. Trace IDs destacados: ${evidence.map((log) => log.traceId).join(', ') || 'ninguno'}.`,
      },
      {
        title: 'Posible causa',
        content: 'La concentración de fallas podría estar relacionada con dependencias no disponibles, tiempos de espera o rechazos de proveedores. Las reglas mock no prueban correlación entre los eventos.',
      },
      {
        title: 'Recomendación',
        content: `Sería recomendable revisar primero ${rankedApplications[0]?.[0] ?? 'las aplicaciones afectadas'}, comparar los códigos 5xx y seguir cada trace ID antes de agrupar los eventos en un mismo incidente.`,
      },
    ],
    evidence: buildLinks(evidence),
  }
}

export function buildSearchResultMock(
  title: string,
  logs: LogEntry[],
  emptyMessage: string,
): AiMockResponse {
  if (logs.length === 0) {
    return {
      content: emptyMessage,
      analysis: [
        { title: 'Resumen', content: 'No se encontraron coincidencias en los datos mock.' },
        {
          title: 'Recomendación',
          content: 'Sería recomendable probar con una aplicación, código de estado, log ID o trace ID diferente.',
        },
      ],
      evidence: [{ label: 'Abrir explorador de logs', path: '/logs' }],
    }
  }

  return {
    content: title,
    analysis: [
      {
        title: 'Resumen',
        content: `Encontré ${plural(logs.length, 'evento coincidente', 'eventos coincidentes')} en la información de demostración.`,
      },
      {
        title: 'Evidencia encontrada',
        content: logs
          .slice(0, 5)
          .map((log) => `${log.id}: ${log.application}, ${log.severity}, “${log.message}” (${log.traceId})`)
          .join(' · '),
      },
      {
        title: 'Posible causa',
        content: 'Las coincidencias comparten los términos consultados, pero esto no confirma que tengan una causa común.',
      },
      {
        title: 'Recomendación',
        content: 'Sería recomendable abrir el primer evento, revisar su metadata y continuar la trazabilidad con el trace ID.',
      },
    ],
    evidence: buildLinks(logs),
  }
}
