import { createClient } from '@supabase/supabase-js'
import secrets from '../secrets'

console.log('background is running')

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
})

// add tab listener when background script starts
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url?.startsWith(chrome.identity.getRedirectURL())) {
    finishUserOAuth(changeInfo.url)
  }
})

/**
 * Method used to finish OAuth callback for a user authentication.
 */
async function finishUserOAuth(url: string) {
  try {
    console.log(`handling user OAuth callback ...`)
    const supabase = createClient(secrets.supabase.url, secrets.supabase.key)

    console.log('url', url)

    // extract tokens from hash
    const hashMap = parseUrlHash(url)
    const access_token = hashMap.get('access_token')
    const refresh_token = hashMap.get('refresh_token')

    // get provider_token and provider_refresh_token
    const provider_token = hashMap.get('provider_token')
    const provider_refresh_token = hashMap.get('provider_refresh_token')

    console.log('access_token', access_token)
    console.log('refresh_token', refresh_token)
    console.log('provider_token', provider_token)
    console.log('provider_refresh_token', provider_refresh_token)

    if (!access_token || !refresh_token || !provider_token || !provider_refresh_token) {
      throw new Error(`no tokens found in URL hash`)
    }

    // check if they work
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })
    if (error) throw error

    // persist session to storage
    await chrome.storage.local.set({ session: data.session })

    // persist provider tokens to storage
    await chrome.storage.local.set({ provider_token, provider_refresh_token })

    console.log('session', data.session)

    // finally redirect to a post oauth page
    const homePage = chrome.runtime.getURL('home.html')
    chrome.tabs.update({ url: homePage })

    console.log(`finished handling user OAuth callback`)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Helper method used to parse the hash of a redirect URL.
 */
function parseUrlHash(url: string) {
  const hashParts = new URL(url).hash.slice(1).split('&')
  const hashMap = new Map(
    hashParts.map((part) => {
      const [name, value] = part.split('=')
      return [name, value]
    }),
  )

  return hashMap
}
