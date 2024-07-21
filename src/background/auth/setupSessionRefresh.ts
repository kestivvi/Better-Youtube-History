import { validateAndRefreshSessionTokens } from "@/shared/auth/validateAndRefreshSessionTokens"
import { sessionSignal } from "@/shared/state/auth/session"
import { sessionExpirationThresholdSecondsSignal } from "@/shared/state/auth/sessionExpirationThreshold"
import { providerRefreshTokenSignal } from "@/shared/state/auth/tokens/providerRefreshToken"
import { providerTokenInfoSignal } from "@/shared/state/auth/tokens/providerTokenInfo"
import { supabaseSignal } from "@/shared/state/supabase"

const ALARM_NAME = "SESSION_REFRESH_ALARM"
const INTERVAL_TO_CHECK_SESSION_AND_REFRESH_TOKENS_MINUTES = 10

export default function () {
  console.debug(`[${ALARM_NAME}] Setting up Session Refresh alarm`)

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
      console.debug(`[${ALARM_NAME}] Alarm triggered`)
      validateAndRefreshSessionTokens(
        sessionSignal.value,
        providerTokenInfoSignal.value,
        providerRefreshTokenSignal.value,
        supabaseSignal.value,
        sessionExpirationThresholdSecondsSignal.value,
      )
    }
  })

  const asyncFn = async () => {
    console.debug(`[${ALARM_NAME}] Creating Session Refresh alarm`)

    const alarm = await chrome.alarms.get(ALARM_NAME)
    if (alarm === undefined) {
      console.debug(`[${ALARM_NAME}] Indeed creating Session Refresh alarm`)
      chrome.alarms.create(ALARM_NAME, {
        periodInMinutes: INTERVAL_TO_CHECK_SESSION_AND_REFRESH_TOKENS_MINUTES,
      })
    }
  }

  asyncFn()
}
