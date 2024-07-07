import { useState, useEffect } from 'react'
import { database } from '../../background/database'
import { VideoEventDocType } from '../../background/database/collections/VideoEvent/schema'
import CalendarCheck from '../components/CalendarCheck'
import LoginSection from '../components/LoginSection'

export default function () {
  const homePage = chrome.runtime.getURL('home.html')
  console.log('homePage', homePage)

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
      <a href={homePage} target="_blank">
        Strona Główna
      </a>
      <br />

      <LoginSection />

      {loggedIn && (
        <>
          <CalendarCheck />
          <br />

          <button
            onClick={async () => {
              if (database) {
                const videosEvents = (await database.videos_events.find().exec()).flatMap((x) =>
                  x.toJSON(),
                )
                console.log('videosEvents', videosEvents)
                setVideosEvents(videosEvents)

                const videosRecords = (await database.videos_records.find().exec()).slice(-5)
                console.log('videosRecords', videosRecords)
              } else {
                console.error('Database not initialized.')
              }
            }}
          >
            Show db stuff
          </button>

          <br />

          {videosEvents.map((videoEvent) => (
            <div key={videoEvent.id}>
              {videoEvent.title} - {videoEvent.startTime} - {videoEvent.endTime}
            </div>
          ))}
        </>
      )}
    </>
  )
}
