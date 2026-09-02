import { useContext } from 'react'
import { AiAssistantContext } from '../contexts/AiAssistantContext'

export function useAiAssistantActions() {
  const context = useContext(AiAssistantContext)

  if (!context) {
    throw new Error('useAiAssistantActions debe usarse dentro de AiAssistantProvider')
  }

  return context
}
