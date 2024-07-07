/**
 * Determines if a session refresh is needed based on the current time, the session's expiration,
 * and a specified lead time before expiration for refreshing.
 *
 * @param session - The session object containing the expires_at timestamp.
 * @param leadTimeInSeconds - The lead time in seconds before expiration when a refresh should be considered.
 * @returns true if the session needs to be refreshed, false otherwise.
 */
export function isRefreshNeeded(
  session: { expires_at: number },
  leadTimeInSeconds: number,
): boolean {
  const currentTime = Math.floor(Date.now() / 1000)
  const expiresAt = session.expires_at
  // Session is considered in need of refresh if current time is within the specified lead time of expiration.
  return currentTime + leadTimeInSeconds >= expiresAt
}
