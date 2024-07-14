import timeupdateListener from './timeupdateListener'
import { videoElementSignal } from './videoElementSignal'

function findActiveVideoElement(videoElements: HTMLCollectionOf<HTMLVideoElement>) {
  return videoElements?.[0] ?? null
}

export default function () {
  // Find HTML video element in the current page
  const videoElements = document.getElementsByTagName('video')
  const newVideoElement = findActiveVideoElement(videoElements)

  // Handle early returns
  if (newVideoElement === null) return
  if (newVideoElement === videoElementSignal.value) return

  // Update video element signal and timeupdate listener
  videoElementSignal.value?.removeEventListener('timeupdate', timeupdateListener)
  videoElementSignal.value = newVideoElement
  videoElementSignal.value.addEventListener('timeupdate', timeupdateListener)
}
