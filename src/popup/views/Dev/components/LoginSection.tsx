import { refreshSession } from "@/shared/auth/session/refreshSession"
import { fetchTokenInfo } from "@/shared/auth/tokens/fetchTokenInfo"
import { refreshProviderToken } from "@/shared/auth/tokens/refreshProviderToken"
import { sessionSignal } from "@/shared/state/auth/session"
import type { SessionType } from "@/shared/state/auth/session/types"
import { providerRefreshTokenSignal } from "@/shared/state/auth/tokens/providerRefreshToken"
import { providerTokenSignal } from "@/shared/state/auth/tokens/providerToken"
import { supabaseSignal } from "@/shared/state/supabase"
import { type Signal, signal, useSignalEffect } from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime"

const secondsTokenExpiresIn = signal(
  sessionSignal.value !== null
    ? Math.floor(sessionSignal.value.expires_at - new Date().getTime() / 1000)
    : "N/A",
)

const updateSecondsTokenExpiresIn = (sessionSignal: Signal<SessionType | null>) => {
  if (!sessionSignal.value) {
    secondsTokenExpiresIn.value = "N/A"
    return
  }

  secondsTokenExpiresIn.value = Math.floor(
    sessionSignal.value?.expires_at - new Date().getTime() / 1000,
  )
}

export default function () {
  useSignals()

  useSignalEffect(() => {
    updateSecondsTokenExpiresIn(sessionSignal)
    const interval = setInterval(() => updateSecondsTokenExpiresIn(sessionSignal), 1000)

    return () => clearInterval(interval)
  })

  return (
    <>
      <p>Token expires in {secondsTokenExpiresIn} seconds</p>

      <button
        type="button"
        onClick={async () => {
          if (!providerTokenSignal.value) {
            console.error("No token to verify")
            return
          }
          const response = await fetchTokenInfo(providerTokenSignal.value)

          if (!response) {
            console.error("No response")
            return
          }

          console.log("Response:", response)

          const json = await response.json()
          console.log("Token Info:", json)
        }}
      >
        Verify current token
      </button>

      <button
        type="button"
        onClick={async () => {
          if (!sessionSignal.value) return

          refreshSession(supabaseSignal.value)
          refreshProviderToken(supabaseSignal.value, providerRefreshTokenSignal.value)
        }}
      >
        Refresh Tokens
      </button>
    </>
  )
}
