import { fetchSupabaseForCalendarId } from '../calendar/fetchSupabaseForCalendarId'
import { createSignal } from './createSignal'
import { supabaseSignal } from './supabase'

export const { calendarIdSignal } = createSignal('calendarId', null as string | null, {
  // Initialize and check if the user has a calendar ID stored in the supabase database
  callbackAfterInitFromStorage: async (value) => {
    const calendarId = await fetchSupabaseForCalendarId(supabaseSignal.value)

    if (calendarId !== value) {
      calendarIdSignal.value = calendarId
    }
  },
})

// Update the calendar ID in the supabase database whenever the signal's value changes
calendarIdSignal.subscribe((value) => {
  if (value === null) {
    supabaseSignal.value.from('user_calendar_ids').delete().match({ calendar_id: value })
  } else {
    supabaseSignal.value.from('user_calendar_ids').upsert([{ calendar_id: value }])
  }
})

supabaseSignal.value
  .channel('calendarChanged')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'user_calendar_ids' },
    (payload) => {
      console.debug('[supabaseCalendarChanged] Change received!', payload)

      if (payload.eventType === 'DELETE') {
        // I don't know if this is necessary, or do signals memoize by default
        if (calendarIdSignal.value !== null) {
          calendarIdSignal.value = null
        }
      } else if (payload.eventType === 'INSERT') {
        if (calendarIdSignal.value !== payload.new['calendar_id']) {
          calendarIdSignal.value = payload.new['calendar_id']
        }
      } else if (payload.eventType === 'UPDATE') {
        if (calendarIdSignal.value !== payload.new['calendar_id']) {
          calendarIdSignal.value = payload.new['calendar_id']
        }
      }
    },
  )
  .subscribe()
