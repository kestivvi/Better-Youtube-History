import { SessionType } from "@/shared/state/auth/session/types"

export function willSessionBeValid(
  session: SessionType,
  secondsIntoFuture: number,
): boolean {
  const currentTime = Math.floor(Date.now() / 1000)
  const futureTime = currentTime + secondsIntoFuture

  return futureTime < session.expires_at
}
