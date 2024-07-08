import { supabaseSignal } from '../../supabase'
import { setupSessionAndTokens } from '@/shared/auth/setupSessionAndTokens'
import { providerRefreshTokenSignal } from '../tokens/providerRefreshToken'
import { sessionExpirationThresholdSecondsSignal } from '../sessionExpirationThreshold'
import { createSignal } from '../../createSignal'
import { SessionType, SessionStateType } from './types'
import { providerTokenInfoSignal } from '../tokens/providerTokenInfo'

const { sessionStateSignal } = createSignal('sessionState', 'LOADING' as SessionStateType)

const { sessionSignal } = createSignal('session', null as SessionType | null, {
  useChromeLocalStorage: true,
  callbackAfterInitFromStorage: () => {
    setupSessionAndTokens(
      sessionSignal.value,
      providerTokenInfoSignal.value,
      providerRefreshTokenSignal.value,
      supabaseSignal.value,
      sessionExpirationThresholdSecondsSignal.value,
    )
  },
})

export { sessionSignal, sessionStateSignal }
