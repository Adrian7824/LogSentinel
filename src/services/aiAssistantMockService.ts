import { mockAlerts } from '../data/alertsMock'
import { mockIncidents } from '../data/incidentsMock'
import { mockLogs } from '../data/logsMock'
import type { AiMockResponse } from '../types/aiAssistant'
import type { LogEntry } from '../types/log'
import {
  buildSearchResultMock,
  detectPatternsMock,
  explainLogMock,
  findRelatedLogs,
  summarizeEventsMock,
} from './aiLogAnalysisMockService'

const oneDayInMilliseconds = 24 * 60 * 60 * 1000

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-MX')
}

function getRecentLogs() {
  const now = Date.now()
  return mockLogs.filter(
    (log) => now - new Date(log.timestamp).getTime() <= oneDayInMilliseconds,
  )
}

function getErrorLogs(logs: LogEntry[]) {
  return logs.filter((log) => log.severity === 'ERROR' || log.severity === 'CRITICAL')
}

function answerTraceQuestion(question: string): AiMockResponse | null {
  const normalizedQuestion = normalize(question)
  const traceId = question.match(/trc-[a-z0-9-]+/i)?.[0]

  if (!traceId && normalizedQuestion.includes('trace id')) {
    return {
      content: 'Consulta simulada de trazabilidad',
      analysis: [
        {
          title: 'Resumen',
          content: 'Necesito un trace ID concreto para buscar coincidencias en los datos mock.',
        },
        {
          title: 'Recomendación',
          content: 'Prueba con “¿Qué pasó con trc-7f4a91c2d810?”.',
        },
      ],
      evidence: [{ label: 'Abrir explorador de logs', path: '/logs' }],
    }
  }

  if (!traceId) return null

  const relatedLogs = mockLogs.filter(
    (log) => normalize(log.traceId) === normalize(traceId),
  )

  return buildSearchResultMock(
    `Trazabilidad simulada de ${traceId}`,
    relatedLogs,
    `No encontré eventos asociados con ${traceId} en los datos mock disponibles.`,
  )
}

function answerLogExplanation(question: string): AiMockResponse | null {
  const normalizedQuestion = normalize(question)
  if (!normalizedQuestion.includes('explica') || !normalizedQuestion.includes('log')) return null

  const requestedLogId = question.match(/log-\d+/i)?.[0]
  const selectedLog = requestedLogId
    ? mockLogs.find((log) => normalize(log.id) === normalize(requestedLogId))
    : getErrorLogs(getRecentLogs())[0]

  if (!selectedLog) {
    return {
      content: 'No encontré el log solicitado en los datos mock disponibles.',
      evidence: [{ label: 'Abrir explorador de logs', path: '/logs' }],
    }
  }

  return explainLogMock(selectedLog, mockLogs)
}

function answerIncidentAnalysis(question: string): AiMockResponse | null {
  const normalizedQuestion = normalize(question)
  const incidentId = question.match(/INC-\d+/i)?.[0]
  if (!incidentId || (!normalizedQuestion.includes('analiza') && !normalizedQuestion.includes('explica'))) {
    return null
  }

  const incident = mockIncidents.find(
    (item) => normalize(item.id) === normalize(incidentId),
  )
  if (!incident) {
    return {
      content: `No encontré ${incidentId} en los incidentes mock.`,
      evidence: [{ label: 'Ver incidentes', path: '/incidentes' }],
    }
  }

  const relatedLogs = mockLogs.filter((log) => incident.relatedLogIds.includes(log.id))

  return {
    content: `Análisis simulado de ${incident.id}`,
    analysis: [
      {
        title: 'Resumen',
        content: `${incident.title}. Afecta a ${incident.application}, tiene severidad ${incident.severity} y estado ${incident.status}.`,
      },
      {
        title: 'Evidencia encontrada',
        content: `${incident.description} Logs relacionados: ${relatedLogs.map((log) => `${log.id} (${log.traceId})`).join(', ') || 'ninguno en la muestra'}.`,
      },
      {
        title: 'Posible causa',
        content: `Los eventos disponibles sugieren una condición relacionada con “${incident.source}”, pero la demostración no confirma causalidad.`,
      },
      {
        title: 'Recomendación',
        content: `Sería recomendable revisar la actividad de ${incident.application}, abrir sus logs relacionados y validar la evidencia antes de cambiar el estado del incidente.`,
      },
    ],
    evidence: [
      { label: `Ver ${incident.id}`, path: `/incidentes?incident=${incident.id}` },
      ...relatedLogs.slice(0, 1).map((log) => ({
        label: `Ver ${log.id}`,
        path: `/logs?log=${log.id}` as const,
      })),
      {
        label: `Ver ${incident.application}`,
        path: `/aplicaciones?app=${encodeURIComponent(incident.application)}`,
      },
    ],
  }
}

