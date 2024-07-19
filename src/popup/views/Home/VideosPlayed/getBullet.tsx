import type { State } from "./VideoPlayed"
import { Bullet } from "./Bullet"
import { IconCalendarCheck, IconClock, IconVideo } from "@tabler/icons-react"

// Helper function for exhaustive checks
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x)
}

export const getBullet = (state: State) => {
  switch (state) {
    case "UNDER_MIN_DURATION":
      return (
        <Bullet
          label="You haven't watched this video for the minimum duration yet. Keep watching and an event will end up in your calendar."
          Icon={IconClock}
          color="yellow"
        />
      )
    case "MIN_DURATION_FULLFILLED":
      return (
        <Bullet
          label="You've been watching this video for more than the minimum duration. When you stop watching, the event will be created in your calendar."
          Icon={IconVideo}
          color="green"
        />
      )

    case "UPLOADED":
      return (
        <Bullet
          label="Event has been created in your calendar."
          Icon={IconCalendarCheck}
          color="blue"
        />
      )

    default:
      return assertNever(state)
  }
}
