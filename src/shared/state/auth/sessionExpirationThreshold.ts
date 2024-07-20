import { createSignal } from "../signals/StandardSignal/createSignal"

export const DEFAULT_SESSION_EXPIRATION_THRESHOLD_SECONDS = 60 * 10

export const { sessionExpirationThresholdSecondsSignal } = createSignal(
  "sessionExpirationThresholdSeconds",
  DEFAULT_SESSION_EXPIRATION_THRESHOLD_SECONDS,
)