function answerCriticalErrors(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('critico') || !normalizedQuestion.includes('error')) return null

  return buildSearchResultMock(
    'Errores críticos encontrados',
    getRecentLogs().filter((log) => log.severity === 'CRITICAL'),
    'No hay errores críticos en las últimas 24 horas de datos mock.',
  )
}

function answerFiveHundreds(normalizedQuestion: string): AiMockResponse | null {
  if (!/\b5\d\d\b/.test(normalizedQuestion) && !normalizedQuestion.includes('errores 500')) {
    return null
  }

  const matches = mockLogs.filter((log) => {
    const statusCode = Number(log.metadata.status_code)
    return statusCode >= 500 && statusCode < 600
  })

  return buildSearchResultMock(
    'Respuestas 5xx encontradas',
    matches,
    'No encontré respuestas 5xx en los datos mock.',
  )
}

function answerPaymentErrors(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('payment') && !normalizedQuestion.includes('pago')) return null
  if (!normalizedQuestion.includes('error') && !normalizedQuestion.includes('falla')) return null

  const matches = getErrorLogs(mockLogs).filter((log) =>
    normalize(`${log.application} ${log.message} ${log.raw}`).includes('payment'),
  )

  return buildSearchResultMock(
    'Errores relacionados con pagos',
    matches,
    'No encontré errores relacionados con payments-service o pagos en los datos mock.',
  )
}

function answerTopErrorApplication(normalizedQuestion: string): AiMockResponse | null {
  if (
    !normalizedQuestion.includes('aplicacion') ||
    (!normalizedQuestion.includes('mas errores') && !normalizedQuestion.includes('mas fallas'))
  ) {
    return null
  }

  const counts = getErrorLogs(getRecentLogs()).reduce<Record<string, number>>(
    (result, log) => ({ ...result, [log.application]: (result[log.application] ?? 0) + 1 }),
    {},
  )
  const topApplication = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]

  if (!topApplication) {
    return { content: 'No encontré errores recientes para comparar aplicaciones.' }
  }

  const matchingLogs = getErrorLogs(getRecentLogs()).filter(
    (log) => log.application === topApplication[0],
  )
  return buildSearchResultMock(
    `${topApplication[0]} concentra más errores recientes (${topApplication[1]})`,
    matchingLogs,
    'No encontré errores recientes para comparar aplicaciones.',
  )
}

function answerRecentSummary(normalizedQuestion: string): AiMockResponse | null {
  if (
    !normalizedQuestion.includes('resume') ||
    (!normalizedQuestion.includes('reciente') && !normalizedQuestion.includes('evento'))
  ) {
    return null
  }

  const response = summarizeEventsMock(getRecentLogs())
  const activeIncidents = mockIncidents.filter((incident) => incident.status !== 'RESOLVED')
  const activeAlerts = mockAlerts.filter((alert) => alert.status === 'ACTIVE')
  response.analysis?.push({
    title: 'Evidencia encontrada',
    content: `Como contexto adicional, hay ${activeIncidents.length} incidentes sin resolver y ${activeAlerts.length} reglas de alerta activas en la maqueta.`,
  })
  response.evidence = [
    ...(response.evidence ?? []),
    { label: 'Ver incidentes', path: '/incidentes' },
    { label: 'Ver alertas', path: '/alertas' },
  ]
  return response
}

function answerPatterns(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('patron')) return null
  return detectPatternsMock(mockLogs)
}

function answerPreviousEvents(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('antes') || !normalizedQuestion.includes('error')) return null

  const recentError = getErrorLogs(getRecentLogs())[0]
  if (!recentError) return { content: 'No encontré un error reciente para reconstruir el contexto.' }

  const previousLogs = mockLogs
    .filter((log) => new Date(log.timestamp).getTime() < new Date(recentError.timestamp).getTime())
    .slice(0, 2)

  return buildSearchResultMock(
    `Eventos anteriores a ${recentError.id}`,
    previousLogs,
    'No encontré eventos anteriores en la muestra.',
  )
}

