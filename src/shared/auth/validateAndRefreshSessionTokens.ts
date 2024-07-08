import { SupabaseClient } from '@supabase/supabase-js'
import { willSessionBeValid } from './session/willSessionBeValid'
import { willProviderTokenBeValid } from './tokens/willProviderTokenBeValid'
import { refreshSession } from './session/refreshSession'
import { refreshProviderToken } from './tokens/refreshProviderToken'
import { SessionType } from '../state/auth/session/types'
import { sessionStateSignal } from '../state/auth/session'
import { ProviderTokenInfo } from '../state/auth/tokens/providerTokenInfo'

export async function validateAndRefreshSessionTokens(
  session: SessionType,
  providerTokenInfo: ProviderTokenInfo | null,
  providerRefreshToken: string | null,
  supabase: SupabaseClient,
  secondsIntoFuture: number = 60,
) {
  const isSessionValid = willSessionBeValid(session, secondsIntoFuture)
  console.debug('[validateAndRefreshSessionTokens] isSessionValid:', isSessionValid)

  const isProviderTokenValid = await willProviderTokenBeValid(providerTokenInfo, secondsIntoFuture)
  console.debug('[validateAndRefreshSessionTokens] isProviderTokenValid:', isProviderTokenValid)

  if (isSessionValid && isProviderTokenValid) {
    sessionStateSignal.value = 'LOGGED_IN'
  }

  if (!isSessionValid || !isProviderTokenValid) {
    await refreshSession(supabase, session)
    await refreshProviderToken(supabase, providerRefreshToken)
  }
}
