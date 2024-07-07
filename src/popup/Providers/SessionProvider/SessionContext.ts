import { createContext, useContext } from 'react'
import { SessionContextType } from './types'

export const SessionContext = createContext<SessionContextType>({
  sessionState: 'LOADING',
  setSessionState: () => {},
  session: null,
  setSession: () => {},
})

export const useSessionUnsafe = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }

  return context
}

export const useSession = () => {
  const { session, setSession, sessionState, setSessionState } = useSessionUnsafe()

  if (session === null) {
    throw new Error('Session is null')
  }

  return {
    session,
    setSession,
    sessionState,
    setSessionState,
  }
}
