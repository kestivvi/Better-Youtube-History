import { setupOAuthFlow } from './auth/oauthFlow/setupOAuthFlow'
import { setupHandlingRuntimeMessages } from './runtime_messages/setupHandlingRuntimeMessages'
import { checkForEventsToAdd } from './googleCalendar/checkForEventsToAdd'
import { database } from './database'
import { supabaseSignal } from '@/shared/state/supabase'
import { validateAndRefreshSessionTokens } from '@/shared/auth/validateAndRefreshSessionTokens'
import { sessionSignal } from '@/shared/state/auth/session'
import { providerTokenInfoSignal } from '@/shared/state/auth/tokens/providerTokenInfo'
import { providerRefreshTokenSignal } from '@/shared/state/auth/tokens/providerRefreshToken'
import { sessionExpirationThresholdSecondsSignal } from '@/shared/state/auth/sessionExpirationThreshold'

console.log('background is running')

const GOOGLE_CALENDAR_SYNC_INTERVAL_MINUTES = 1
const GOOGLE_CALENDAR_EVENT_PREFIX = '📺 '
const INTERVAL_TO_CHECK_SESSION_AND_REFRESH_TOKENS_MINUTES = 10

// Initialize OAuth flow for user authentication.
// This includes adding a tab listener when the background script is activated.
setupOAuthFlow()
setupHandlingRuntimeMessages()

const calendarIntervalFn = () => checkForEventsToAdd(database, GOOGLE_CALENDAR_EVENT_PREFIX)

setTimeout(() => calendarIntervalFn(), 1000)
setInterval(async () => calendarIntervalFn(), GOOGLE_CALENDAR_SYNC_INTERVAL_MINUTES * 60 * 1000)

const sessionIntervalFn = () =>
  validateAndRefreshSessionTokens(
    sessionSignal.value,
    providerTokenInfoSignal.value,
    providerRefreshTokenSignal.value,
    supabaseSignal.value,
    sessionExpirationThresholdSecondsSignal.value,
  )

sessionIntervalFn()
setInterval(
  async () => sessionIntervalFn(),
  INTERVAL_TO_CHECK_SESSION_AND_REFRESH_TOKENS_MINUTES * 60 * 1000,
)
