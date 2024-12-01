import type { VideoInfo } from "@/background/runtime_messages/types"

const SELECTORS = {
  miniPlayer: {
    videoId: ".miniplayer .ytp-tooltip-bg",
    title1: ".miniplayer #info-bar .title",
    title2: '.miniplayer .title[role="heading"]',
    channelName1: ".miniplayer .ytp-ce-channel-title",
    channelName2: ".miniplayer #owner-name",
    channelUrl: ".miniplayer .ytp-ce-channel-title",
  },
  channel: {
    identifier1: "#owner a",
    identifier2: "#text > a",
  },
  hiddenJson: "#microformat > player-microformat-renderer > script",
} as const

const scrapFromMiniPlayer = (info: Partial<VideoInfo>): Partial<VideoInfo> => {
  // Extract video ID from style attribute
  const videoIdElement = document.querySelector(SELECTORS.miniPlayer.videoId)
  const styleWithVideoId = videoIdElement?.getAttribute("style")
  const extractedVideoId = styleWithVideoId
    ? styleWithVideoId.match(/https:\/\/i\.ytimg\.com\/sb\/([a-zA-Z0-9_-]+)\//)?.[1]
    : undefined

  // Extract title from either of two possible elements
  const titleElement1 = document.querySelector(SELECTORS.miniPlayer.title1)
  const titleElement2 = document.querySelector(SELECTORS.miniPlayer.title2)
  const extractedTitle =
    titleElement1?.getAttribute("aria-label") ??
    titleElement2?.getAttribute("aria-label") ??
    undefined

  // Extract channel name from either of two possible elements
  const channelNameElement1 = document.querySelector(SELECTORS.miniPlayer.channelName1)
  const channelNameElement2 = document.querySelector(SELECTORS.miniPlayer.channelName2)
  const extractedChannelName =
    channelNameElement1?.textContent ?? channelNameElement2?.textContent ?? undefined

  // Extract channel URL
  const channelUrlElement = document.querySelector(SELECTORS.miniPlayer.channelUrl)
  const extractedChannelUrl = channelUrlElement?.getAttribute("href") ?? undefined

  return {
    ...info,
    videoId: info.videoId || extractedVideoId,
    title: info.title || extractedTitle,
    channelName: info.channelName || extractedChannelName,
    channelUrl: info.channelUrl || extractedChannelUrl,
  }
}

const scrapFromHiddenJson = (info: Partial<VideoInfo>): Partial<VideoInfo> => {
  try {
    const scriptElement = document.querySelector(SELECTORS.hiddenJson)
    const parsedInfo = JSON.parse(scriptElement?.innerHTML || "{}")

    return {
      ...info,
      videoId:
        info.videoId || parsedInfo.embedUrl?.split("/")?.pop()?.split("?")?.shift(),
      title: info.title || (parsedInfo.name ?? undefined),
      channelName: info.channelName || (parsedInfo.author ?? undefined),
      description: info.description || (parsedInfo.description ?? undefined),
    }
  } catch (error) {
    console.debug("Failed to parse hidden JSON:", error)
    return info
  }
}

const scrapChannelUrl = (info: Partial<VideoInfo>): Partial<VideoInfo> => {
  const channelIdentifier =
    document.querySelector(SELECTORS.channel.identifier1)?.getAttribute("href") ??
    document.querySelector(SELECTORS.channel.identifier2)?.getAttribute("href")

  if (!channelIdentifier) return info

  return {
    ...info,
    channelUrl: info.channelUrl || `https://www.youtube.com${channelIdentifier}`,
  }
}

export default function scrapVideoInfo(): VideoInfo {
  const info = [scrapFromMiniPlayer, scrapFromHiddenJson, scrapChannelUrl].reduce(
    (acc, step) => step(acc),
    {} as Partial<VideoInfo>,
  )

  const missingProperties = [
    info.videoId ? null : "videoId",
    info.title ? null : "title",
    info.channelName ? null : "channelName",
    info.channelUrl ? null : "channelUrl",
    info.description ? null : "description",
  ].filter(Boolean)

  if (missingProperties.length > 0) {
    throw new Error(
      `Failed to scrape complete video info. Missing properties: ${missingProperties.join(", ")}`,
    )
  }

  return info as VideoInfo
}
