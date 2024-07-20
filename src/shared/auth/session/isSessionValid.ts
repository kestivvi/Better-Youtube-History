import type { SessionType } from "@/shared/state/auth/session/types"

export function isSessionValid(session: SessionType): boolean {
  const currentTime = Math.floor(Date.now() / 1000)
  return currentTime < session.expires_at
}
