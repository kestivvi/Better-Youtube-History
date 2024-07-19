import { providerTokenSignal } from "@/shared/state/auth/tokens/providerToken"
import type { SupabaseClient } from "@supabase/supabase-js"
import { fetchAndSaveTokenInfo } from "./fetchAndSaveTokenInfo"
import { sessionStateSignal } from "@/shared/state/auth/session"

export async function refreshProviderToken(
  supabase: SupabaseClient,
  providerRefreshToken: string | null,
) {
  try {
    if (!providerRefreshToken) {
      console.warn("[refreshProviderToken] No provider refresh token found in storage.")
      sessionStateSignal.value = "NOT_LOGGED_IN"
      return
    }

    console.log(
      "[refreshProviderToken] Refreshing provider token... Using refresh token:",
      providerRefreshToken,
    )

    // TODO: Make a generic for that
    const { data, error } = await supabase.functions.invoke("refresh-google-token", {
      body: {
        provider_refresh_token: providerRefreshToken,
      },
    })

    if (error) {
      console.error("[refreshProviderToken] Error refreshing provider token:", error)
      sessionStateSignal.value = "NOT_LOGGED_IN"
      return
    }

    if (data && data.access_token) {
      console.log("[refreshProviderToken] Provider token refreshed:", data.access_token)
      providerTokenSignal.value = data.access_token

      await fetchAndSaveTokenInfo(data.access_token)
    } else {
      sessionStateSignal.value = "NOT_LOGGED_IN"
      console.error("[refreshProviderToken] No access token received after refresh.")
    }
  } catch (err) {
    sessionStateSignal.value = "NOT_LOGGED_IN"
    console.error("[refreshProviderToken] Unexpected error:", err)
  }
}
