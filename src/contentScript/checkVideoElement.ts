import timeupdateListener from "./timeupdateListener"
import { videoElementSignal } from "./videoElementSignal"

function findActiveVideoElement(videoElements: HTMLCollectionOf<HTMLVideoElement>) {
  // Find the video element that is currently playing
  for (const videoElement of videoElements) {
    if (!videoElement.paused) return videoElement
  }

  // Find the video element that has current time greater than 0
  for (const videoElement of videoElements) {
    if (videoElement.currentTime > 0) return videoElement
  }

  // Find the video element that has buffered data
  // meaning it has started loading the video
  for (const videoElement of videoElements) {
    if (videoElement.readyState >= 3) return videoElement
  }

  // Find the first video element
  return videoElements?.[0] ?? null
}

export default function checkVideoElement() {
  const videoElements = document.getElementsByTagName("video")
  const potentiallyNewVideoElement = findActiveVideoElement(videoElements)

  // If there is no active video element, return
  if (potentiallyNewVideoElement === null) return

  // If the video element is the same as the current one, return
  if (potentiallyNewVideoElement === videoElementSignal.value) return

  // Update video element signal and timeupdate listener
  videoElementSignal.value?.removeEventListener("timeupdate", timeupdateListener)
  videoElementSignal.value = potentiallyNewVideoElement
  videoElementSignal.value.addEventListener("timeupdate", timeupdateListener)
}
