import { createSignal } from '../createSignal'

export const DEFAULT_CALENDAR_SYNC_FREQUENCY = 10 * 60 // 10 minutes

export const { calendarSyncFrequencySignal } = createSignal(
  'calendarSyncFrequency',
  DEFAULT_CALENDAR_SYNC_FREQUENCY,
)
