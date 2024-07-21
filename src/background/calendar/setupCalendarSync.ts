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
import { triggerCalendarEventFlush } from "./triggerCalendarEventFlush"

const ALARM_NAME = "CALENDAR_SYNC_ALARM"

export default function () {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
      console.debug(`[${ALARM_NAME}] Alarm triggered`)
      triggerCalendarEventFlush(
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
  })

  effect(() => {
    console.debug(`[${ALARM_NAME}] Setting up Calendar sync alarm`)

    const periodInMinutes = calendarSyncFrequencySignal.value * 60

    const calendarSyncSetupFn = async () => {
      console.debug(`[${ALARM_NAME}] Creating Calendar sync alarm`)

      const alarm = await chrome.alarms.get(ALARM_NAME)
      if (alarm === undefined) {
        console.debug(`[${ALARM_NAME}] Indeed creating Calendar sync alarm`)
        chrome.alarms.create(ALARM_NAME, {
          delayInMinutes: 0.5,
          periodInMinutes,
        })
      }
    }

    calendarSyncSetupFn()

    return () => {
      console.debug(`[${ALARM_NAME}] Clearing Calendar sync alarm`)
      chrome.alarms.clear(ALARM_NAME)
    }
  })
}
