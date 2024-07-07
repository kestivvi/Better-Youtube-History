import { useState, useEffect } from 'react'
import './Popup.css'
import { database } from '../background/database'
import { VideoEventDocType } from '../background/database/collections/VideoEvent/schema'
import LoginSection from './components/LoginSection'
import CalendarCheck from './components/CalendarCheck'

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

// {
//   "kind": "calendar#calendar",
//   "etag": "\"LjhH-nwiDNJ8QcXDSg77tDKeaNA\"",
//   "id": "0e3ea19f881fc91a3211a85847f88ff482cf015bcb8339b1880a290e8e15d7af@group.calendar.google.com",
//   "summary": "Youtube History",
//   "timeZone": "UTC",
//   "conferenceProperties": {
//       "allowedConferenceSolutionTypes": [
//           "hangoutsMeet"
//       ]
//   }
// }
