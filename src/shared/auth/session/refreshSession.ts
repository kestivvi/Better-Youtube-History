import { sessionSignal, sessionStateSignal } from "@/shared/state/auth/session"
import { SessionType } from "@/shared/state/auth/session/types"
import { type SupabaseClient } from "@supabase/supabase-js"

export async function refreshSession(supabase: SupabaseClient, session: SessionType) {
  try {
    const { data, error } = await supabase.auth.refreshSession(session)

    if (error) {
      // TODO: Somehow there is a case where in a session there is no refresh token
      console.error("[refreshSession] Error refreshing session:", error)
      sessionStateSignal.value = "NOT_LOGGED_IN"
      return
    }

    if (data && data.session) {
      console.log("[refreshSession] Session refreshed:", data.session)
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
