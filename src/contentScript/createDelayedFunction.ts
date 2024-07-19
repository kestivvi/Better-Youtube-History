export function createDelayedFunction(
  fn: () => void,
  initialDelay: number,
  idleTime: number,
): () => Promise<void> {
  let lastCallTime = 0
  let initialCallTime = 0
  let timeoutId: NodeJS.Timeout | null = null

  return async () => {
    const now = Date.now()

    if (now - lastCallTime > idleTime) {
      if (now - initialCallTime > initialDelay) {
        initialCallTime = now
        timeoutId = setTimeout(() => {
          lastCallTime = now
          fn()
        }, initialDelay)
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }

        const remainingTime = initialDelay - (now - initialCallTime)

        if (remainingTime > 50) {
          timeoutId = setTimeout(() => {
            lastCallTime = now
            fn()
          }, remainingTime)
        } else {
          lastCallTime = now
          return fn()
        }
      }
    } else {
      lastCallTime = now
      return fn()
    }
  }
}
