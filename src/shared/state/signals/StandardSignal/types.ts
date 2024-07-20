import type { Signal } from "@preact/signals-react"

export type ReturnedSignalObj<T, K extends string> = {
  [P in `${K}Signal`]: Signal<T>
}

export type Options<T> = {
  useChromeLocalStorage: boolean
  callbackAfterInitFromStorage?: (signal: Signal<T>) => void
}

export const defaultOptions: Options<unknown> = {
  useChromeLocalStorage: true,
}
