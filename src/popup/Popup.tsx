import Home from './views/Home'
import { useState } from 'react'
import Settings from './views/Settings'
import Header from './views/Header'
import LoginView from './views/LoginView'
import Dev from './views/Dev'
import { sessionStateSignal } from '@/shared/state/auth/session'
import { Flex, Loader } from '@mantine/core'
import { calendarIdSignal } from '@/shared/state/calendarId'
import SetCalendarView from './views/SetCalendarView'

export type View = 'HOME' | 'SETTINGS' | 'DEV'

export default function () {
  const [view, setView] = useState<View>('HOME')

  if (sessionStateSignal.value === 'LOADING') {
    return (
      <Flex align="center" justify="center" style={{ height: '100vh' }}>
        <Loader />
      </Flex>
    )
  }

  if (sessionStateSignal.value === 'NOT_LOGGED_IN') {
    return <LoginView />
  }

  // TODO: Check if user has calendar ID in supabase, if no then prompt to set it
  if (calendarIdSignal.value === null) {
    return <SetCalendarView />
  }

  return (
    <>
      <Header view={view} setView={setView} />
      {view === 'HOME' && <Home />}
      {view === 'SETTINGS' && <Settings />}
      {view === 'DEV' && <Dev />}
    </>
  )
}
