import { sessionSignal } from "../../auth/session"
import { supabaseSignal } from "../../supabase"
import { createSignal } from "../StandardSignal/createSignal"
import type { ReturnedSignalObj } from "../StandardSignal/types"
import {
  callbackAfterInitFromStorage,
  setupSupabaseChangeListener,
  updateSupabase,
} from "./handlers"

export function createSignalSupabaseSynced<T, K extends string>(
  variableName: K,
  initialValue: T,
): ReturnedSignalObj<T, K> {
  const signalObject = createSignal(variableName, initialValue, {
    callbackAfterInitFromStorage: async (signal) => {
      callbackAfterInitFromStorage(signal, variableName, supabaseSignal.value)
    },
  })

  const innerSignalObject = signalObject[`${variableName}Signal`]

  // Update the calendar ID in the supabase database whenever the signal's value changes
  innerSignalObject.subscribe(async (value) => {
    updateSupabase(variableName, value, supabaseSignal.value, sessionSignal.value)
  })

  // Listen for changes to the value in the supabase database
  setupSupabaseChangeListener(variableName, innerSignalObject, supabaseSignal.value)

  return signalObject
}
