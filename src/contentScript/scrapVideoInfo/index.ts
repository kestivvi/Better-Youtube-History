import type { VideoInfo } from "@/background/runtime_messages/types"
import { merge } from "ts-deepmerge"
import getVideoInfoFromHiddenJson from "./getVideoInfoFromHiddenJson"
import getVideoInfoFromMiniPlayer from "./getVideoInfoFromMiniPlayer"
import scrapChannelUrl from "./scrapChannelUrl"

// This function merges multiple video info objects into a single object
// making sure not to override any existing values with undefined
function mergeVideoInfos(videoInfos: Partial<VideoInfo>[]): Partial<VideoInfo> {
  const mergeOptions = { allowUndefinedOverrides: false }
  return merge.withOptions(mergeOptions, ...videoInfos)
}

// This function is used to scrape video information from 3 different sources
// and merge them into a single object
export default function scrapVideoInfo(): Partial<VideoInfo> {
  const videoInfoFromMiniPlayer = getVideoInfoFromMiniPlayer()
  const videoInfoFromScript = getVideoInfoFromHiddenJson()
  const objWithChannelUrl = scrapChannelUrl()

  return mergeVideoInfos([
    videoInfoFromMiniPlayer,
    videoInfoFromScript,
    objWithChannelUrl,
  ])
}
