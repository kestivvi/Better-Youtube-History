import type { SupabaseClient } from "@supabase/supabase-js"
import { sessionStateSignal } from "../state/auth/session"
import type { SessionType } from "../state/auth/session/types"
import type { ProviderTokenInfo } from "../state/auth/tokens/providerTokenInfo"
import { refreshSession } from "./session/refreshSession"
import { willSessionBeValid } from "./session/willSessionBeValid"
import { refreshProviderToken } from "./tokens/refreshProviderToken"
import { willProviderTokenBeValid } from "./tokens/willProviderTokenBeValid"

export async function validateAndRefreshSessionTokens(
  session: SessionType | null,
  providerTokenInfo: ProviderTokenInfo | null,
  providerRefreshToken: string | null,
  supabase: SupabaseClient,
  secondsIntoFuture: number,
) {
  // If no session is found, we have no way to refresh the session
  // so we set the session state to NOT_LOGGED_IN
  if (session === null) {
    sessionStateSignal.value = "NOT_LOGGED_IN"
    return console.error(
      "[validateAndRefreshSessionTokens] No session found. Setting session state to NOT_LOGGED_IN.",
    )
  }

  const isSessionValid = willSessionBeValid(session, secondsIntoFuture)
  const isProviderTokenValid = await willProviderTokenBeValid(
    providerTokenInfo,
    secondsIntoFuture,
  )

  if (!isSessionValid || !isProviderTokenValid) {
    // Refresh both session and provider token
    await refreshSession(supabase, session.refresh_token)
    await refreshProviderToken(supabase, providerRefreshToken)
  }
}
