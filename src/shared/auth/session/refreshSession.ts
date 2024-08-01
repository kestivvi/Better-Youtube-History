import { sessionSignal, sessionStateSignal } from "@/shared/state/auth/session"
import type { SessionType } from "@/shared/state/auth/session/types"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function refreshSession(supabase: SupabaseClient, refreshToken: string) {
  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    })

    if (error) {
      // TODO: Somehow there is a case where in a session there is no refresh token
      console.error("[refreshSession] Error refreshing session:", error)
      sessionStateSignal.value = "NOT_LOGGED_IN"
      return
    }

    if (data?.session) {
      console.debug("[refreshSession] Got session data:", data.session)

      if (!data?.session.refresh_token) {
        console.error("[refreshSession] No refresh token found in session.")
        sessionStateSignal.value = "NOT_LOGGED_IN"
        return
      }

      sessionSignal.value = data.session as SessionType
      sessionStateSignal.value = "LOGGED_IN"
    } else {
      console.error("[refreshSession] No session data received after refresh.")
      sessionStateSignal.value = "NOT_LOGGED_IN"
    }
  } catch (err) {
    console.error("[refreshSession] Unexpected error:", err)
    sessionStateSignal.value = "NOT_LOGGED_IN"
  }
}
