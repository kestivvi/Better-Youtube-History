import { createSignal } from "../../createSignal"

export const { providerTokenSignal } = createSignal(
  "providerToken",
  null as string | null,
)
