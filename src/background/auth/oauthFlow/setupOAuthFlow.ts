import { finishUserOAuth } from './finishUserOAuth'

export function setupOAuthFlow() {
  chrome.tabs.onUpdated.addListener((_tabId, changeInfo, _tab) => {
    if (changeInfo.url?.startsWith(chrome.identity.getRedirectURL())) {
      finishUserOAuth(changeInfo.url)
    }
  })
}
