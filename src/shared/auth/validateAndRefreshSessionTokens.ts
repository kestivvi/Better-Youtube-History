import type { SupabaseClient } from "@supabase/supabase-js"
import { willSessionBeValid } from "./session/willSessionBeValid"
import { willProviderTokenBeValid } from "./tokens/willProviderTokenBeValid"
import { refreshSession } from "./session/refreshSession"
import { refreshProviderToken } from "./tokens/refreshProviderToken"
import type { SessionType } from "../state/auth/session/types"
import { sessionStateSignal } from "../state/auth/session"
import type { ProviderTokenInfo } from "../state/auth/tokens/providerTokenInfo"

export async function validateAndRefreshSessionTokens(
  session: SessionType | null,
  providerTokenInfo: ProviderTokenInfo | null,
  providerRefreshToken: string | null,
  supabase: SupabaseClient,
  secondsIntoFuture = 60,
) {
  if (session === null) {
    console.debug(
      "[validateAndRefreshSessionTokens] No session found. Setting session state to NOT_LOGGED_IN.",
    )
    sessionStateSignal.value = "NOT_LOGGED_IN"
    return
  }

  const isSessionValid = willSessionBeValid(session, secondsIntoFuture)
  console.debug("[validateAndRefreshSessionTokens] isSessionValid:", isSessionValid)

  const isProviderTokenValid = await willProviderTokenBeValid(
    providerTokenInfo,
    secondsIntoFuture,
  )
  console.debug(
    "[validateAndRefreshSessionTokens] isProviderTokenValid:",
    isProviderTokenValid,
  )

  if (isSessionValid && isProviderTokenValid) {
    sessionStateSignal.value = "LOGGED_IN"
  }

  if (!isSessionValid || !isProviderTokenValid) {
    await refreshSession(supabase, session)
    await refreshProviderToken(supabase, providerRefreshToken)
  }
}
