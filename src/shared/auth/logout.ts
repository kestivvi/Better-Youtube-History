import { clearState } from '../state/clearState'
import { supabaseSignal } from '../state/supabase'

export async function logout() {
  const { error } = await supabaseSignal.value.auth.signOut()

  if (error) {
    console.error('signOut error', error)
    return
  }

  clearState()
}
