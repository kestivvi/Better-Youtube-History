import { type SupabaseClient } from '@supabase/supabase-js'

export async function refreshSession(supabase: SupabaseClient, session: any) {
  try {
    const { data, error } = await supabase.auth.refreshSession(session)

    if (error) {
      console.error('[refreshSession] Error refreshing session:', error)
      return
    }

    if (data && data.session) {
      console.log('[refreshSession] Session refreshed:', data.session)
      await chrome.storage.local.set({ session: data.session })
    } else {
      console.error('[refreshSession] No session data received after refresh.')
    }
  } catch (err) {
    console.error('[refreshSession] Unexpected error:', err)
  }
}
