import type { ProviderTokenInfo } from "@/shared/state/auth/tokens/providerTokenInfo"

const GOOGLE_OAUTH_TOKENINFO_URL =
  "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token="
const HTTP_METHOD_POST = "POST"

function constructUrl(providerToken: string): string {
  return `${GOOGLE_OAUTH_TOKENINFO_URL}${providerToken}`
}

export async function fetchProviderTokenInfo(
  providerToken: string,
): Promise<ProviderTokenInfo | null> {
  const url = constructUrl(providerToken)

  try {
    const response = await fetch(url, { method: HTTP_METHOD_POST })

    if (!response.ok) {
      console.error(
        "[fetchProviderTokenInfo] Error fetching token info:",
        response.statusText,
      )
      return null
    }

    const tokenInfo: ProviderTokenInfo = await response.json()
    return tokenInfo
  } catch (error) {
    console.error("[fetchProviderTokenInfo] Network error:", error)
    return null
  }
}
