import { computed, effect } from '@preact/signals-react'

import { database } from '../database'
import { triggerCalendarEventFlush } from './triggerCalendarEventFlush'

import { providerTokenSignal } from '@/shared/state/auth/tokens/providerToken'
import { calendarIdSignal } from '@/shared/state/calendarId'
import { videoResumeThresholdSignal } from '@/shared/state/calendar/videoResumeThreshold'
import { activityRetentionPeriodSignal } from '@/shared/state/calendar/activityRetentionPeriod'
import { minVideoWatchDurationSignal } from '@/shared/state/calendar/minVideoWatchDuration'
import { calendarEventPrefixSignal } from '@/shared/state/calendar/calendarEventPrefix'
import { calendarSyncFrequencySignal } from '@/shared/state/calendar/calendarSyncFrequency'

export function setupCalendarSync() {
  const calendarSync = computed(
    () => async () =>
      triggerCalendarEventFlush(
        database,
        activityRetentionPeriodSignal.value,
        videoResumeThresholdSignal.value,
        minVideoWatchDurationSignal.value,
        calendarEventPrefixSignal.value,
        calendarIdSignal.value,
        providerTokenSignal.value,
      ),
  )

  effect(() => {
    console.debug('Setting up Calendar sync')

    const calendarSyncImmediateTimeout = setTimeout(() => calendarSync.value(), 1000)

    const calendarSyncInterval = setInterval(
      async () => calendarSync.value(),
      calendarSyncFrequencySignal.value * 1000,
    )

    return () => {
      clearTimeout(calendarSyncImmediateTimeout)
      clearInterval(calendarSyncInterval)
    }
  })
}
