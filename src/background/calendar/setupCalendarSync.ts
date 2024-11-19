import { providerTokenSignal } from "@/shared/state/auth/tokens/providerToken"
import { activityRetentionPeriodSignal } from "@/shared/state/calendar/activityRetentionPeriod"
import { calendarEventPrefixSignal } from "@/shared/state/calendar/calendarEventPrefix"
import { calendarSyncFrequencySignal } from "@/shared/state/calendar/calendarSyncFrequency"
import { minVideoWatchDurationSignal } from "@/shared/state/calendar/minVideoWatchDuration"
import { videoResumeThresholdSignal } from "@/shared/state/calendar/videoResumeThreshold"
import { calendarIdSignal } from "@/shared/state/calendarId"
import { currentlyPlayedVideosSignal } from "@/shared/state/video/currentlyPlayedVideos"
import { database } from "../database"
import { CalendarService } from "./CalendarService"

const RETRY_DELAY_MS = 1000

export default async function setupCalendarSync(retryCount = 0): Promise<void> {
  if (!database) {
    console.log(
      `Database not ready, retrying in ${RETRY_DELAY_MS}ms (attempt ${retryCount + 1})`,
    )
    setTimeout(() => setupCalendarSync(retryCount + 1), RETRY_DELAY_MS)
    return
  }

  const calendarService = new CalendarService(database, {
    activityRetentionPeriodSignal,
    videoResumeThresholdSignal,
    minVideoWatchDurationSignal,
    calendarEventPrefixSignal,
    calendarIdSignal,
    providerTokenSignal,
    calendarSyncFrequencySignal,
    currentlyPlayedVideosSignal,
  })

  calendarService.initialize()
}
