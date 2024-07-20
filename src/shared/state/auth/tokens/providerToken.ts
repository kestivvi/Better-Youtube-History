import { createSignal } from "../../signals/StandardSignal/createSignal"

export const { providerTokenSignal } = createSignal(
  "providerToken",
  null as string | null,
)
