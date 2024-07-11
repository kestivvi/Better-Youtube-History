import { createSignal } from '../createSignal'

export const DEFAULT_ACTIVITY_RETENTION_PERIOD = 60 * 60 * 24 * 7 // 7 days

export const { activityRetentionPeriodSignal } = createSignal(
  'activityRetentionPeriod',
  DEFAULT_ACTIVITY_RETENTION_PERIOD,
)
