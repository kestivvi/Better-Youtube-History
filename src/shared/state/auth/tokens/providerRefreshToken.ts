import { createSignal } from "../../createSignal"

export const { providerRefreshTokenSignal } = createSignal(
  "providerRefreshToken",
  null as string | null,
)
