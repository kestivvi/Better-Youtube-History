import { ReactNode, useEffect, useMemo, useState } from 'react'
import { SessionStateType } from './types'
import { SessionContext } from './SessionContext'

type Props = {
  children: ReactNode
}

export default function ({ children }: Props) {
  const [sessionState, setSessionState] = useState<SessionStateType>('LOADING')
  const [session, setSession] = useState<any>(null)

  const checkSession = useMemo(
    () => async () => {
      const { session: localStorageSession } = await chrome.storage.local.get('session')
      console.log('[SESSION_PROVIDER] session from local storage', localStorageSession)

      if (localStorageSession) {
        // TODO: check if session is valid
        // await checkSessionAndRefreshTokens()
        const isSessionValid = true

        if (isSessionValid) {
          setSession(localStorageSession)
          setSessionState('LOGGED_IN')
        } else {
          setSessionState('NOT_LOGGED_IN')
        }
      } else {
        setSessionState('NOT_LOGGED_IN')
      }
    },
    [setSession, setSessionState],
  )

  useEffect(() => {
    checkSession()
    const clear = setInterval(checkSession, 1000 * 60 * 1)
    return () => clearInterval(clear)
  }, [checkSession])

  return (
    <>
      <SessionContext.Provider
        value={{
          sessionState,
          session,
          setSession,
          setSessionState,
        }}
      >
        {children}
      </SessionContext.Provider>
    </>
  )
}
