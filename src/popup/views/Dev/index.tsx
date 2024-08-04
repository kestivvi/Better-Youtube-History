import { database } from "@/background/database"
import type { VideoEventDocType } from "@/background/database/collections/VideoEvent/schema"
import { sessionStateSignal } from "@/shared/state/auth/session"
import { Space } from "@mantine/core"
import { useState } from "react"
import LoginSection from "./components/LoginSection"
import Videos from "./components/Videos"

export default function () {
  const homePage = chrome.runtime.getURL("home.html")
  console.log("homePage", homePage)

  const [videosEvents, setVideosEvents] = useState<VideoEventDocType[]>([])

  return (
    <>
      <a href={homePage} target="_blank" rel="noreferrer">
        Strona Główna
      </a>
      <br />

      <LoginSection />

      {sessionStateSignal.value === "LOGGED_IN" && (
        <>
          <br />

          <button
            type="button"
            onClick={async () => {
              if (database) {
                const videosEvents = (await database.videos_events.find().exec()).flatMap(
                  (x) => x.toJSON(),
                )
                console.log("videosEvents", videosEvents)
                setVideosEvents(videosEvents)

                const videosRecords = (await database.videos_records.find().exec()).slice(
                  -5,
                )
                console.log("videosRecords", videosRecords)
              } else {
                console.error("Database not initialized.")
              }
            }}
          >
            Show db stuff
          </button>

          <br />

          {videosEvents.map((videoEvent) => (
            <div key={videoEvent.id}>
              {videoEvent.title} - {videoEvent.startTime} - {videoEvent.endTime} -{" "}
              {videoEvent.uploaded && "uploaded"}
            </div>
          ))}
        </>
      )}

      <Space h="md" />

      <Videos />
    </>
  )
}
