import { DEFAULT_SESSION_STATE, sessionSignal, sessionStateSignal } from './auth/session'
import {
  DEFAULT_SESSION_EXPIRATION_THRESHOLD_SECONDS,
  sessionExpirationThresholdSecondsSignal,
} from './auth/sessionExpirationThreshold'
import { providerRefreshTokenSignal } from './auth/tokens/providerRefreshToken'
import { providerTokenSignal } from './auth/tokens/providerToken'
import { providerTokenInfoSignal } from './auth/tokens/providerTokenInfo'
import {
  activityRetentionPeriodSignal,
  DEFAULT_ACTIVITY_RETENTION_PERIOD,
} from './calendar/activityRetentionPeriod'
import {
  calendarEventPrefixSignal,
  DEFAULT_CALENDAR_EVENT_PREFIX,
} from './calendar/calendarEventPrefix'
import {
  calendarSyncFrequencySignal,
  DEFAULT_CALENDAR_SYNC_FREQUENCY,
} from './calendar/calendarSyncFrequency'
import {
  DEFAULT_MIN_VIDEO_WATCH_DURATION,
  minVideoWatchDurationSignal,
} from './calendar/minVideoWatchDuration'
import {
  DEFAULT_VIDEO_RESUME_THRESHOLD,
  videoResumeThresholdSignal,
} from './calendar/videoResumeThreshold'
import { calendarIdSignal } from './calendarId'

export function clearState() {
  // There is no supabaseSignal cleared, because it is not stored in chrome.storage.local

  // Session
  sessionSignal.value = null
  sessionStateSignal.value = DEFAULT_SESSION_STATE
  providerTokenSignal.value = null
  providerRefreshTokenSignal.value = null
  providerTokenInfoSignal.value = null
  sessionExpirationThresholdSecondsSignal.value = DEFAULT_SESSION_EXPIRATION_THRESHOLD_SECONDS

  // Calendar
  calendarIdSignal.value = null
  activityRetentionPeriodSignal.value = DEFAULT_ACTIVITY_RETENTION_PERIOD
  calendarEventPrefixSignal.value = DEFAULT_CALENDAR_EVENT_PREFIX
  calendarSyncFrequencySignal.value = DEFAULT_CALENDAR_SYNC_FREQUENCY
  minVideoWatchDurationSignal.value = DEFAULT_MIN_VIDEO_WATCH_DURATION
  videoResumeThresholdSignal.value = DEFAULT_VIDEO_RESUME_THRESHOLD
}
