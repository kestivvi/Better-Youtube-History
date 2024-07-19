import { VideoInfo } from "@/background/runtime_messages/types"
import getVideoInfoFromMiniPlayer from "./getVideoInfoFromMiniPlayer"
import getVideoInfoFromHiddenJson from "./getVideoInfoFromHiddenJson"

export default function (): Partial<VideoInfo> {
  const videoInfoFromMiniPlayer = getVideoInfoFromMiniPlayer()
  const videoInfoFromScript = getVideoInfoFromHiddenJson()

  return mergeVideoInfoObjectsArray([videoInfoFromMiniPlayer, videoInfoFromScript])
}

function mergeVideoInfoObjectsArray(
  videoInfoObjects: Partial<VideoInfo>[],
): Partial<VideoInfo> {
  let mergedVideoInfo: Partial<VideoInfo> = {}

  for (const videoInfo of videoInfoObjects) {
    for (const [key, value] of Object.entries(videoInfo)) {
      if (value !== undefined) {
        mergedVideoInfo[key as keyof Partial<VideoInfo>] = value
      }
    }
  }

  return mergedVideoInfo
}
