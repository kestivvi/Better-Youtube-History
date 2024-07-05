import { useState, useEffect } from 'react'
import './Popup.css'
import secrets from '../secrets'
import { createClient } from '@supabase/supabase-js'

const manifest = chrome.runtime.getManifest()
const supabase = createClient(secrets.supabase.url, secrets.supabase.key)

export default function () {
  const homePage = chrome.runtime.getURL('home.html')
  console.log('homePage', homePage)

  const [session, setSession] = useState<any>(null)
  const loggedIn = session !== null

  useEffect(() => {
    ;(async () => {
      const { session } = await chrome.storage.local.get('session')
      console.log('session', session)
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
      <a href={homePage} target="_blank">
        Strona Główna
      </a>
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
          <button
            onClick={async () => {
              const { provider_token } = await chrome.storage.local.get('provider_token')

              console.log('Trying to verify provider token...', provider_token)
              fetch(
                'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + provider_token,
                {
                  method: 'POST',
                },
              )
                .then((response) => {
                  console.log('verify provider token response', response)
                })
                .catch((error) => {
                  console.error('verify provider token error', error)
                })
            }}
          >
            Verify token
          </button>

          <button
            onClick={async () => {
              const { provider_token } = await chrome.storage.local.get('provider_token')

              const response = await fetch(
                'https://www.googleapis.com/calendar/v3/users/me/calendarList',
                {
                  headers: {
                    Authorization: `Bearer ${provider_token}`,
                  },
                },
              )

              const data = await response.json()
              console.log('data', data)
            }}
          >
            Get list of calendars
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
      },
    },
  })
  if (error) throw error
  await chrome.tabs.create({ url: data.url })
}
