import type { VideoInfo } from "@/background/runtime_messages/types"

const CHANNEL_IDENTIFIER_SELECTOR1 = "#owner a"
const CHANNEL_IDENTIFIER_SELECTOR2 = "#text > a"
const YOUTUBE_BASE_URL = "https://www.youtube.com"

export default function scrapChannelUrl(): Partial<VideoInfo> {
  // This returns string like "/@john-doe"
  const channelIdentifier =
    document.querySelector(CHANNEL_IDENTIFIER_SELECTOR1)?.getAttribute("href") ||
    document.querySelector(CHANNEL_IDENTIFIER_SELECTOR2)?.getAttribute("href")

  // If we can't find the channel identifier, we return an empty object
  if (!channelIdentifier) return {}

  // Now we transform it to a full URL
  const channelUrl = `${YOUTUBE_BASE_URL}${channelIdentifier}`

  return { channelUrl }
}
