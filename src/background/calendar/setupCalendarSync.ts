import { providerTokenSignal } from "@/shared/state/auth/tokens/providerToken"
import { activityRetentionPeriodSignal } from "@/shared/state/calendar/activityRetentionPeriod"
import { calendarEventPrefixSignal } from "@/shared/state/calendar/calendarEventPrefix"
import { calendarSyncFrequencySignal } from "@/shared/state/calendar/calendarSyncFrequency"
import { minVideoWatchDurationSignal } from "@/shared/state/calendar/minVideoWatchDuration"
import { videoResumeThresholdSignal } from "@/shared/state/calendar/videoResumeThreshold"
import { calendarIdSignal } from "@/shared/state/calendarId"
import { currentlyPlayedVideosSignal } from "@/shared/state/video/currentlyPlayedVideos"
import { effect } from "@preact/signals-react"
import { database } from "../database"
import flushEventsToCalendar from "./flushEventsToCalendar"

const ALARM_NAME = "CALENDAR_SYNC_ALARM"

function handleAlarm(alarm: chrome.alarms.Alarm) {
  // If the alarm is not the one we set, ignore it
  if (alarm.name !== ALARM_NAME) return

  flushEventsToCalendar(
    database,
    activityRetentionPeriodSignal.value,
    videoResumeThresholdSignal.value,
    minVideoWatchDurationSignal.value,
    calendarEventPrefixSignal.value,
    calendarIdSignal.value,
    providerTokenSignal.value,
    currentlyPlayedVideosSignal,
  )
}

async function createAlarm(periodInMinutes: number) {
  const existingAlarm = await chrome.alarms.get(ALARM_NAME)
  if (existingAlarm) return

  chrome.alarms.create(ALARM_NAME, {
    // Delay the first alarm by 30 seconds
    delayInMinutes: 0.5,
    // Every another alarm will be triggered every `periodInMinutes`
    periodInMinutes,
  })
}

export default function setupCalendarSync() {
  chrome.alarms.onAlarm.addListener(handleAlarm)

  // Signal effect runs on creation and whenever the signal value changes
  effect(() => {
    const periodInMinutes = calendarSyncFrequencySignal.value / 60
    createAlarm(periodInMinutes)

    // Cleanup function runs when the effect is disposed
    // Or in other words, before effect runs again on signal value change
    return () => chrome.alarms.clear(ALARM_NAME)
  })
}
