import type { Message, VideoInfo } from "@/background/runtime_messages/types"
import scrapVideoInfo from "./scrapVideoInfo/getVideoInfoFromHiddenJson"
import throttle from "./throttle"

function isVideoInfoComplete(videoInfo: Partial<VideoInfo>): videoInfo is VideoInfo {
  const requiredFields: (keyof VideoInfo)[] = [
    "videoId",
    "title",
    "channelName",
    "channelUrl",
  ]

  return requiredFields.every(
    (field) => videoInfo[field] !== null && videoInfo[field] !== undefined,
  )
}

function timeUpdateListener() {
  // Scrape video information from DOM
  const videoInfo = scrapVideoInfo()

  // We don't want to send incomplete video info
  if (!isVideoInfoComplete(videoInfo)) return

  const timestamp = new Date().toISOString()

  const message: Message = {
    type: "VIDEO_PLAYING",
    data: {
      timestamp,
      videoInfo,
    },
  }

  // Send message to background script
  chrome.runtime.sendMessage(message)
}

const THROTTLE_DELAY = 5000

// Throttle the timeupdate listener to avoid sending too many messages
// In normal conditions, the timeupdate event fire count per second is around 4-5
export default throttle(timeUpdateListener, THROTTLE_DELAY)
