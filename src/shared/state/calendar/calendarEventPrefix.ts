import { createSignalSupabaseSynced } from '../createSignalSupabaseSynced'

export const DEFAULT_CALENDAR_EVENT_PREFIX = '📺'

export const { calendarEventPrefixSignal } = createSignalSupabaseSynced(
  'calendarEventPrefix',
  DEFAULT_CALENDAR_EVENT_PREFIX,
)
