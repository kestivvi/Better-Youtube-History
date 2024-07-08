//   const { provider_token } = await chrome.storage.local.get('provider_token')
const logPrefix = '[isProviderTokenRefreshNeeded]'

export async function isProviderTokenRefreshNeeded(
  providerToken: string,
  leadTimeInSeconds: number,
) {
  console.log(`${logPrefix} Trying to verify provider token...`, providerToken)

  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${providerToken}`,
      {
        method: 'POST',
      },
    )

    if (!response.ok) {
      // TODO: It should be normal log
      console.error(`${logPrefix} Failed to verify provider token. Status: ${response.status}`)
      return true
    }

    const data = await response.json()
    console.log(`${logPrefix} Provider token verification data:`, data)

    const tokenExpiresAt = Number(data.exp)
    const currentTime = Math.floor(new Date().getTime() / 1000)
    const secondsTokenExpiresIn = tokenExpiresAt - currentTime

    console.log(`${logPrefix} Token expires in ${secondsTokenExpiresIn} seconds`)
    if (secondsTokenExpiresIn > leadTimeInSeconds) {
      console.log(`${logPrefix} Provider token is still valid, no need to refresh.`)
      return false
    }

    return true
  } catch (error) {
    console.error(`${logPrefix} Error verifying provider token:`, error)
    return true
  }
}
