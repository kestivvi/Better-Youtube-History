import type { Signal } from "@preact/signals-react"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { SessionType } from "../../auth/session/types"

export const callbackAfterInitFromStorage = async <T>(
  signal: Signal<T>,
  variableName: string,
  supabase: SupabaseClient,
) => {
  const queryResponse = await supabase.from("user_config").select(variableName)
  const firstItem = queryResponse.data?.[0]

  // @ts-expect-error
  const valueFromSupabase = variableName in firstItem ? firstItem[variableName] : null

  if (valueFromSupabase === signal.value) {
    console.debug(
      `[${variableName}Signal] Value in supabase is already up-to-date. Skipping update.`,
    )
    return
  }

  signal.value = valueFromSupabase
  console.debug(
    `[${variableName}Signal] Updated signal based on value from supabase, new value:`,
    signal.value,
  )
}

export const updateSupabase = async <T>(
  variableName: string,
  value: T,
  supabase: SupabaseClient,
  session: SessionType | null,
) => {
  const userId = session?.user.id
  if (!userId) return console.error(`[${variableName}Signal] User is not logged in`)

  const queryResponse = await supabase
    .from("user_config")
    .select(variableName)
    .eq("user_id", userId)

  const firstItem = queryResponse.data?.[0]

  // @ts-expect-error
  const valueFromSupabase = variableName in firstItem ? firstItem[variableName] : null

  if (valueFromSupabase === value) {
    console.debug(
      `[${variableName}Signal] Value in supabase is already up-to-date. Skipping update.`,
    )
    return
  }

  const updateResponse = await supabase
    .from("user_config")
    .update([{ [variableName]: value }])
    .eq("user_id", userId)

  console.debug(
    `[${variableName}Signal] Updated value in supabase. New value:`,
    value,
    "response:",
    updateResponse,
  )
}

const updateSignalValueFromSupabase = <T>(
  payload: { new: Record<string, T> },
  innerSignalObject: Signal<T>,
  variableName: string,
) => {
  const newValue = payload.new[variableName]

  if (newValue === undefined) {
    console.error(
      `[${variableName}Signal] Value in supabase is missing. Skipping update.`,
    )
    return
  }

  if (newValue === innerSignalObject.value) {
    console.debug(
      `[${variableName}Signal] Value in supabase is already up-to-date. Skipping update.`,
    )
    return
  }

  innerSignalObject.value = newValue
  console.debug(
    `[${variableName}Signal] Updated signal based on value from supabase, new value:`,
    newValue,
  )
}

export const setupSupabaseChangeListener = <T>(
  variableName: string,
  signal: Signal<T>,
  supabase: SupabaseClient,
) => {
  let timeout: NodeJS.Timeout | null = null

  supabase
    .channel("userConfigChanged")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "user_config" },
      (payload) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
          updateSignalValueFromSupabase(payload, signal, variableName)
        }, 1000)
      },
    )
    .subscribe()
}
