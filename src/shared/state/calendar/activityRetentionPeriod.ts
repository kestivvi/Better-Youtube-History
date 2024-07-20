import { createSignalSupabaseSynced } from "../signals/SupabaseSignal/createSignalSupabaseSynced"

export const DEFAULT_ACTIVITY_RETENTION_PERIOD = 60 * 60 * 24 * 7 // 7 days

export const { activityRetentionPeriodSignal } = createSignalSupabaseSynced(
  "activityRetentionPeriod",
  DEFAULT_ACTIVITY_RETENTION_PERIOD,
)
