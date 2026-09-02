import { createContext } from 'react'

export type AiAssistantContextValue = {
  openAssistant: (prompt?: string) => void
}

export const AiAssistantContext = createContext<AiAssistantContextValue | null>(null)
