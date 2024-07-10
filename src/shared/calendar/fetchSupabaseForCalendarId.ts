import { SupabaseClient } from '@supabase/supabase-js'

export async function fetchSupabaseForCalendarId(supabase: SupabaseClient): Promise<string | null> {
  const queryResponse = await supabase.from('user_calendar_ids').select('calendar_id')
  return queryResponse.data?.[0]?.calendar_id ?? null
}
