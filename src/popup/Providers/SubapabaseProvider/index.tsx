import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createContext, ReactNode, useContext } from 'react'
import secrets from '../../../secrets'

const supabase = createClient(secrets.supabase.url, secrets.supabase.key)

const SupabaseContext = createContext<SupabaseClient>(supabase)

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  return context
}

type Props = {
  children: ReactNode
}

export default function ({ children }: Props) {
  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
}
