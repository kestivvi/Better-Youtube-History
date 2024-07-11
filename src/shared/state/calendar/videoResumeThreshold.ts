import { createSignal } from '../createSignal'

export const DEFAULT_VIDEO_RESUME_THRESHOLD = 15 * 60 // 15 minutes

export const { videoResumeThresholdSignal } = createSignal(
  'videoResumeThreshold',
  DEFAULT_VIDEO_RESUME_THRESHOLD,
)
