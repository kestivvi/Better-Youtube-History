import { VideoInfo } from "@/background/runtime_messages/types"
import extractVideoIdFromStyle from "./extractVideoIdFromStyle"

export default function (): Partial<VideoInfo> {
  const stringWithVideoId =
    document.querySelector(".miniplayer .ytp-tooltip-bg")?.getAttribute("style") ??
    undefined

  const videoId = stringWithVideoId
    ? extractVideoIdFromStyle(stringWithVideoId)
    : undefined

  const title =
    document.querySelector(".miniplayer #info-bar .title")?.getAttribute("aria-label") ??
    document
      .querySelector('.miniplayer .title[role="heading"]')
      ?.getAttribute("aria-label") ??
    undefined

  let channelName =
    document.querySelector(".miniplayer .ytp-ce-channel-title")?.textContent ??
    document.querySelector(".miniplayer #owner-name")?.textContent ??
    undefined

  if (channelName === "") channelName = undefined

  const channelUrl =
    document.querySelector(".miniplayer .ytp-ce-channel-title")?.getAttribute("href") ??
    undefined

  return {
    videoId,
    title,
    channelName,
    channelUrl,
  }
}
