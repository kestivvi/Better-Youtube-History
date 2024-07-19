import { useEffect } from "react"
import { sessionSignal } from "@/shared/state/auth/session"
import { supabaseSignal } from "@/shared/state/supabase"
import { refreshSession } from "@/shared/auth/session/refreshSession"
import { refreshProviderToken } from "@/shared/auth/tokens/refreshProviderToken"
import { providerRefreshTokenSignal } from "@/shared/state/auth/tokens/providerRefreshToken"
import { fetchTokenInfo } from "@/shared/auth/tokens/fetchTokenInfo"
import { providerTokenSignal } from "@/shared/state/auth/tokens/providerToken"
import { Signal, signal } from "@preact/signals-react"
import { SessionType } from "@/shared/state/auth/session/types"

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
  useEffect(() => {
    updateSecondsTokenExpiresIn(sessionSignal)
    const interval = setInterval(() => updateSecondsTokenExpiresIn(sessionSignal), 1000)

    return () => clearInterval(interval)
  }, [sessionSignal.value])

  return (
    <>
      <p>Token expires in {secondsTokenExpiresIn} seconds</p>

      <button
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
        onClick={async () => {
          if (!sessionSignal.value) return

          refreshSession(supabaseSignal.value, sessionSignal.value)
          refreshProviderToken(supabaseSignal.value, providerRefreshTokenSignal.value)
        }}
      >
        Refresh Tokens
      </button>
    </>
  )
}
