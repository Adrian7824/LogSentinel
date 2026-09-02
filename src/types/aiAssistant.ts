export type AiMessageRole = 'assistant' | 'user'

export type AiEvidenceLink = {
  label: string
  path: '/logs' | '/incidentes' | '/alertas'
}

export type AiMessage = {
  id: string
  role: AiMessageRole
  content: string
  createdAt: string
  evidence?: AiEvidenceLink[]
}

export type AiMockResponse = {
  content: string
  evidence?: AiEvidenceLink[]
}
