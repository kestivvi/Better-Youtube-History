import type { Message, VideoInfo } from "@/background/runtime_messages/types"
import { TIME_UPDATE_THROTTLE } from "./constants"
import scrapVideoInfo from "./scrapVideoInfo"
import throttle from "./throttle"

export class VideoEventManager {
  private readonly throttledTimeUpdateHandler: (event: Event) => void

  constructor() {
    this.throttledTimeUpdateHandler = throttle(
      () => this.handleTimeUpdate(),
      TIME_UPDATE_THROTTLE,
    )
  }

  private handleTimeUpdate(): void {
    // Scrape video information from DOM
    const videoInfo = scrapVideoInfo()

    // We don't want to send incomplete video info
    if (!this.isVideoInfoComplete(videoInfo)) return

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

  private isVideoInfoComplete(videoInfo: Partial<VideoInfo>): videoInfo is VideoInfo {
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

  public attachEventListeners(videoElement: HTMLVideoElement): void {
    videoElement.addEventListener("timeupdate", this.throttledTimeUpdateHandler)
  }

  public detachEventListeners(videoElement: HTMLVideoElement): void {
    videoElement.removeEventListener("timeupdate", this.throttledTimeUpdateHandler)
  }
}
