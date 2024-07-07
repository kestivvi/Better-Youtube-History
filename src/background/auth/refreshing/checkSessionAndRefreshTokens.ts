import { type SupabaseClient } from '@supabase/supabase-js'
import { isSessionRefreshNeeded } from './isSessionRefreshNeeded'
import { refreshSession } from './refreshSession'
import { refreshProviderToken } from './refreshProviderToken'
import { isProviderTokenRefreshNeeded } from './isProviderTokenRefreshNeeded'

export async function checkSessionAndRefreshTokens(
  supabase: SupabaseClient,
  leadTimeInSeconds: number,
) {
  try {
    const { session } = await chrome.storage.local.get('session')

    if (!session) {
      console.warn('[checkSessionAndRefreshTokens] No session found in storage.')
      return
    }

    console.log('[checkSessionAndRefreshTokens] Checking session...', session)

    const shouldRefreshSession = isSessionRefreshNeeded(session, leadTimeInSeconds)
    const shouldRefreshProviderToken = await isProviderTokenRefreshNeeded(
      session,
      leadTimeInSeconds,
    )

    if (!shouldRefreshSession && !shouldRefreshProviderToken) {
      console.log('[checkSessionAndRefreshTokens] Session is still valid, no need to refresh.')
      return
    }

    console.log('[checkSessionAndRefreshTokens] Session is expired, attempting to refresh...')

    await refreshSession(supabase, session)
    await refreshProviderToken(supabase)

    console.log('[checkSessionAndRefreshTokens] Session and provider token refreshed.')
  } catch (err) {
    console.error('[checkSessionAndRefreshTokens] Unexpected error:', err)
  }
}
