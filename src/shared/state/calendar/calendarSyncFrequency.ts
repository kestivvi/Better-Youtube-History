import { createSignalSupabaseSynced } from '../createSignalSupabaseSynced'

export const DEFAULT_CALENDAR_SYNC_FREQUENCY = 10 * 60 // 10 minutes

export const { calendarSyncFrequencySignal } = createSignalSupabaseSynced(
  'calendarSyncFrequency',
  DEFAULT_CALENDAR_SYNC_FREQUENCY,
)
