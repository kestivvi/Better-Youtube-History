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

  if (valueFromSupabase !== signal.value) {
    signal.value = valueFromSupabase
  }
}

export const updateSupabase = async <T>(
  variableName: string,
  value: T,
  supabase: SupabaseClient,
  session: SessionType | null,
) => {
  const userId = session?.user.id
  if (!userId) return console.error(`[${variableName}Signal] User is not logged in`)

  const response = await supabase
    .from("user_config")
    .update([{ [variableName]: value }])
    .eq("user_id", userId)

  console.debug(`[${variableName}Signal] Updated value in supabase`, response)
}

const updateSignalValueFromSupabase = <T>(
  payload: { new: Record<string, T> },
  innerSignalObject: Signal<T>,
  variableName: string,
) => {
  const newValue = payload.new[variableName]
  if (newValue !== undefined && newValue !== innerSignalObject.value) {
    innerSignalObject.value = newValue
  }
}

export const setupSupabaseChangeListener = <T>(
  variableName: string,
  signal: Signal<T>,
  supabase: SupabaseClient,
) => {
  supabase
    .channel("userConfigChanged")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "user_config" },
      (payload) => {
        updateSignalValueFromSupabase(payload, signal, variableName)
      },
    )
    .subscribe()
}
