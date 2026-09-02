export type AiMessageRole = 'assistant' | 'user'

export type AiAnalysisSectionTitle =
  | 'Resumen'
  | 'Evidencia encontrada'
  | 'Posible causa'
  | 'Recomendación'

export type AiAnalysisSection = {
  title: AiAnalysisSectionTitle
  content: string
}

export type AiEvidenceLink = {
  label: string
  path:
    | '/logs'
    | `/logs?${string}`
    | '/incidentes'
    | `/incidentes?${string}`
    | '/alertas'
    | '/aplicaciones'
    | `/aplicaciones?${string}`
}

export type AiMessage = {
  id: string
  role: AiMessageRole
  content: string
  createdAt: string
  analysis?: AiAnalysisSection[]
  evidence?: AiEvidenceLink[]
}

export type AiMockResponse = {
  content: string
  analysis?: AiAnalysisSection[]
  evidence?: AiEvidenceLink[]
}
