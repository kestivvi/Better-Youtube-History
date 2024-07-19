import { fetchAndSaveTokenInfo } from "@/shared/auth/tokens/fetchAndSaveTokenInfo"
import { sessionSignal, sessionStateSignal } from "@/shared/state/auth/session"
import { providerTokenSignal } from "@/shared/state/auth/tokens/providerToken"
import { providerRefreshTokenSignal } from "@/shared/state/auth/tokens/providerRefreshToken"
import { supabaseSignal } from "@/shared/state/supabase"
import { SessionType } from "@/shared/state/auth/session/types"
import { fetchSupabaseForCalendarId } from "@/shared/calendar/fetchSupabaseForCalendarId"
import { calendarIdSignal } from "@/shared/state/calendarId"

/**
 * Method used to finish OAuth callback for a user authentication.
 * Used in background script as message listener on url change.
 */
export async function finishUserOAuth(url: string) {
  try {
    console.debug(`[finishUserOAuth] handling user OAuth callback. Url: `, url)

    // extract tokens from hash
    const hashMap = parseUrlHash(url)
    const access_token = hashMap.get("access_token")
    const refresh_token = hashMap.get("refresh_token")

    // get provider_token and provider_refresh_token
    const provider_token = hashMap.get("provider_token")
    const provider_refresh_token = hashMap.get("provider_refresh_token")

    console.debug("[finishUserOAuth] access_token", access_token)
    console.debug("[finishUserOAuth] refresh_token", refresh_token)
    console.debug("[finishUserOAuth] provider_token", provider_token)
    console.debug("[finishUserOAuth] provider_refresh_token", provider_refresh_token)

    if (!access_token || !refresh_token || !provider_token || !provider_refresh_token) {
      throw new Error(`no tokens found in URL hash`)
    }

    // check if they work
    const { data, error } = await supabaseSignal.value.auth.setSession({
      access_token,
      refresh_token,
    })

    if (error) throw error

    // set the session
    sessionSignal.value = data.session as SessionType
    providerTokenSignal.value = provider_token
    providerRefreshTokenSignal.value = provider_refresh_token

    console.debug("[finishUserOAuth] session", data.session)

    // finally redirect to a post oauth page
    const redirectPage = chrome.runtime.getURL("redirectPage.html")
    chrome.tabs.update({ url: redirectPage })

    // fetch and save provider token info
    await fetchAndSaveTokenInfo(provider_token)

    // fetch calendar id
    const calendarId = await fetchSupabaseForCalendarId(supabaseSignal.value)
    calendarIdSignal.value = calendarId

    sessionStateSignal.value = "LOGGED_IN"
    console.debug(`[finishUserOAuth] finished handling user OAuth callback`)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Helper method used to parse the hash of a redirect URL.
 */
function parseUrlHash(url: string) {
  const hashParts = new URL(url).hash.slice(1).split("&")
  const hashMap = new Map(
    hashParts.map((part) => {
      const [name, value] = part.split("=")
      return [name, value]
    }),
  )

  return hashMap
}
