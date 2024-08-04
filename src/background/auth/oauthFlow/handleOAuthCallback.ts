import { fetchProviderTokenInfo } from "@/shared/auth/tokens/fetchProviderTokenInfo"
import { fetchSupabaseForCalendarId } from "@/shared/calendar/fetchSupabaseForCalendarId"
import { sessionSignal, sessionStateSignal } from "@/shared/state/auth/session"
import type { SessionType } from "@/shared/state/auth/session/types"
import { providerRefreshTokenSignal } from "@/shared/state/auth/tokens/providerRefreshToken"
import { providerTokenSignal } from "@/shared/state/auth/tokens/providerToken"
import { providerTokenInfoSignal } from "@/shared/state/auth/tokens/providerTokenInfo"
import { calendarIdSignal } from "@/shared/state/calendarId"
import { supabaseSignal } from "@/shared/state/supabase"
import extractTokensFromUrl from "./extractTokensFromUrl"

const LOG_PREFIX = "[handleOAuthCallback]"

/**
 * Method used to handle OAuth callback for a user authentication.
 * Used in background script as message listener on URL change.
 */
export async function handleOAuthCallback(url: string): Promise<void> {
  // Google OAuth callback URL contains tokens in the url
  const tokens = extractTokensFromUrl(url)
  if (!tokens) return console.error(`${LOG_PREFIX} No tokens found in URL:`, url)
  const { access_token, refresh_token, provider_token, provider_refresh_token } = tokens

  // Set the Supabase session
  const { data, error } = await supabaseSignal.value.auth.setSession({
    access_token,
    refresh_token,
  })

  if (error) return console.error(`${LOG_PREFIX} Error setting session`, error)

  // Set signals
  sessionSignal.value = data.session as SessionType
  providerTokenSignal.value = provider_token
  providerRefreshTokenSignal.value = provider_refresh_token

  // Fetch and save information about the provider token
  // It's better to cache this, instead of fetching it every time
  // when checking if the token is valid
  const providerTokenInfo = await fetchProviderTokenInfo(provider_token)
  if (providerTokenInfo) providerTokenInfoSignal.value = providerTokenInfo

  // Fetch calendar ID from Supabase
  // This works if user has already used the extension
  // and is logging on another device
  const calendarId = await fetchSupabaseForCalendarId(supabaseSignal.value)
  if (calendarId) calendarIdSignal.value = calendarId

  // At the end set the session state to LOGGED_IN
  // and redirect to a post OAuth page
  sessionStateSignal.value = "LOGGED_IN"
  const redirectPage = chrome.runtime.getURL("redirectPage.html")
  chrome.tabs.update({ url: redirectPage })
}
