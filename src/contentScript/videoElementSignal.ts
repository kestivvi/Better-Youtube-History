import { createSignal } from '@/shared/state/createSignal'

export const { videoElementSignal } = createSignal(
  'videoElement',
  null as HTMLVideoElement | null,
  {
    useChromeLocalStorage: false,
  },
)
