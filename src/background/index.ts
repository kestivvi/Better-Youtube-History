import { createClient } from '@supabase/supabase-js'
import secrets from '../secrets'
import { setupOAuthFlow } from './auth/oauthFlow/setupOAuthFlow'
import { setupHandlingRuntimeMessages } from './runtime_messages/setupHandlingRuntimeMessages'
import { checkSessionAndRefreshTokens } from './auth/refreshing/checkSessionAndRefreshTokens'
import { checkForEventsToAdd } from './googleCalendar/checkForEventsToAdd'
import { database } from './database'

console.log('background is running')

const GOOGLE_CALENDAR_SYNC_INTERVAL_MINUTES = 1
// const GOOGLE_CALENDAR_EVENT_PREFIX = '[YT] '
const GOOGLE_CALENDAR_EVENT_PREFIX = '📺 '
const REFRESH_BUFFER_TIME_IN_SECONDS = 60 * 10
const INTERVAL_TO_CHECK_SESSION_AND_REFRESH_TOKENS_MINUTES = 10

const supabase = createClient(secrets.supabase.url, secrets.supabase.key)

// Initialize OAuth flow for user authentication.
// This includes adding a tab listener when the background script is activated.
setupOAuthFlow()

setupHandlingRuntimeMessages()

setInterval(
  async () => await checkForEventsToAdd(database, GOOGLE_CALENDAR_EVENT_PREFIX),
  GOOGLE_CALENDAR_SYNC_INTERVAL_MINUTES * 60 * 1000,
)

setInterval(
  async () => checkSessionAndRefreshTokens(supabase, REFRESH_BUFFER_TIME_IN_SECONDS),
  INTERVAL_TO_CHECK_SESSION_AND_REFRESH_TOKENS_MINUTES * 60 * 1000,
)

// curl -X POST 'https://ftjdeizdusvczcxeqzsc.supabase.co/functions/v1/refresh-google-token' -H "Content-Type: application/json" -d '{"provider_refresh_token":"1%2F%2F09v46yBJduUolCgYIARAAGAkSNwF-L9IrHPjqkbRgtfvmMp_5jWx-D52R_L7FVqrZUUApwq6alYK3gaosr6IgQ6ysCxl5IHV8woI"}' -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0amRlaXpkdXN2Y3pjeGVxenNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3NjU3MTMsImV4cCI6MjAzNTM0MTcxM30.x2hJi3naRoTV9KylzbUUmIwkIjygwfaWc2oKmqCh1Zk" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6Ijc3NnhHbmtFYk5jWEs3WXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzIwMjk2NTQ4LCJpYXQiOjE3MjAyOTI5NDgsImlzcyI6Imh0dHBzOi8vZnRqZGVpemR1c3ZjemN4ZXF6c2Muc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImU3OTQ5N2RhLTAzMDktNDE4Ni04MzE3LTNiZDQ1NzhiZDJkYSIsImVtYWlsIjoia3RoYXRleW9AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnb29nbGUiLCJwcm92aWRlcnMiOlsiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMU1N6NWtRVS1QUjlnWnFXVFEybXNzY0J2UjRzQUxuLVZYa0ZJakJSUGx6TEp4MUE9czk2LWMiLCJlbWFpbCI6Imt0aGF0ZXlvQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJLcnp5c3p0b2YgS3dpYXRrb3dza2kiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoiS3J6eXN6dG9mIEt3aWF0a293c2tpIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTFNTejVrUVUtUFI5Z1pxV1RRMm1zc2NCdlI0c0FMbi1WWGtGSWpCUlBsekxKeDFBPXM5Ni1jIiwicHJvdmlkZXJfaWQiOiIxMTAwODkwMDk5ODk0NzQ3MjE4NTkiLCJzdWIiOiIxMTAwODkwMDk5ODk0NzQ3MjE4NTkifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvYXV0aCIsInRpbWVzdGFtcCI6MTcyMDI5Mjk0OH1dLCJzZXNzaW9uX2lkIjoiNjE2ZjM3NTItYzQ0OC00NWNiLWJjZTQtMDk0Zjk5YmYxMWE1IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.UCdhB82yqeQsYUwbn1Wmu0pftxHkhFvxEH_V7anWiUE"

// setInterval(
//   async () => {
//     // check if session is expired
//     const { session } = await chrome.storage.local.get('session')

//     console.log('checking session ...', session)

//     const current_time_plus_10_minutes = new Date().getTime() / 1000 + 60 * 10
//     const expires_at = session.expires_at

//     console.log('current_time_plus_10_minutes', current_time_plus_10_minutes)
//     console.log('expires_at', expires_at)

//     if (current_time_plus_10_minutes < expires_at) {
//       return
//     }

//     console.log('refreshing session ...')

//     // use supabase to refresh the session
//     // persist the refreshed session to storage

//     const { data, error } = await supabase.auth.refreshSession(session)
//     console.log('refreshed session', data)

//     if (error) {
//       console.error('error refreshing session', error)
//     } else {
//       await chrome.storage.local.set({ session: data.session })
//     }
//   },
//   10 * 60 * 1000,
// )

// const manifest = chrome.runtime.getManifest()

// // Refresh provider token
// setInterval(
//   async () => {
//     const { provider_refresh_token } = await chrome.storage.local.get('provider_refresh_token')

//     // const response = await fetch(
//     //   'https://ftjdeizdusvczcxeqzsc.supabase.co/functions/v1/refresh-google-token',
//     //   {
//     //     method: 'POST',
//     //     headers: {
//     //       Authorization: `Bearer ${secrets.supabase.key}`,
//     //       'Content-Type': 'application/x-www-form-urlencoded',
//     //     },
//     //     body: new URLSearchParams({
//     //       client_id: manifest.oauth2!.client_id,
//     //       client_secret: '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',
//     //       refresh_token: provider_refresh_token,
//     //       grant_type: 'refresh_token',
//     //     }),
//     //   },
//     // )

//     console.log('refreshing provider token ...', provider_refresh_token)

//     const { data, error } = await supabase.functions.invoke('refresh-google-token', {
//       body: {
//         provider_refresh_token,
//       },
//     })

//     console.log('refreshed provider token', data)

//     await chrome.storage.local.set({
//       provider_token: data.access_token,
//     })
//   },
//   10 * 60 * 1000,
// )
