import { finishUserOAuth } from './finishUserOAuth'

export function setupOAuthFlow() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url?.startsWith(chrome.identity.getRedirectURL())) {
      finishUserOAuth(changeInfo.url)
    }
  })
}