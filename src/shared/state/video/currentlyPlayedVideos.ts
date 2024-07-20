import type { VideoEventDocType } from "@/background/database/collections/VideoEvent/schema"
import { createSignal } from "../signals/StandardSignal/createSignal"

export type CurrentlyPlayedVideoType = VideoEventDocType

export const DEFAULT_CURRENTLY_PLAYED_VIDEOS: CurrentlyPlayedVideoType[] = []

export const { currentlyPlayedVideosSignal } = createSignal(
  "currentlyPlayedVideos",
  DEFAULT_CURRENTLY_PLAYED_VIDEOS,
)
