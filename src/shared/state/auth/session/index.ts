import { setupSessionAndTokens } from "@/shared/auth/setupSessionAndTokens"
import { effect } from "@preact/signals-react"
import { createSignal } from "../../signals/StandardSignal/createSignal"
import { supabaseSignal } from "../../supabase"
import { sessionExpirationThresholdSecondsSignal } from "../sessionExpirationThreshold"
import { providerRefreshTokenSignal } from "../tokens/providerRefreshToken"
import { providerTokenInfoSignal } from "../tokens/providerTokenInfo"
import type { SessionStateType, SessionType } from "./types"

export const DEFAULT_SESSION_STATE: SessionStateType = "NOT_LOGGED_IN"

const { sessionStateSignal } = createSignal(
  "sessionState",
  DEFAULT_SESSION_STATE as SessionStateType,
)

const { sessionSignal } = createSignal("session", null as SessionType | null, {
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
  if (sessionSignal?.value) {
    supabaseSignal.value.auth.setSession(sessionSignal.value)
  }
})

export { sessionSignal, sessionStateSignal }
