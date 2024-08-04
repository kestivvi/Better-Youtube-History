import { sessionSignal, sessionStateSignal } from "@/shared/state/auth/session"
import type { SessionType } from "@/shared/state/auth/session/types"
import type { SupabaseClient } from "@supabase/supabase-js"

const LOG_PREFIX = "[refreshSession]"

export async function refreshSession(supabase: SupabaseClient, refreshToken: string) {
  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    })

    // Handle errors
    if (error) {
      sessionStateSignal.value = "NOT_LOGGED_IN"
      return console.error(`${LOG_PREFIX} Error refreshing session:`, error)
    }

    if (!data?.session) {
      sessionStateSignal.value = "NOT_LOGGED_IN"
      return console.error(`${LOG_PREFIX} No session data received after refresh.`)
    }

    if (!data?.session.refresh_token) {
      sessionStateSignal.value = "NOT_LOGGED_IN"
      return console.error(`${LOG_PREFIX} No refresh token found in session.`)
    }

    // Handle success
    sessionSignal.value = data.session as SessionType
    sessionStateSignal.value = "LOGGED_IN"
  } catch (err) {
    // Handle unexpected network errors
    // in this case, we postpone the session refresh
    console.error(`${LOG_PREFIX} Unexpected error:`, err)
    setTimeout(() => refreshSession(supabase, refreshToken), 10 * 1000)
  }
}
