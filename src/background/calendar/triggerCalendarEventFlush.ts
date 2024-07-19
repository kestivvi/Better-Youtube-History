import dayjs from "dayjs"
import type { MyDatabase } from "../database"
import { flushEventsToCalendar } from "./flushEventsToCalendar"
import type { Signal } from "@preact/signals-react"
import type { CurrentlyPlayedVideoType } from "@/shared/state/video/currentlyPlayedVideos"

export const triggerCalendarEventFlush = (
  database: MyDatabase | null,
  activityRetentionPeriodSeconds: number,
  videoResumeThresholdSeconds: number,
  minEventDurationSeconds: number,
  calendarEventPrefix: string,
  calendarId: string | null,
  providerToken: string | null,
  currentlyPlayedVideosSignal: Signal<CurrentlyPlayedVideoType[]>,
) => {
  console.debug("[calendarIntervalFn] Triggering calendar event flush...")

  if (!database) return console.error("[calendarIntervalFn] Database not set.")
  if (!calendarId) return console.error("[calendarIntervalFn] Calendar ID not set.")
  if (!providerToken) return console.error("[calendarIntervalFn] Provider token not set.")

  const queryStartTime = dayjs()
    .subtract(activityRetentionPeriodSeconds, "second")
    .toISOString()
  const queryEndTime = dayjs()
    .subtract(videoResumeThresholdSeconds, "second")
    .toISOString()

  flushEventsToCalendar(
    database,
    queryStartTime,
    queryEndTime,
    minEventDurationSeconds,
    calendarEventPrefix,
    calendarId,
    providerToken,
    currentlyPlayedVideosSignal,
  )
}
