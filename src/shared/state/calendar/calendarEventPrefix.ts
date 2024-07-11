import { createSignal } from '../createSignal'

export const DEFAULT_CALENDAR_EVENT_PREFIX = '📺'

export const { calendarEventPrefixSignal } = createSignal(
  'calendarEventPrefix',
  DEFAULT_CALENDAR_EVENT_PREFIX,
)
