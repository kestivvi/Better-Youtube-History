import { createSignalSupabaseSynced } from "./createSignalSupabaseSynced"

export const { calendarIdSignal } = createSignalSupabaseSynced(
  "calendarId",
  null as string | null,
)
