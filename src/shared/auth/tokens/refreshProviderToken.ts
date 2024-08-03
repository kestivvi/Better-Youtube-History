import { sessionStateSignal } from "@/shared/state/auth/session"
import { providerTokenSignal } from "@/shared/state/auth/tokens/providerToken"
import { providerTokenInfoSignal } from "@/shared/state/auth/tokens/providerTokenInfo"
import type { SupabaseClient } from "@supabase/supabase-js"
import { fetchProviderTokenInfo } from "./fetchProviderTokenInfo"

const LOG_PREFIX = "[refreshProviderToken]"

export async function refreshProviderToken(
  supabase: SupabaseClient,
  providerRefreshToken: string | null,
) {
  try {
    if (!providerRefreshToken) {
      sessionStateSignal.value = "NOT_LOGGED_IN"
      return console.error(`${LOG_PREFIX} No provider refresh token found in storage.`)
    }

    const { data, error } = await supabase.functions.invoke("refresh-google-token", {
      body: {
        provider_refresh_token: providerRefreshToken,
      },
    })

    // Handle errors
    if (error) {
      sessionStateSignal.value = "NOT_LOGGED_IN"
      return console.error(`${LOG_PREFIX} Error refreshing provider token:`, error)
    }

    if (!data?.access_token) {
      sessionStateSignal.value = "NOT_LOGGED_IN"
      return console.error(`${LOG_PREFIX} No access token received after refresh.`)
    }

    // Handle success
    providerTokenSignal.value = data.access_token
    const providerTokenInfo = await fetchProviderTokenInfo(data.access_token)
    if (providerTokenInfo) providerTokenInfoSignal.value = providerTokenInfo
  } catch (err) {
    // Handle unexpected network errors
    // in this case, we postpone the provider token refresh
    console.error(`${LOG_PREFIX} Unexpected error:`, err)
    setTimeout(() => refreshProviderToken(supabase, providerRefreshToken), 10 * 1000)
  }
}
