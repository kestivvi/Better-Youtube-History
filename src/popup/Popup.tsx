import Home from './views/Home'
import { useState } from 'react'
import Settings from './views/Settings'
import Header from './views/Header'
import { useSessionUnsafe } from './Providers/SessionProvider/SessionContext'
import LoginView from './views/LoginView'
import Dev from './views/Dev'

export type View = 'HOME' | 'SETTINGS' | 'DEV'

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
      {view === 'HOME' && <Home />}
      {view === 'SETTINGS' && <Settings />}
      {view === 'DEV' && <Dev setView={setView} />}
    </>
  )
}
