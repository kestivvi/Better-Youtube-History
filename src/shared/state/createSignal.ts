import { signal, Signal } from '@preact/signals-react'

type SignalExports<T, K extends string> = {
  [P in `${K}Signal` | `${K}SignalSet`]: P extends `${K}Signal` ? Signal<T> : (newValue: T) => void
}

export function createSignal<T, K extends string>(
  variableName: K,
  initialValue: T,
): SignalExports<T, K> {
  // Initialize a signal
  const signalObject = signal<T>(initialValue)

  // Define a function to update the signal's value and synchronize it with chrome's local storage
  const setValue = (newValue: T) => {
    signalObject.value = newValue
    chrome.storage.local.set({ [variableName]: newValue })
  }

  // Retrieve the value from chrome's local storage when the module is loaded
  chrome.storage.local.get(variableName, (result) => {
    const storedValue = result[variableName]
    if (storedValue !== undefined) {
      setValue(storedValue)
    }
  })

  // Listen for changes to the value in chrome's local storage
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && variableName in changes && changes[variableName]) {
      setValue(changes[variableName].newValue)
    }
  })

  return {
    [`${variableName}Signal`]: signalObject,
    [`${variableName}SignalSet`]: setValue,
  } as SignalExports<T, K>
}