function answerRelatedEvents(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('evento') || !normalizedQuestion.includes('relacion')) return null

  const reference = getErrorLogs(getRecentLogs())[0]
  const related = reference ? findRelatedLogs(reference, mockLogs) : []
  return buildSearchResultMock(
    `Eventos posiblemente relacionados con ${reference?.id ?? 'el error reciente'}`,
    related,
    'No encontré eventos relacionados mediante las reglas mock.',
  )
}

function answerRelatedIncidents(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('incidente') || !normalizedQuestion.includes('relacion')) return null

  const activeIncidents = mockIncidents.filter((incident) => incident.status !== 'RESOLVED')
  return {
    content: 'Relación simulada de incidentes activos',
    analysis: [
      {
        title: 'Resumen',
        content: `Encontré ${activeIncidents.length} incidentes activos que conviene comparar por aplicación y proximidad temporal.`,
      },
      {
        title: 'Evidencia encontrada',
        content: activeIncidents
          .map((incident) => `${incident.id}: ${incident.application}, ${incident.severity}`)
          .join(' · '),
      },
      {
        title: 'Posible causa',
        content: 'Podrían estar relacionados por tiempo o dependencia, pero no se realizó correlación distribuida real.',
      },
      {
        title: 'Recomendación',
        content: 'Sería recomendable comparar sus logs y trace IDs antes de tratarlos como un solo incidente.',
      },
    ],
    evidence: [{ label: 'Comparar incidentes', path: '/incidentes' }],
  }
}

function answerRepeatedErrors(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('error') || !normalizedQuestion.includes('repet')) return null
  return detectPatternsMock(mockLogs)
}

function answerAnomalies(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('anormal') && !normalizedQuestion.includes('anomalo')) return null

  const investigating = mockIncidents.filter(
    (incident) => incident.status === 'INVESTIGATING',
  )
  return {
    content: `Hay ${investigating.length} situaciones mock bajo investigación: ${investigating.map((incident) => `${incident.title} en ${incident.application}`).join('; ')}. No se ejecutó detección real de anomalías.`,
    evidence: [{ label: 'Ver investigaciones', path: '/incidentes' }],
  }
}

function answerFirstReview(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('revisar primero')) return null

  const priorityIncident = mockIncidents.find(
    (incident) => incident.status !== 'RESOLVED' && incident.severity === 'CRITICAL',
  )

  if (!priorityIncident) {
    return { content: 'No hay incidentes críticos activos en los datos mock.' }
  }

  return {
    content: `Revisaría primero ${priorityIncident.id}: “${priorityIncident.title}”. Es una priorización simulada basada en severidad y estado.`,
    evidence: [
      {
        label: `Abrir ${priorityIncident.id}`,
        path: `/incidentes?incident=${priorityIncident.id}`,
      },
      { label: 'Consultar evidencia en logs', path: '/logs' },
    ],
  }
}

export function generateMockAiResponse(question: string): AiMockResponse {
  const normalizedQuestion = normalize(question)

  return (
    answerTraceQuestion(question) ??
    answerLogExplanation(question) ??
    answerIncidentAnalysis(question) ??
    answerCriticalErrors(normalizedQuestion) ??
    answerFiveHundreds(normalizedQuestion) ??
    answerPaymentErrors(normalizedQuestion) ??
    answerTopErrorApplication(normalizedQuestion) ??
    answerRecentSummary(normalizedQuestion) ??
    answerPatterns(normalizedQuestion) ??
    answerPreviousEvents(normalizedQuestion) ??
    answerRelatedEvents(normalizedQuestion) ??
    answerRelatedIncidents(normalizedQuestion) ??
    answerRepeatedErrors(normalizedQuestion) ??
    answerAnomalies(normalizedQuestion) ??
    answerFirstReview(normalizedQuestion) ?? {
      content:
        'No encontré información suficiente en los datos disponibles para responder esta consulta. Prueba con “Explica el log log-2091”, “Busca errores 500”, una aplicación o un trace ID concreto.',
      evidence: [{ label: 'Explorar logs', path: '/logs' }],
    }
  )
}
