import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Method used to login with google provider.
 * Should be used in popup view.
 */
export async function loginWithGoogle(supabase: SupabaseClient) {
  const manifest = chrome.runtime.getManifest()
  const redirectTo = chrome.identity.getRedirectURL()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        client_id: manifest.oauth2!.client_id,
        response_type: 'code',
        scope: manifest.oauth2!.scopes!.join(' '),
        access_type: 'offline',
        prompt: 'consent',
        include_granted_scopes: 'true',
      },
    },
  })
  if (error) throw error
  await chrome.tabs.create({ url: data.url })
}
