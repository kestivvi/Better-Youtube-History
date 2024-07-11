import { createSignal } from '../createSignal'

export const DEFAULT_MIN_VIDEO_WATCH_DURATION = 5 * 60 // 5 minutes

export const { minVideoWatchDurationSignal } = createSignal(
  'minVideoWatchDuration',
  DEFAULT_MIN_VIDEO_WATCH_DURATION,
)
