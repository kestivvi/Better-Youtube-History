import { createSignalSupabaseSynced } from "./signals/SupabaseSignal/createSignalSupabaseSynced"

export const { calendarIdSignal } = createSignalSupabaseSynced(
  "calendarId",
  null as string | null,
)
