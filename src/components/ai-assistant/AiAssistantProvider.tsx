import { useMemo, useState, type ReactNode } from 'react'
import { AiAssistantContext } from '../../contexts/AiAssistantContext'
import { useAiAssistant } from '../../hooks/useAiAssistant'
import { AiAssistant } from './AiAssistant'

type AiAssistantProviderProps = {
  children: ReactNode
}

export function AiAssistantProvider({ children }: AiAssistantProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, isLoading, sendMessage } = useAiAssistant()
  const contextValue = useMemo(
    () => ({
      openAssistant: (prompt?: string) => {
        setIsOpen(true)
        if (prompt) sendMessage(prompt)
      },
    }),
    [sendMessage],
  )

  return (
    <AiAssistantContext.Provider value={contextValue}>
      {children}
      <AiAssistant
        isLoading={isLoading}
        isOpen={isOpen}
        messages={messages}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        onSend={sendMessage}
      />
    </AiAssistantContext.Provider>
  )
}
