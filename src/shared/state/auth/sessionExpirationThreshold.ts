import { createSignal } from '../createSignal'

export const { sessionExpirationThresholdSecondsSignal } = createSignal(
  'sessionExpirationThresholdSeconds',
  60 * 10,
)
