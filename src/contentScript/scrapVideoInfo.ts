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
  const styleWithVideoId = document
    .querySelector(SELECTORS.miniPlayer.videoId)
    ?.getAttribute("style")

  return {
    ...info,
    videoId:
      info.videoId ||
      (styleWithVideoId
        ? styleWithVideoId.match(/https:\/\/i\.ytimg\.com\/sb\/([a-zA-Z0-9_-]+)\//)?.[1]
        : undefined),
    title:
      info.title ||
      (document.querySelector(SELECTORS.miniPlayer.title1)?.getAttribute("aria-label") ??
        document.querySelector(SELECTORS.miniPlayer.title2)?.getAttribute("aria-label") ??
        undefined),
    channelName:
      info.channelName ||
      (document.querySelector(SELECTORS.miniPlayer.channelName1)?.textContent ??
        document.querySelector(SELECTORS.miniPlayer.channelName2)?.textContent ??
        undefined),
    channelUrl:
      info.channelUrl ||
      (document.querySelector(SELECTORS.miniPlayer.channelUrl)?.getAttribute("href") ??
        undefined),
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
  ].filter(Boolean)

  if (missingProperties.length > 0) {
    throw new Error(
      `Failed to scrape complete video info. Missing properties: ${missingProperties.join(", ")}`,
    )
  }

  return {
    videoId: info.videoId,
    title: info.title,
    channelName: info.channelName,
    channelUrl: info.channelUrl,
  } as VideoInfo
}
