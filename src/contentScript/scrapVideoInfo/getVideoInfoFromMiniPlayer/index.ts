import type { VideoInfo } from "@/background/runtime_messages/types"
import extractVideoIdFromStyle from "./extractVideoIdFromStyle"

// Selectors to scrape video information from the mini player
const VIDEO_ID_SELECTOR = ".miniplayer .ytp-tooltip-bg"
const TITLE_SELECTOR_1 = ".miniplayer #info-bar .title"
const TITLE_SELECTOR_2 = '.miniplayer .title[role="heading"]'
const CHANNEL_NAME_SELECTOR_1 = ".miniplayer .ytp-ce-channel-title"
const CHANNEL_NAME_SELECTOR_2 = ".miniplayer #owner-name"
const CHANNEL_URL_SELECTOR = ".miniplayer .ytp-ce-channel-title"

// Functions to scrape video information from the mini player
function getVideoId(): string | undefined {
  const styleWithVideoId = document
    .querySelector(VIDEO_ID_SELECTOR)
    ?.getAttribute("style")
  if (!styleWithVideoId) return undefined
  return extractVideoIdFromStyle(styleWithVideoId)
}

function getTitle(): string | undefined {
  return (
    document.querySelector(TITLE_SELECTOR_1)?.getAttribute("aria-label") ||
    document.querySelector(TITLE_SELECTOR_2)?.getAttribute("aria-label") ||
    undefined
  )
}

function getChannelName(): string | undefined {
  return (
    document.querySelector(CHANNEL_NAME_SELECTOR_1)?.textContent ||
    document.querySelector(CHANNEL_NAME_SELECTOR_2)?.textContent ||
    undefined
  )
}

function getChannelUrl(): string | undefined {
  return document.querySelector(CHANNEL_URL_SELECTOR)?.getAttribute("href") || undefined
}

// This function aggregates scraped video information from the mini player
export default function getVideoInfoFromMiniPlayer(): Partial<VideoInfo> {
  return {
    videoId: getVideoId(),
    title: getTitle(),
    channelName: getChannelName(),
    channelUrl: getChannelUrl(),
  }
}
