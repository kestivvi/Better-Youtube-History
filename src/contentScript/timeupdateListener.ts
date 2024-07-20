import reverseDebounce from "./reverseDebounce"
import scrapVideoInfo from "./scrapVideoInfo"

function timeUpdateListener() {
  const videoInfo = scrapVideoInfo()

  console.log("Video info:", videoInfo)

  if (Object.values(videoInfo).some((value) => value === null || value === undefined)) {
    console.log("Video info is incomplete, skipping.")
    return
  }

  chrome.runtime.sendMessage({
    type: "VIDEO_PLAYING",
    data: {
      timestamp: new Date().toISOString(),
      videoInfo,
    },
  })
}

export default reverseDebounce(timeUpdateListener, 5000)
