import { validateAndRefreshSessionTokens } from "@/shared/auth/validateAndRefreshSessionTokens"
import { sessionSignal } from "@/shared/state/auth/session"
import { sessionExpirationThresholdSecondsSignal } from "@/shared/state/auth/sessionExpirationThreshold"
import { providerRefreshTokenSignal } from "@/shared/state/auth/tokens/providerRefreshToken"
import { providerTokenInfoSignal } from "@/shared/state/auth/tokens/providerTokenInfo"
import { supabaseSignal } from "@/shared/state/supabase"
import { effect } from "@preact/signals-react"

const ALARM_NAME = "SESSION_REFRESH_ALARM"
const INTERVAL_TO_CHECK_SESSION_AND_REFRESH_TOKENS_MINUTES = 10

function handleSessionRefreshAlarm(alarm: chrome.alarms.Alarm) {
  if (alarm.name !== ALARM_NAME) return

  validateAndRefreshSessionTokens(
    sessionSignal.value,
    providerTokenInfoSignal.value,
    providerRefreshTokenSignal.value,
    supabaseSignal.value,
    sessionExpirationThresholdSecondsSignal.value,
  )
}

async function createSessionRefreshAlarm() {
  const existingAlarm = await chrome.alarms.get(ALARM_NAME)
  if (existingAlarm) return

  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: INTERVAL_TO_CHECK_SESSION_AND_REFRESH_TOKENS_MINUTES,
  })
}

export default function setupSessionRefresh() {
  chrome.alarms.onAlarm.addListener(handleSessionRefreshAlarm)

  // Signal effect is not actually needed here
  // but maybe in the future interval can be signal
  effect(() => {
    createSessionRefreshAlarm()
    return () => chrome.alarms.clear(ALARM_NAME)
  })
}
