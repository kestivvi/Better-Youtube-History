import { SupabaseClient } from '@supabase/supabase-js'
import { sessionStateSignal } from '../state/auth/session'
import { validateAndRefreshSessionTokens } from './validateAndRefreshSessionTokens'
import { SessionType } from '../state/auth/session/types'
import { ProviderTokenInfo } from '../state/auth/tokens/providerTokenInfo'

export async function setupSessionAndTokens(
  session: SessionType | null,
  providerTokenInfo: ProviderTokenInfo | null,
  providerRefreshToken: string | null,
  supabase: SupabaseClient,
  secondsIntoFuture: number = 60 * 10,
) {
  console.debug('[setupSessionAndTokens] Setting up session and tokens...')
  console.debug('[setupSessionAndTokens] Session:', session)
  console.debug('[setupSessionAndTokens] Provider token:', providerTokenInfo)
  console.debug('[setupSessionAndTokens] Provider refresh token:', providerRefreshToken)

  if (session === null) {
    console.debug(
      '[setupSessionAndTokens] No session found. Setting session state to NOT_LOGGED_IN.',
    )
    sessionStateSignal.value = 'NOT_LOGGED_IN'
    return
  }

  validateAndRefreshSessionTokens(
    session,
    providerTokenInfo,
    providerRefreshToken,
    supabase,
    secondsIntoFuture,
  )
}
