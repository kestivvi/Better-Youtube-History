import { VideoEventManager } from "./VideoEventManager"

export class VideoElementManager {
  private currentVideoElement: HTMLVideoElement | null = null
  private readonly eventManager: VideoEventManager

  constructor() {
    this.eventManager = new VideoEventManager()
  }

  private findActiveVideoElement(
    videoElements: HTMLCollectionOf<HTMLVideoElement>,
  ): HTMLVideoElement | null {
    type FinderStrategy = (
      elements: HTMLCollectionOf<HTMLVideoElement>,
    ) => HTMLVideoElement | null

    const strategies: FinderStrategy[] = [
      // Find playing video
      (elements) => Array.from(elements).find((video) => !video.paused) ?? null,
      // Find video with progress
      (elements) => Array.from(elements).find((video) => video.currentTime > 0) ?? null,
      // Find video that has buffered data
      (elements) => Array.from(elements).find((video) => video.readyState >= 3) ?? null,
      // Find first video
      (elements) => elements[0] ?? null,
    ]

    return strategies.reduce<HTMLVideoElement | null>((result, strategy) => {
      if (result) return result
      return strategy(videoElements)
    }, null)
  }

  public checkForNewVideoElement(): void {
    const videoElements = document.getElementsByTagName("video")
    const potentiallyNewVideoElement = this.findActiveVideoElement(videoElements)

    // If there is no active video element, return
    if (potentiallyNewVideoElement === null) return

    // If the video element is the same as the current one, return
    if (potentiallyNewVideoElement === this.currentVideoElement) return

    // Clean up old video element
    if (this.currentVideoElement) {
      this.eventManager.detachEventListeners(this.currentVideoElement)
    }

    // Set up new video element
    this.currentVideoElement = potentiallyNewVideoElement
    this.eventManager.attachEventListeners(this.currentVideoElement)
  }

  public cleanup(): void {
    if (this.currentVideoElement) {
      this.eventManager.detachEventListeners(this.currentVideoElement)
      this.currentVideoElement = null
    }
  }
}
