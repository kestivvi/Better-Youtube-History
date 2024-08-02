import { videoPlayingHandler } from "./handlers/videoPlaying"
import type { Message } from "./types"

// This function is used to ensure that we handle all possible message types
// using type checking in typescript
function exhaustiveCheck(_exhaustiveCheck: never) {
  console.error("unknown message type", _exhaustiveCheck)
}

export function setupHandlingRuntimeMessages() {
  chrome.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
    switch (message.type) {
      case "VIDEO_PLAYING":
        videoPlayingHandler(message, sender, sendResponse)
        break
      default:
        exhaustiveCheck(message.type)
    }
  })
}
