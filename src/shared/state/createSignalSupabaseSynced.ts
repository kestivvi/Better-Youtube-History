import { createSignal, ReturnedSignalObj } from "./createSignal"
import { supabaseSignal } from "./supabase"
import { sessionSignal } from "./auth/session"

export function createSignalSupabaseSynced<T, K extends string>(
  variableName: K,
  initialValue: T,
): ReturnedSignalObj<T, K> {
  const signalObject = createSignal(variableName, initialValue, {
    callbackAfterInitFromStorage: async (signal) => {
      const queryResponse = await supabaseSignal.value
        .from("user_config")
        .select(variableName)
      const firstItem = queryResponse.data?.[0]
      // @ts-expect-error
      const valueFromSupabase = variableName in firstItem ? firstItem[variableName] : null

      if (valueFromSupabase !== signal.value) {
        signal.value = valueFromSupabase
      }
    },
  })

  const innerSignalObject = signalObject[`${variableName}Signal`]

  // Update the calendar ID in the supabase database whenever the signal's value changes
  innerSignalObject.subscribe(async (value) => {
    const userId = sessionSignal.value?.user.id
    if (!userId) return console.error(`[${variableName}Signal] User is not logged in`)

    const response = await supabaseSignal.value
      .from("user_config")
      .update([{ [variableName]: value }])
      .eq("user_id", userId)

    console.debug(`[${variableName}Signal] Updated value in supabase`, response)
  })

  // Listen for changes to the value in the supabase database
  supabaseSignal.value
    .channel("userConfigChanged")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "user_config" },
      (payload) => {
        if (!(variableName in payload.new)) return
        // @ts-expect-error
        if (payload.new[variableName] === innerSignalObject.value) return

        // @ts-expect-error
        if (innerSignalObject.value !== payload.new[variableName]) {
          // @ts-expect-error
          innerSignalObject.value = payload.new[variableName]
        }
      },
    )
    .subscribe()

  return signalObject
}
