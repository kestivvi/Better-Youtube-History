const GOOGLE_OAUTH_TOKENINFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token='

function constructUrl(providerToken: string): string {
  return GOOGLE_OAUTH_TOKENINFO_URL + providerToken
}

export async function fetchTokenInfo(providerToken: string): Promise<Response> {
  const url = constructUrl(providerToken)

  // TODO: Make a generic for returned data
  const response = await fetch(url, { method: 'POST' })
  return response
}
