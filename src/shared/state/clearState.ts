import { sessionSignal, sessionStateSignal } from './auth/session'
import {
  DEFAULT_SESSION_EXPIRATION_THRESHOLD_SECONDS,
  sessionExpirationThresholdSecondsSignal,
} from './auth/sessionExpirationThreshold'
import { providerRefreshTokenSignal } from './auth/tokens/providerRefreshToken'
import { providerTokenSignal } from './auth/tokens/providerToken'
import { providerTokenInfoSignal } from './auth/tokens/providerTokenInfo'
import { calendarIdSignal } from './calendarId'

export function clearState() {
  // There is no supabaseSignal cleared
  calendarIdSignal.value = null
  sessionExpirationThresholdSecondsSignal.value = DEFAULT_SESSION_EXPIRATION_THRESHOLD_SECONDS
  providerTokenSignal.value = null
  providerRefreshTokenSignal.value = null
  providerTokenInfoSignal.value = null
  sessionSignal.value = null
  sessionStateSignal.value = 'NOT_LOGGED_IN'
}
