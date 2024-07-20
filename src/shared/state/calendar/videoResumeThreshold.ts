import { createSignalSupabaseSynced } from "../signals/SupabaseSignal/createSignalSupabaseSynced"

export const DEFAULT_VIDEO_RESUME_THRESHOLD = 15 * 60 // 15 minutes

export const { videoResumeThresholdSignal } = createSignalSupabaseSynced(
  "videoResumeThreshold",
  DEFAULT_VIDEO_RESUME_THRESHOLD,
)
