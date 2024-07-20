import { createSignal } from "@/shared/state/signals/StandardSignal/createSignal"

export const { videoElementSignal } = createSignal(
  "videoElement",
  null as HTMLVideoElement | null,
  {
    useChromeLocalStorage: false,
  },
)
