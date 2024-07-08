import { createSignal } from './createSignal'
import { supabaseSignal } from './supabase'

export const { calendarIdSignal } = createSignal('calendarId', null as string | null)

supabaseSignal.value
  .channel('calendarChanged')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'user_calendar_ids' },
    (payload) => {
      console.warn('Change received!', payload)

      if (payload.eventType === 'DELETE') {
        calendarIdSignal.value = null
      } else if (payload.eventType === 'INSERT') {
        calendarIdSignal.value = payload.new['calendar_id']
      } else if (payload.eventType === 'UPDATE') {
        calendarIdSignal.value = payload.new['calendar_id']
      }
    },
  )
  .subscribe()
