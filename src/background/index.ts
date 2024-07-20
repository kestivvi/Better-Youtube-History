import { validateAndRefreshSessionTokens } from "@/shared/auth/validateAndRefreshSessionTokens"
import { sessionSignal } from "@/shared/state/auth/session"
import { sessionExpirationThresholdSecondsSignal } from "@/shared/state/auth/sessionExpirationThreshold"
import { providerRefreshTokenSignal } from "@/shared/state/auth/tokens/providerRefreshToken"
import { providerTokenInfoSignal } from "@/shared/state/auth/tokens/providerTokenInfo"
import { supabaseSignal } from "@/shared/state/supabase"
import { setupOAuthFlow } from "./auth/oauthFlow/setupOAuthFlow"
import { setupCalendarSync } from "./calendar/setupCalendarSync"
import { setupHandlingRuntimeMessages } from "./runtime_messages/setupHandlingRuntimeMessages"

console.log("background is running")

const INTERVAL_TO_CHECK_SESSION_AND_REFRESH_TOKENS_MINUTES = 10

// Initialize OAuth flow for user authentication.
// This includes adding a tab listener when the background script is activated.
setupOAuthFlow()
setupHandlingRuntimeMessages()
setupCalendarSync()

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
