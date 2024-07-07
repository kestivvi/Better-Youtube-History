import { type SupabaseClient } from '@supabase/supabase-js'

export async function refreshProviderToken(supabase: SupabaseClient) {
  try {
    const { provider_refresh_token } = await chrome.storage.local.get('provider_refresh_token')

    if (!provider_refresh_token) {
      console.warn('[refreshProviderToken] No provider refresh token found in storage.')
      return
    }

    console.log(
      '[refreshProviderToken] Refreshing provider token... Using refresh token:',
      provider_refresh_token,
    )

    const { data, error } = await supabase.functions.invoke('refresh-google-token', {
      body: {
        provider_refresh_token,
      },
    })

    if (error) {
      console.error('[refreshProviderToken] Error refreshing provider token:', error)
      return
    }

    if (data && data.access_token) {
      console.log('[refreshProviderToken] Provider token refreshed:', data.access_token)
      await chrome.storage.local.set({
        provider_token: data.access_token,
      })
    } else {
      console.error('[refreshProviderToken] No access token received after refresh.')
    }
  } catch (err) {
    console.error('[refreshProviderToken] Unexpected error:', err)
  }
}
