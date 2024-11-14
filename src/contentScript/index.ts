import { VIDEO_CHECK_INTERVAL } from "./constants"
import { VideoElementManager } from "./VideoElementManager"

const videoManager = new VideoElementManager()

setInterval(() => {
  videoManager.checkForNewVideoElement()
}, VIDEO_CHECK_INTERVAL)

window.addEventListener("unload", () => {
  videoManager.cleanup()
})
