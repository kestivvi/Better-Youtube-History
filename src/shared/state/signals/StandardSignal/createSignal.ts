import { signal } from "@preact/signals-react"
import { initializeFromChromeStorage, setupChromeChangeListener } from "./chromeStorage"
import { type Options, type ReturnedSignalObj, defaultOptions } from "./types"

export function createSignal<T, K extends string>(
  variableName: K,
  initialValue: T,
  options: Partial<Options<T>> = {},
): ReturnedSignalObj<T, K> {
  const mergedOptions = { ...defaultOptions, ...options } as Options<T>
  const signalObject = signal<T>(initialValue)

  if (mergedOptions.useChromeLocalStorage) {
    initializeFromChromeStorage(
      variableName,
      signalObject,
      mergedOptions.callbackAfterInitFromStorage,
    )
    setupChromeChangeListener(variableName, signalObject)
  }

  return {
    [`${variableName}Signal`]: signalObject,
  } as ReturnedSignalObj<T, K>
}
