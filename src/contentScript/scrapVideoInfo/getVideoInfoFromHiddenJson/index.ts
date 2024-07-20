import type { VideoInfo } from "@/background/runtime_messages/types"

export default function (): Partial<VideoInfo> {
  const videoInfoScript =
    document.querySelector("#microformat > player-microformat-renderer > script")
      ?.innerHTML ?? "{}"
  const parsedVideoInfo = JSON.parse(videoInfoScript)

  const videoId =
    parsedVideoInfo.embedUrl.split("/").pop()?.split("?").shift() ?? undefined

  const channelIdentifier =
    document.querySelector("#text > a")?.getAttribute("href") ?? undefined
  const channelUrl = channelIdentifier
    ? `https://www.youtube.com${channelIdentifier}`
    : undefined

  return {
    videoId: videoId as string | undefined,
    title: parsedVideoInfo.name as string | undefined,
    channelName: parsedVideoInfo.author as string | undefined,
    channelUrl: channelUrl,
  }
}
