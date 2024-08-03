import { type EventInfo, addEventToCalendar } from "@/shared/calendar/addEventToCalendar"
import type { CurrentlyPlayedVideoType } from "@/shared/state/video/currentlyPlayedVideos"
import type { Signal } from "@preact/signals-react"
import dayjs from "dayjs"
import type { MyDatabase } from "../database"
import type { VideoEventDocType } from "../database/collections/VideoEvent/schema"

async function queryEventsInBounds(
  database: MyDatabase,
  queryStartTime: string,
  queryEndTime: string,
) {
  return await database.videos_events
    .find({
      selector: {
        startTime: { $gte: queryStartTime },
        endTime: { $lte: queryEndTime },
        uploaded: { $ne: true },
      },
    })
    .exec()
}

function isEventLongEnough(
  event: VideoEventDocType,
  duration: dayjs.OpUnitType,
  minDuration: number,
) {
  const started = dayjs(event.startTime)
  const ended = dayjs(event.endTime)
  const lasted = ended.diff(started, duration)
  return lasted >= minDuration
}

function prepareEventInfo(
  event: VideoEventDocType,
  calendarEventPrefix: string,
): EventInfo {
  return {
    summary: `${calendarEventPrefix} ${event.title}`,
    description: `https://www.youtube.com/watch?v=${event.videoId}\nChannel: ${event.channelName}`,
    startTime: event.startTime,
    endTime: event.endTime,
  }
}

export default async function flushEventsToCalendar(
  database: MyDatabase | null,
  activityRetentionPeriodSeconds: number,
  videoResumeThresholdSeconds: number,
  minEventDurationSeconds: number,
  calendarEventPrefix: string,
  calendarId: string | null,
  providerToken: string | null,
  currentlyPlayedVideosSignal: Signal<CurrentlyPlayedVideoType[]>,
) {
  if (!database) return console.error("[calendarIntervalFn] Database not set.")
  if (!calendarId) return console.error("[calendarIntervalFn] Calendar ID not set.")
  if (!providerToken) return console.error("[calendarIntervalFn] Provider token not set.")

  const queryStartTime = dayjs()
    .subtract(activityRetentionPeriodSeconds, "second")
    .toISOString()

  const queryEndTime = dayjs()
    .subtract(videoResumeThresholdSeconds, "second")
    .toISOString()

  const events = await queryEventsInBounds(database, queryStartTime, queryEndTime)

  const longEnoughEvents = events.filter((event) =>
    isEventLongEnough(event, "seconds", minEventDurationSeconds),
  )

  for (const videoEvent of longEnoughEvents) {
    const eventInfo = prepareEventInfo(videoEvent, calendarEventPrefix)
    const added = await addEventToCalendar(calendarId, eventInfo, providerToken)

    if (added) {
      // Mark the event in the database as uploaded
      await videoEvent.patch({ uploaded: true })
      // Mark the event in the signal as uploaded
      currentlyPlayedVideosSignal.value = currentlyPlayedVideosSignal.value.map(
        (video) => (video.id === videoEvent.id ? { ...video, uploaded: true } : video),
      )
    }
  }
}
