import { effect, signal, Signal } from "@preact/signals-react"

export type ReturnedSignalObj<T, K extends string> = {
  [P in `${K}Signal`]: Signal<T>
}

type Options<T> =
  | {
      useChromeLocalStorage?: boolean
      callbackAfterInitFromStorage?: (signal: Signal<T>) => void
    }
  | undefined

export function createSignal<T, K extends string>(
  variableName: K,
  initialValue: T,
  options: Options<T> = {
    useChromeLocalStorage: true,
  },
): ReturnedSignalObj<T, K> {
  // Set default options (I amnot sure how default options work in TypeScript, so I am setting them manually)
  if (options.useChromeLocalStorage === undefined) options.useChromeLocalStorage = true

  // Initialize a signal
  const signalObject = signal<T>(initialValue)

  if (options.useChromeLocalStorage) {
    // Retrieve the value from chrome's local storage
    chrome.storage.local.get(variableName, (result) => {
      const storedValue = result[variableName]

      if (storedValue !== undefined && storedValue !== null) {
        signalObject.value = storedValue
      }

      // Update the value in chrome's local storage whenever the signal's value changes
      // This effect is called after retrieving the value from storage to avoid setting initial value to chrome's local storage
      effect(() => {
        if (signalObject.value === undefined || signalObject.value === null) {
          chrome.storage.local.remove(variableName)
        } else {
          chrome.storage.local.set({ [variableName]: signalObject.value })
        }
      })

      // Call the callback function after the value has been set
      options.callbackAfterInitFromStorage?.(signalObject)
    })

    // Listen for changes to the value in chrome's local storage
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && variableName in changes && changes[variableName]) {
        signalObject.value = changes[variableName].newValue
      }
    })
  }

  return {
    [`${variableName}Signal`]: signalObject,
  } as ReturnedSignalObj<T, K>
}
