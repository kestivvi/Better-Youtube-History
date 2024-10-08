import type { SupabaseClient } from "@supabase/supabase-js"
import type { SessionType } from "../state/auth/session/types"
import type { ProviderTokenInfo } from "../state/auth/tokens/providerTokenInfo"
import { validateAndRefreshSessionTokens } from "./validateAndRefreshSessionTokens"

export async function setupSessionAndTokens(
  session: SessionType | null,
  providerTokenInfo: ProviderTokenInfo | null,
  providerRefreshToken: string | null,
  supabase: SupabaseClient,
  secondsIntoFuture: number = 60 * 10,
) {
  console.debug("[setupSessionAndTokens] Setting up session and tokens...")
  console.debug("[setupSessionAndTokens] Session:", session)
  console.debug("[setupSessionAndTokens] Provider token info:", providerTokenInfo)
  console.debug("[setupSessionAndTokens] Provider refresh token:", providerRefreshToken)

  validateAndRefreshSessionTokens(
    session,
    providerTokenInfo,
    providerRefreshToken,
    supabase,
    secondsIntoFuture,
  )
}
