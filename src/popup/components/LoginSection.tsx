import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import secrets from '../../secrets'

const manifest = chrome.runtime.getManifest()
const supabase = createClient(secrets.supabase.url, secrets.supabase.key)

export default function () {
  const [session, setSession] = useState<any>(null)
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

  useEffect(() => {
    ;(async () => {
      const { session } = await chrome.storage.local.get('session')
      console.log('tried to get session', new Date().toISOString(), session)
      if (session) {
        const { error: supaAuthError } = await supabase.auth.setSession(session)
        if (supaAuthError) {
          throw supaAuthError
        }
        setSession(session)
      }
    })()
  }, [])

  return (
    <>
      {!loggedIn && (
        <button
          onClick={() => {
            loginWithGoogle()
          }}
        >
          Login
        </button>
      )}

      {loggedIn && (
        <>
          <p>Logged in as {session.user.email}</p>
          <p>Token expires in {secondsTokenExpiresIn} seconds</p>
          <button
            onClick={async () => {
              const { error } = await supabase.auth.signOut()
              if (error) {
                console.error('signOut error', error)
                return
              }
              chrome.storage.local.remove('session')
              chrome.storage.local.remove('provider_token')
              setSession(null)
            }}
            style={{
              marginRight: '10px',
            }}
          >
            Logout
          </button>

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
        </>
      )}
    </>
  )
}

/**
 * Method used to login with google provider.
 */
export async function loginWithGoogle() {
  const redirectTo = chrome.identity.getRedirectURL()
  console.log('redirecting to', redirectTo)

  console.log('manifest.oauth2!.scopes!.join', manifest.oauth2!.scopes!.join(' '))
  console.log('manifest.oauth2!.client_id', manifest.oauth2!.client_id)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        client_id: manifest.oauth2!.client_id,
        response_type: 'code',
        scope: manifest.oauth2!.scopes!.join(' '),
        access_type: 'offline',
        prompt: 'consent',
        include_granted_scopes: 'true',
      },
    },
  })
  if (error) throw error
  await chrome.tabs.create({ url: data.url })
}
