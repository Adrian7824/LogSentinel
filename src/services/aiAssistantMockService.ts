import { mockAlerts } from '../data/alertsMock'
import { mockIncidents } from '../data/incidentsMock'
import { mockLogs } from '../data/logsMock'
import type { AiMockResponse } from '../types/aiAssistant'
import type { LogEntry } from '../types/log'

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

function summarizeLog(log: LogEntry) {
  return `${log.application} registró ${log.severity}: “${log.message}”. El evento provino de ${log.source}, tardó ${log.durationMs.toLocaleString('es-MX')} ms y utiliza el trace ID ${log.traceId}.`
}

function answerTraceQuestion(question: string): AiMockResponse | null {
  const traceId = question.match(/trc-[a-z0-9-]+/i)?.[0]

  if (!traceId && normalize(question).includes('trace id')) {
    return {
      content:
        'Incluye un trace ID concreto, por ejemplo “trc-7f4a91c2d810”, para buscar eventos relacionados en los datos disponibles.',
      evidence: [{ label: 'Abrir explorador de logs', path: '/logs' }],
    }
  }

  if (!traceId) return null

  const relatedLogs = mockLogs.filter(
    (log) => normalize(log.traceId) === normalize(traceId),
  )

  if (relatedLogs.length === 0) {
    return {
      content: `No encontré eventos asociados con ${traceId} en los datos mock disponibles.`,
      evidence: [{ label: 'Buscar en logs', path: '/logs' }],
    }
  }

  return {
    content: `Encontré ${relatedLogs.length} evento${relatedLogs.length === 1 ? '' : 's'} para ${traceId}. ${relatedLogs.map(summarizeLog).join(' ')}`,
    evidence: [{ label: 'Revisar logs', path: '/logs' }],
  }
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

  const context = requestedLogId
    ? `El log ${selectedLog.id}`
    : `Tomando como ejemplo el evento reciente ${selectedLog.id}`

  return {
    content: `${context}: ${summarizeLog(selectedLog)} ${selectedLog.incidentId ? `Además, está relacionado con el incidente ${selectedLog.incidentId}.` : 'No tiene un incidente relacionado en esta demostración.'}`,
    evidence: [
      { label: `Ver ${selectedLog.id}`, path: '/logs' },
      ...(selectedLog.incidentId
        ? [{ label: `Ver ${selectedLog.incidentId}`, path: '/incidentes' } as const]
        : []),
    ],
  }
}

function answerCriticalErrors(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('critico') || !normalizedQuestion.includes('error')) return null

  const criticalLogs = getRecentLogs().filter((log) => log.severity === 'CRITICAL')
  if (criticalLogs.length === 0) {
    return { content: 'No hay errores críticos en las últimas 24 horas de datos mock.' }
  }

  return {
    content: `Encontré ${criticalLogs.length} error${criticalLogs.length === 1 ? '' : 'es'} crítico${criticalLogs.length === 1 ? '' : 's'} en las últimas 24 horas. ${criticalLogs.map((log) => `${log.application}: ${log.message}`).join(' ')}`,
    evidence: [
      { label: 'Ver logs críticos', path: '/logs' },
      { label: 'Revisar incidentes', path: '/incidentes' },
    ],
  }
}

function answerTopErrorApplication(normalizedQuestion: string): AiMockResponse | null {
  if (
    !normalizedQuestion.includes('aplicacion') ||
    !normalizedQuestion.includes('mas errores')
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

  return {
    content: `${topApplication[0]} es la aplicación con más errores en las últimas 24 horas del conjunto mock, con ${topApplication[1]} evento${topApplication[1] === 1 ? '' : 's'} de severidad ERROR o CRITICAL.`,
    evidence: [{ label: 'Filtrar logs', path: '/logs' }],
  }
}

function answerRecentSummary(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('resume') || !normalizedQuestion.includes('reciente')) return null

  const recentLogs = getRecentLogs()
  const errors = getErrorLogs(recentLogs)
  const activeIncidents = mockIncidents.filter((incident) => incident.status !== 'RESOLVED')
  const activeAlerts = mockAlerts.filter((alert) => alert.status === 'ACTIVE')

  return {
    content: `En las últimas 24 horas hay ${recentLogs.length} logs mock, de los cuales ${errors.length} son errores o eventos críticos. También permanecen ${activeIncidents.length} incidentes sin resolver y ${activeAlerts.length} reglas de alerta activas.`,
    evidence: [
      { label: 'Explorar logs', path: '/logs' },
      { label: 'Ver incidentes', path: '/incidentes' },
      { label: 'Ver alertas', path: '/alertas' },
    ],
  }
}

