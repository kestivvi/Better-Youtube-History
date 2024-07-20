import { type Signal, effect } from "@preact/signals-react"

export function initializeFromChromeStorage<T>(
  variableName: string,
  signalObject: Signal<T>,
  callback?: (signal: Signal<T>) => void,
) {
  chrome.storage.local.get(variableName, (result) => {
    const storedValue = result[variableName]
    if (storedValue !== undefined && storedValue !== null) {
      signalObject.value = storedValue
    }
    setupChromeStorageEffect(variableName, signalObject)
    callback?.(signalObject)
  })
}

export function setupChromeStorageEffect<T>(
  variableName: string,
  signalObject: Signal<T>,
) {
  effect(() => {
    if (signalObject.value === undefined || signalObject.value === null) {
      chrome.storage.local.remove(variableName)
    } else {
      chrome.storage.local.set({ [variableName]: signalObject.value })
    }
  })
}

export function setupChromeChangeListener<T>(
  variableName: string,
  signalObject: Signal<T>,
) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && variableName in changes && changes[variableName]) {
      signalObject.value = changes[variableName].newValue
    }
  })
}
