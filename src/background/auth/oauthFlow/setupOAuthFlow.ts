import { handleOAuthCallback } from "./handleOAuthCallback"

/**
 * Sets up the OAuth flow by adding a listener to the Chrome tabs onUpdated event.
 * This listener checks for URL changes that match the OAuth redirect URL and
 * triggers the OAuth completion process.
 */
export function setupOAuthFlow() {
  chrome.tabs.onUpdated.addListener((_tabId, changeInfo, _tab) => {
    // Check if the URL change matches the OAuth redirect URL
    if (changeInfo.url?.startsWith(chrome.identity.getRedirectURL())) {
      // If it matches, call handleOAuthCallback to handle the OAuth callback
      handleOAuthCallback(changeInfo.url)
    }
  })
}
