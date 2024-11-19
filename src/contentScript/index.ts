import { VideoElementManager } from "./VideoElementManager"
import { VIDEO_CHECK_INTERVAL } from "./constants"

const videoManager = new VideoElementManager()

setInterval(() => {
  videoManager.checkForNewVideoElement()
}, VIDEO_CHECK_INTERVAL)

window.addEventListener("unload", () => {
  videoManager.cleanup()
})
