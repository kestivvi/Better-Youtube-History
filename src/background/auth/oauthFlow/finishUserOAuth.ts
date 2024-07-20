import { fetchAndSaveTokenInfo } from "@/shared/auth/tokens/fetchAndSaveTokenInfo"
import { fetchSupabaseForCalendarId } from "@/shared/calendar/fetchSupabaseForCalendarId"
import { sessionSignal, sessionStateSignal } from "@/shared/state/auth/session"
import type { SessionType } from "@/shared/state/auth/session/types"
import { providerRefreshTokenSignal } from "@/shared/state/auth/tokens/providerRefreshToken"
import { providerTokenSignal } from "@/shared/state/auth/tokens/providerToken"
import { calendarIdSignal } from "@/shared/state/calendarId"
import { supabaseSignal } from "@/shared/state/supabase"

/**
 * Method used to finish OAuth callback for a user authentication.
 * Used in background script as message listener on url change.
 */
export async function finishUserOAuth(url: string) {
  console.debug("[finishUserOAuth] handling user OAuth callback. Url: ", url)

  // Extract tokens from hash
  const { access_token, refresh_token, provider_token, provider_refresh_token } =
    parseUrlHash(url)

  console.debug("[finishUserOAuth] access_token", access_token)
  console.debug("[finishUserOAuth] refresh_token", refresh_token)
  console.debug("[finishUserOAuth] provider_token", provider_token)
  console.debug("[finishUserOAuth] provider_refresh_token", provider_refresh_token)

  if (!access_token || !refresh_token || !provider_token || !provider_refresh_token) {
    console.error("no tokens found in URL hash")
    return
  }

  // Set the supabase session
  const { data, error } = await supabaseSignal.value.auth.setSession({
    access_token,
    refresh_token,
  })

  if (error) {
    console.error("[finishUserOAuth] error setting session", error)
    return
  }

  console.debug("[finishUserOAuth] session", data.session)

  // Set signals
  sessionSignal.value = data.session as SessionType
  providerTokenSignal.value = provider_token
  providerRefreshTokenSignal.value = provider_refresh_token

  // finally redirect to a post oauth page
  const redirectPage = chrome.runtime.getURL("redirectPage.html")
  chrome.tabs.update({ url: redirectPage })

  // fetch and save provider token info
  await fetchAndSaveTokenInfo(provider_token)

  // fetch calendar id
  const calendarId = await fetchSupabaseForCalendarId(supabaseSignal.value)
  calendarIdSignal.value = calendarId

  sessionStateSignal.value = "LOGGED_IN"
  console.debug("[finishUserOAuth] finished handling user OAuth callback")
}

/**
 * Helper method used to parse the hash of a redirect URL.
 */
function parseUrlHash(url: string) {
  return new URL(url).hash
    .slice(1)
    .split("&")
    .reduce(
      (acc, part) => {
        const [key, value] = part.split("=")

        if (!key || !value) return acc

        acc[key] = value
        return acc
      },
      {} as Record<string, string>,
    )
}
