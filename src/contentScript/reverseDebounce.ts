export default function (fn: () => void, delay: number): () => Promise<void> {
  let initialCallTime: number = 0
  let timeoutId: NodeJS.Timeout | null = null

  return async function () {
    const now = Date.now()

    if (now - initialCallTime > delay) {
      console.log("Initial call")
      initialCallTime = now
      timeoutId = setTimeout(fn, delay)
    } else {
      if (timeoutId) clearTimeout(timeoutId)

      const remainingTime = delay - (now - initialCallTime)

      console.log("Remaining time:", remainingTime)

      if (remainingTime > 50) timeoutId = setTimeout(fn, remainingTime)
      else fn()
    }
  }
}
