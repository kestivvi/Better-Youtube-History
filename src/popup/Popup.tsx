import Home from './views/Home'
import { useState } from 'react'
import Settings from './views/Settings'
import Header from './views/Header'
import { useSession, useSessionUnsafe } from './Providers/SessionProvider/SessionContext'
import LoginView from './views/LoginView'

export type View = 'HOME' | 'SETTINGS'

export default function () {
  const [view, setView] = useState<View>('HOME')
  const { sessionState } = useSessionUnsafe()

  if (sessionState === 'LOADING') {
    return null
  }

  if (sessionState === 'NOT_LOGGED_IN') {
    return <LoginView />
  }

  return (
    <>
      <Header view={view} setView={setView} />
      {view === 'HOME' && <Home setView={setView} />}
      {view === 'SETTINGS' && <Settings setView={setView} />}
    </>
  )
}
