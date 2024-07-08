import Home from './views/Home'
import { useState } from 'react'
import Settings from './views/Settings'
import Header from './views/Header'
import LoginView from './views/LoginView'
import Dev from './views/Dev'
import { sessionStateSignal } from '@/shared/state/auth/session'

export type View = 'HOME' | 'SETTINGS' | 'DEV'

export default function () {
  const [view, setView] = useState<View>('HOME')

  console.debug('[Popup.tsx]', sessionStateSignal.value)

  if (sessionStateSignal.value === 'LOADING') {
    console.debug('[Popup.tsx] Loading...')
    return null
  }

  if (sessionStateSignal.value === 'NOT_LOGGED_IN') {
    console.debug('[Popup.tsx] Not logged in')
    return <LoginView />
  }

  console.debug('[Popup.tsx] Logged in')
  return (
    <>
      <Header view={view} setView={setView} />
      {view === 'HOME' && <Home />}
      {view === 'SETTINGS' && <Settings />}
      {view === 'DEV' && <Dev />}
    </>
  )
}
