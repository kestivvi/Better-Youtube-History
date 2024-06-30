import { useState, useEffect } from 'react'
import './Popup.css'
import secrets from '../secrets'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(secrets.supabase.url, secrets.supabase.key)

export default function () {
  const homePage = chrome.runtime.getURL('home.html')
  console.log('homePage', homePage)

  const [session, setSession] = useState(null)
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
    </>
  )
}

/**
 * Method used to login with google provider.
 */
export async function loginWithGoogle() {
  const redirectTo = chrome.identity.getRedirectURL()
  console.log('redirecting to', redirectTo)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  })
  if (error) throw error

  await chrome.tabs.create({ url: data.url })
}

// https://accounts.google.com/signin/oauth/error/v2?authError=ChVyZWRpcmVjdF91cmlfbWlzbWF0Y2ggkAMyAggB&client_id=499463732095-9270cm2v7ouua3aki0d6t9a9sbulg4k8.apps.googleusercontent.com&flowName=GeneralOAuthFlow

// https://accounts.google.com/o/oauth2/v2/auth?client_id=499463732095-9270cm2v7ouua3aki0d6t9a9sbulg4k8.apps.googleusercontent.com&redirect_to=https%3A%2F%2Fohnngoekfdokaicfademdldaciajdabj.chromiumapp.org%2F&redirect_uri=https%3A%2F%2Fftjdeizdusvczcxeqzsc.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTk3Nzk2NDksInNpdGVfdXJsIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJmdW5jdGlvbl9ob29rcyI6bnVsbCwicHJvdmlkZXIiOiJnb29nbGUiLCJyZWZlcnJlciI6Imh0dHBzOi8vb2hubmdvZWtmZG9rYWljZmFkZW1kbGRhY2lhamRhYmouY2hyb21pdW1hcHAub3JnLyIsImZsb3dfc3RhdGVfaWQiOiIifQ.PuhuQR8xYfatDvOwcb3VGYTJmVsNFA63fFLgP5wQYvE

// https://ohnngoekfdokaicfademdldaciajdabj.chromiumapp.org/#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6Ijc3NnhHbmtFYk5jWEs3WXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE5NzgzNDA1LCJpYXQiOjE3MTk3Nzk4MDUsImlzcyI6Imh0dHBzOi8vZnRqZGVpemR1c3ZjemN4ZXF6c2Muc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImJkNGY2ODU2LTMyMTYtNGUxOS05ZjQ3LTcwNTg5YjkyOTBkMCIsImVtYWlsIjoia3RoYXRleW9AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnb29nbGUiLCJwcm92aWRlcnMiOlsiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMU1N6NWtRVS1QUjlnWnFXVFEybXNzY0J2UjRzQUxuLVZYa0ZJakJSUGx6TEp4MUE9czk2LWMiLCJlbWFpbCI6Imt0aGF0ZXlvQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJLcnp5c3p0b2YgS3dpYXRrb3dza2kiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoiS3J6eXN6dG9mIEt3aWF0a293c2tpIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTFNTejVrUVUtUFI5Z1pxV1RRMm1zc2NCdlI0c0FMbi1WWGtGSWpCUlBsekxKeDFBPXM5Ni1jIiwicHJvdmlkZXJfaWQiOiIxMTAwODkwMDk5ODk0NzQ3MjE4NTkiLCJzdWIiOiIxMTAwODkwMDk5ODk0NzQ3MjE4NTkifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvYXV0aCIsInRpbWVzdGFtcCI6MTcxOTc3OTgwNX1dLCJzZXNzaW9uX2lkIjoiY2M4ZWM1YmQtMTZiMC00ZGUzLTkyYjAtMzIzYjIxNTc2OWRiIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.TJKAwambjAOa3LIlhD5ZuJRbCvnN1_3pmhcYelwuOkk&expires_at=1719783405&expires_in=3600&provider_token=ya29.a0AXooCgvRIrnP07G9aIJhR18ubfyhTRB3EMCaKfBbuNEkGBm_nRfn10M8qNEfLXpWvaIkVMXo_z3lZ_3i0JemZyaO__foEhaTArHHBLkKYUG_hNjg8nywRpjumPXjBn2POs7QUy0DEZ13jXAUrJmVrkvmRm6zCLW1oSJaaCgYKAb0SARESFQHGX2Mibnt1yCF_JbhIHFsYT_8L2g0171&refresh_token=m2YtkTB8j7BAu2uFIX9Y4w&token_type=bearer
