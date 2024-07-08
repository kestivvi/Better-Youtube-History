import { useState, useEffect } from 'react'
import { refreshSession } from '../../background/auth/refreshing/refreshSession'
import { refreshProviderToken } from '../../background/auth/refreshing/refreshProviderToken'
import { sessionSignal, sessionStateSignal } from '@/shared/state/auth/session'
import { supabaseSignal } from '@/shared/state/supabase'

export default function () {
  const loggedIn = sessionStateSignal.value === 'LOGGED_IN'

  const [secondsTokenExpiresIn, setSecondsTokenExpiresIn] = useState<number | null>(null)

  useEffect(() => {
    if (!sessionSignal.value) return

    setSecondsTokenExpiresIn(
      Math.floor(sessionSignal.value?.expires_at - new Date().getTime() / 1000),
    )

    const interval = setInterval(() => {
      if (!sessionSignal.value) return

      setSecondsTokenExpiresIn(
        Math.floor(sessionSignal.value?.expires_at - new Date().getTime() / 1000),
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [sessionSignal.value])

  return (
    <>
      {loggedIn && (
        <>
          <p>Token expires in {secondsTokenExpiresIn} seconds</p>

          <button
            onClick={async () => {
              const { provider_token } = await chrome.storage.local.get('provider_token')

              console.log('Trying to verify provider token...', provider_token)
              const response = await fetch(
                'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + provider_token,
                {
                  method: 'POST',
                },
              )

              const data = await response.json()
              console.log('verify provider token data', data)
            }}
          >
            Verify current token
          </button>

          <button
            onClick={async () => {
              refreshSession(supabaseSignal.value, sessionSignal.value)
              refreshProviderToken(supabaseSignal.value)
            }}
          >
            Refresh Tokens
          </button>
        </>
      )}
    </>
  )
}
