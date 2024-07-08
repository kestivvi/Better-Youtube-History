import { supabaseSignal } from '../../supabase'
import { setupSessionAndTokens } from '@/shared/auth/setupSessionAndTokens'
import { providerRefreshTokenSignal } from '../tokens/providerRefreshToken'
import { sessionExpirationThresholdSecondsSignal } from '../sessionExpirationThreshold'
import { createSignal } from '../../createSignal'
import { SessionType, SessionStateType } from './types'
import { providerTokenInfoSignal } from '../tokens/providerTokenInfo'
import { effect } from '@preact/signals-react'

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

effect(() => {
  if (sessionSignal && sessionSignal.value) {
    supabaseSignal.value.auth.setSession(sessionSignal.value)
  }
})

export { sessionSignal, sessionStateSignal }
