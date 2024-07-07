import { effect, signal, Signal } from '@preact/signals-react'

type ReturnedSignalObj<T, K extends string> = {
  [P in `${K}Signal`]: Signal<T>
}

export function createSignal<T, K extends string>(
  variableName: K,
  initialValue: T,
): ReturnedSignalObj<T, K> {
  // Initialize a signal
  const signalObject = signal<T>(initialValue)

  // Retrieve the value from chrome's local storage
  chrome.storage.local.get(variableName, (result) => {
    const storedValue = result[variableName]

    if (storedValue !== undefined) {
      signalObject.value = storedValue
    }

    // Update the value in chrome's local storage whenever the signal's value changes
    // This effect is called after retrieving the value from storage to avoid setting initial value to chrome's local storage
    effect(() => {
      chrome.storage.local.set({ [variableName]: signalObject.value })
    })
  })

  // Listen for changes to the value in chrome's local storage
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && variableName in changes && changes[variableName]) {
      signalObject.value = changes[variableName].newValue
    }
  })

  return {
    [`${variableName}Signal`]: signalObject,
  } as ReturnedSignalObj<T, K>
}
