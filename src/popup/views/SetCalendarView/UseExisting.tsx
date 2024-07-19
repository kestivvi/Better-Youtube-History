import { providerTokenSignal } from "@/shared/state/auth/tokens/providerToken"
import { calendarIdSignal } from "@/shared/state/calendarId"
import { Button, Stack, Textarea } from "@mantine/core"
import { useRef } from "react"
import { setCalendarViewStage } from "."
import { IconCaretLeftFilled } from "@tabler/icons-react"
import { signal } from "@preact/signals-react"
import { validateGoogleCalendar } from "@/shared/calendar/validateGoogleCalendarId"

const loading = signal(false)
const error = signal<string | null>(null)

export default function () {
  const ref = useRef<HTMLTextAreaElement>(null)

  return (
    <Stack mx={20}>
      <Textarea
        ref={ref}
        id="calendar-id-input"
        label="Existing Google Calendar ID"
        description="ID of the Google Calendar where events will be added. It's in your Google Calendar settings."
        placeholder="64-long-random-characters-text@group.calendar.google.com"
        required
        error={error.value}
        rows={3}
      />

      <Button
        onClick={async () => {
          const value = ref.current?.value
          if (!value) return

          if (!providerTokenSignal.value) {
            console.error("Provider token is not set")
            return
          }

          loading.value = true

          const isNewCalendarValid = await validateGoogleCalendar(
            value,
            providerTokenSignal.value,
          )

          if (isNewCalendarValid) calendarIdSignal.value = value
          else
            error.value =
              "It is not a valid Google Calendar ID! Provide ID to your existing Google Calendar!"

          loading.value = false
        }}
      >
        Use
      </Button>

      <Button
        onClick={() => (setCalendarViewStage.value = "FIRST_STAGE")}
        leftSection={<IconCaretLeftFilled />}
        variant="transparent"
      >
        Back
      </Button>
    </Stack>
  )
}
