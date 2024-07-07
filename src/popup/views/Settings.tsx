import { useState, useEffect } from 'react'
import { database } from '../../background/database'
import { VideoEventDocType } from '../../background/database/collections/VideoEvent/schema'
import CalendarCheck from '../components/CalendarCheck'
import LoginSection from '../components/LoginSection'

type Props = {
  setView: (view: 'HOME' | 'SETTINGS') => void
}

export default function ({ setView }: Props) {
  const [session, setSession] = useState<any>(null)
  const loggedIn = session !== null

  const [videosEvents, setVideosEvents] = useState<VideoEventDocType[]>([])

  useEffect(() => {
    ;(async () => {
      const { session } = await chrome.storage.local.get('session')
      console.log('tried to get session', new Date().toISOString(), session)
      if (session) {
        setSession(session)
      }
    })()
  }, [])

  return (
    <>
      Setings
      <button onClick={() => setView('HOME')}>Home</button>
    </>
  )
}
