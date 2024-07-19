import { ProviderTokenInfo } from "@/shared/state/auth/tokens/providerTokenInfo"

export async function isProviderTokenValid(
  providerTokenInfo: ProviderTokenInfo,
): Promise<boolean> {
  const tokenExpiresAt = Number(providerTokenInfo.exp)
  const currentTime = Math.floor(new Date().getTime() / 1000)

  return tokenExpiresAt > currentTime
}
