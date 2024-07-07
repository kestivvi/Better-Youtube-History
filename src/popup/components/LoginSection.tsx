import { useState, useEffect } from 'react'
import { refreshSession } from '../../background/auth/refreshing/refreshSession'
import { refreshProviderToken } from '../../background/auth/refreshing/refreshProviderToken'
import { useSupabase } from '../Providers/SubapabaseProvider'
import { useSession } from '../Providers/SessionProvider/SessionContext'

export default function () {
  const supabase = useSupabase()
  const { session } = useSession()

  const loggedIn = session !== null

  const [secondsTokenExpiresIn, setSecondsTokenExpiresIn] = useState<number | null>(null)

  useEffect(() => {
    if (!session) {
      return
    }
    setSecondsTokenExpiresIn(Math.floor(session?.expires_at - new Date().getTime() / 1000))

    const interval = setInterval(() => {
      setSecondsTokenExpiresIn(Math.floor(session?.expires_at - new Date().getTime() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [session])

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
              refreshSession(supabase, session)
              refreshProviderToken(supabase)
            }}
          >
            Refresh Tokens
          </button>
        </>
      )}
    </>
  )
}
