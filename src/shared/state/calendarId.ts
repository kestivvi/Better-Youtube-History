import { fetchSupabaseForCalendarId } from '../calendar/fetchSupabaseForCalendarId'
import { sessionSignal } from './auth/session'
import { createSignal } from './createSignal'
import { supabaseSignal } from './supabase'

const KEY = 'calendarId'

export const { calendarIdSignal } = createSignal(KEY, null as string | null, {
  // Initialize and check if the user has a calendar ID stored in the supabase database
  callbackAfterInitFromStorage: async (value) => {
    const calendarId = await fetchSupabaseForCalendarId(supabaseSignal.value)

    if (calendarId !== value) {
      calendarIdSignal.value = calendarId
    }
  },
})

// Update the calendar ID in the supabase database whenever the signal's value changes
calendarIdSignal.subscribe(async (value) => {
  const userId = sessionSignal.value?.user?.id
  if (!userId) return console.error('[calendarIdSignal] User is not logged in')

  supabaseSignal.value
    .from('user_config')
    .update([{ [KEY]: value }])
    .eq('user_id', userId)
})

supabaseSignal.value
  .channel('userConfigChanged')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'user_config' }, (payload) => {
    if (!(KEY in payload.new)) return
    if (payload.new[KEY] === calendarIdSignal.value) return

    if (calendarIdSignal.value !== payload.new[KEY]) {
      calendarIdSignal.value = payload.new[KEY]
    }
  })
  .subscribe()
