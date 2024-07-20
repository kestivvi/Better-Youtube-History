import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Method used to login with google provider.
 * Should be used in popup view.
 */
export async function loginWithGoogle(supabase: SupabaseClient) {
  const manifest = chrome.runtime.getManifest()
  const redirectTo = chrome.identity.getRedirectURL()

  const clientId = manifest?.oauth2?.client_id
  const scopes = manifest?.oauth2?.scopes?.join(" ")

  if (!clientId || !scopes) {
    console.error(
      "OAuth2 information is missing `client_id` and `scopes` in the manifest.",
    )
    return
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        client_id: clientId,
        response_type: "code",
        scope: scopes,
        access_type: "offline",
        prompt: "consent",
        include_granted_scopes: "true",
      },
    },
  })

  if (error) {
    console.error(error.message)
    return
  }

  await chrome.tabs.create({ url: data.url })
}
