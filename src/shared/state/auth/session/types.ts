export type SessionStateType = 'LOADING' | 'LOGGED_IN' | 'NOT_LOGGED_IN'

export type SessionType = {
  access_token: string
  expires_at: number
  expires_in: number
  refresh_token: string
  token_type: string
  user: {
    app_metadata: {
      provider: string
      providers: string[]
    }
    aud: string
    confirmed_at: string
    created_at: string
    email: string
    email_confirmed_at: string
    id: string
    identities: Array<{
      created_at: string
      email: string
      id: string
      identity_data: {
        avatar_url: string
        email: string
        email_verified: boolean
        full_name: string
        iss: string
        name: string
        phone_verified: boolean
        picture: string
        provider_id: string
        sub: string
      }
      identity_id: string
      last_sign_in_at: string
      provider: string
      updated_at: string
      user_id: string
    }>
    is_anonymous: boolean
    last_sign_in_at: string
    phone: string
    role: string
    updated_at: string
    user_metadata: {
      avatar_url: string
      email: string
      email_verified: boolean
      full_name: string
      iss: string
      name: string
      phone_verified: boolean
      picture: string
      provider_id: string
      sub: string
    }
  }
}
