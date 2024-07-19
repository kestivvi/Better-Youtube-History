import { ProviderTokenInfo } from "@/shared/state/auth/tokens/providerTokenInfo"

export async function willProviderTokenBeValid(
  providerTokenInfo: ProviderTokenInfo | null,
  secondsIntoFuture: number,
): Promise<boolean> {
  if (providerTokenInfo === null) return false

  const tokenExpiresAt = Number(providerTokenInfo.exp)
  const currentTime = Math.floor(new Date().getTime() / 1000)
  const futureTime = currentTime + secondsIntoFuture

  return futureTime < tokenExpiresAt
}
