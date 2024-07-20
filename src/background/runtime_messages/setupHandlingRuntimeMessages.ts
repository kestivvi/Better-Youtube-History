import { videoPlayingHandler } from "./handlers/videoPlaying"
import type { Message } from "./types"

export function setupHandlingRuntimeMessages() {
  chrome.runtime.onMessage.addListener(async (_message, sender, sendResponse) => {
    const message = _message as Message
    console.log(message)

    switch (message.type) {
      case "VIDEO_PLAYING":
        videoPlayingHandler(message, sender, sendResponse)
        break
      default:
        console.error("unknown message type", message)
      // let _exhaustiveCheck: never = message
    }
  })
}