function answerPreviousEvents(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('antes') || !normalizedQuestion.includes('error')) return null

  const recentError = getErrorLogs(getRecentLogs())[0]
  if (!recentError) return { content: 'No encontré un error reciente para reconstruir el contexto.' }

  const previousLogs = mockLogs
    .filter((log) => new Date(log.timestamp).getTime() < new Date(recentError.timestamp).getTime())
    .slice(0, 2)

  return {
    content: `Antes de ${recentError.id} se registraron: ${previousLogs.map((log) => `${log.id} (${log.application}): ${log.message}`).join(' Después, ')}. Esta secuencia es una reconstrucción basada únicamente en las marcas de tiempo mock.`,
    evidence: [{ label: 'Consultar secuencia en logs', path: '/logs' }],
  }
}

function answerRelatedIncidents(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('incidente') || !normalizedQuestion.includes('relacion')) return null

  const activeIncidents = mockIncidents.filter((incident) => incident.status !== 'RESOLVED')
  return {
    content: `Los incidentes activos que parecen relacionados por proximidad temporal son ${activeIncidents.map((incident) => `${incident.id} (${incident.application}, ${incident.severity})`).join(', ')}. Esta relación es simulada y no representa correlación realizada por IA.`,
    evidence: [{ label: 'Comparar incidentes', path: '/incidentes' }],
  }
}

function answerRepeatedErrors(normalizedQuestion: string): AiMockResponse | null {
  if (!normalizedQuestion.includes('error') || !normalizedQuestion.includes('repet')) return null

  const counts = getErrorLogs(mockLogs).reduce<Record<string, number>>(
    (result, log) => ({ ...result, [log.application]: (result[log.application] ?? 0) + 1 }),
    {},
  )
  const repeated = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return {
    content: `Agrupando los errores mock por aplicación, los más frecuentes corresponden a ${repeated.map(([application, count]) => `${application} (${count})`).join(', ')}.`,
    evidence: [{ label: 'Revisar errores', path: '/logs' }],
  }
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
    content: `Revisaría primero ${priorityIncident.id}: “${priorityIncident.title}”. Tiene severidad CRITICAL, afecta a ${priorityIncident.application} y actualmente está ${priorityIncident.status === 'INVESTIGATING' ? 'en investigación' : 'abierto'}.`,
    evidence: [
      { label: `Abrir ${priorityIncident.id}`, path: '/incidentes' },
      { label: 'Consultar evidencia en logs', path: '/logs' },
    ],
  }
}

export function generateMockAiResponse(question: string): AiMockResponse {
  const normalizedQuestion = normalize(question)

  return (
    answerTraceQuestion(question) ??
    answerLogExplanation(question) ??
    answerCriticalErrors(normalizedQuestion) ??
    answerTopErrorApplication(normalizedQuestion) ??
    answerRecentSummary(normalizedQuestion) ??
    answerPreviousEvents(normalizedQuestion) ??
    answerRelatedIncidents(normalizedQuestion) ??
    answerRepeatedErrors(normalizedQuestion) ??
    answerAnomalies(normalizedQuestion) ??
    answerFirstReview(normalizedQuestion) ?? {
      content:
        'No encontré información suficiente en los datos disponibles para responder esta consulta. Prueba con una de las preguntas sugeridas o incluye un log ID o trace ID concreto.',
    }
  )
}
