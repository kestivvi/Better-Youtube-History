import { createSignalSupabaseSynced } from "../createSignalSupabaseSynced"

export const DEFAULT_MIN_VIDEO_WATCH_DURATION = 5 * 60 // 5 minutes

export const { minVideoWatchDurationSignal } = createSignalSupabaseSynced(
  "minVideoWatchDuration",
  DEFAULT_MIN_VIDEO_WATCH_DURATION,
)
