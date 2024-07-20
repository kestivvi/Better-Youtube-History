import { createClient } from "@supabase/supabase-js"
import secrets from "../../secrets"
import { createSignal } from "./signals/StandardSignal/createSignal"

const supabase = createClient(secrets.supabase.url, secrets.supabase.key)

export const { supabaseSignal } = createSignal("supabase", supabase, {
  useChromeLocalStorage: false,
})
