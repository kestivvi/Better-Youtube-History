import { createSignal } from "../../createSignal"

export type ProviderTokenInfo = {
  azp: string
  aud: string
  sub: string
  scope: string
  exp: string
  expires_in: string
  email: string
  email_verified: string
  access_type: string
}

export const { providerTokenInfoSignal } = createSignal(
  "providerTokenInfo",
  null as ProviderTokenInfo | null,
)
