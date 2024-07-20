import { createSignal } from "../../signals/StandardSignal/createSignal"

export const { providerRefreshTokenSignal } = createSignal(
  "providerRefreshToken",
  null as string | null,
)
