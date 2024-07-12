import { SupabaseClient } from '@supabase/supabase-js'

export async function fetchSupabaseForCalendarId(supabase: SupabaseClient): Promise<string | null> {
  const queryResponse = await supabase.from('user_config').select('calendarId')
  return queryResponse.data?.[0]?.calendarId ?? null
}
