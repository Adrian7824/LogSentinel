import { useEffect, useRef, useState } from 'react'
import { aiWelcomeMessage } from '../data/aiAssistantMock'
import { generateMockAiResponse } from '../services/aiAssistantMockService'
import type { AiMessage } from '../types/aiAssistant'

function createMessage(
  id: string,
  role: AiMessage['role'],
  content: string,
  evidence?: AiMessage['evidence'],
): AiMessage {
  return {
    id,
    role,
    content,
    createdAt: new Date().toISOString(),
    evidence,
  }
}

export function useAiAssistant() {
  const [messages, setMessages] = useState<AiMessage[]>([
    createMessage('assistant-welcome', 'assistant', aiWelcomeMessage),
  ])
  const [isLoading, setIsLoading] = useState(false)
  const responseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messageSequence = useRef(0)

  useEffect(
    () => () => {
      if (responseTimer.current) clearTimeout(responseTimer.current)
    },
    [],
  )

  const sendMessage = (value: string) => {
    const question = value.trim()
    if (!question || isLoading) return

    messageSequence.current += 1
    const sequence = messageSequence.current
    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage(`user-${sequence}`, 'user', question),
    ])
    setIsLoading(true)

    responseTimer.current = setTimeout(() => {
      const response = generateMockAiResponse(question)
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          `assistant-${sequence}`,
          'assistant',
          response.content,
          response.evidence,
        ),
      ])
      setIsLoading(false)
      responseTimer.current = null
    }, 850)
  }

  return { messages, isLoading, sendMessage }
}
