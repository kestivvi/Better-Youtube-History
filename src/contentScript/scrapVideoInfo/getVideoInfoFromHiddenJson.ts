import type { VideoInfo } from "@/background/runtime_messages/types"

const MICROFORMAT_SCRIPT_SELECTOR = "#microformat > player-microformat-renderer > script"

// Function to get the video info script content from the DOM
function getVideoInfoScript(): string {
  const scriptElement = document.querySelector(MICROFORMAT_SCRIPT_SELECTOR)
  return scriptElement?.innerHTML ?? "{}"
}

// Extracts the video ID from a YouTube embed URL.
// Example input: "https://www.youtube.com/embed/doFowk4xj7Q?enablejsapi=1"
// Example output: "doFowk4xj7Q"
function extractVideoId(embedUrl: string): string | undefined {
  return embedUrl.split("/").pop()?.split("?").shift() ?? undefined
}

// This function scrapes video information from the hidden JSON in the DOM
export default function getVideoInfoFromHiddenJson(): Partial<VideoInfo> {
  const videoInfoScript = getVideoInfoScript()
  const parsedVideoInfo = JSON.parse(videoInfoScript)

  return {
    videoId: extractVideoId(parsedVideoInfo.embedUrl),
    title: parsedVideoInfo.name,
    channelName: parsedVideoInfo.author,
  }
}
