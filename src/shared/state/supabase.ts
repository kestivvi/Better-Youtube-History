import { createClient } from "@supabase/supabase-js"
import { createSignal } from "./createSignal"
import secrets from "../../secrets"

const supabase = createClient(secrets.supabase.url, secrets.supabase.key)

export const { supabaseSignal } = createSignal("supabase", supabase, {
  useChromeLocalStorage: false,
})
