import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { checkSessionAndRefreshTokens } from './refreshing/checkSessionAndRefreshTokens'
import secrets from '../../secrets'

export async function getProviderToken() {
  try {
    const { provider_token } = await chrome.storage.local.get('provider_token')

    if (!provider_token) {
      console.warn('[getProviderToken] No provider token found in storage.')
      return
    }

    const supabase = createClient(secrets.supabase.url, secrets.supabase.key)

    await checkSessionAndRefreshTokens(supabase, 60 * 10)

    console.log('[getProviderToken] Provider token:', provider_token)
    return provider_token
  } catch (err) {
    console.error('[getProviderToken] Unexpected error:', err)
  }
}
