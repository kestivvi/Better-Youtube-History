import type { SupabaseClient } from "@supabase/supabase-js"

export async function loginWithGoogle(supabase: SupabaseClient): Promise<void> {
  const manifest = chrome.runtime.getManifest()
  const redirectTo = chrome.identity.getRedirectURL()

  const clientId = manifest?.oauth2?.client_id
  const scopes = manifest?.oauth2?.scopes?.join(" ")

  // Check if the manifest has the required OAuth2 information
  if (!clientId || !scopes) {
    // This should never happen, but it's better to check
    return console.error(
      "OAuth2 information is missing `client_id` and `scopes` in the manifest.",
    )
  }

  const oauthOptions = {
    redirectTo,
    queryParams: {
      client_id: clientId,
      scope: scopes,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
    },
  }

  // Use try/catch to handle network errors
  try {
    // We are using the OAuth flow with help of Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: oauthOptions,
    })

    if (error) {
      return console.error("[loginWithGoogle] Error during sign-in:", error.message)
    }

    // Redirect to the Google OAuth page
    await chrome.tabs.create({ url: data.url })
  } catch (error) {
    console.error("[loginWithGoogle] Unexpected error:", error)
  }
}
