import { validateGoogleCalendar } from '@/shared/calendar/validateGoogleCalendarId'
import { providerTokenSignal } from '@/shared/state/auth/tokens/providerToken'
import { calendarIdSignal } from '@/shared/state/calendarId'
import { Button, Space, Textarea } from '@mantine/core'
import { signal } from '@preact/signals-react'
import { useRef } from 'react'

const loading = signal(false)
const error = signal<string | null>(null)

export default function () {
  const ref = useRef<HTMLTextAreaElement>(null)

  return (
    <>
      <Textarea
        ref={ref}
        id="calendar-id-input"
        label="Google Calendar ID"
        description="ID of the Google Calendar where events will be added. It's in your Google Calendar settings."
        placeholder="64-long-random-characters-text@group.calendar.google.com"
        required
        defaultValue={calendarIdSignal.value ?? ''}
        disabled={calendarIdSignal.value === null}
        error={(calendarIdSignal.value === null && 'Error loading calendar ID') || error.value}
        rows={3}
      />

      <Space h="md" />

      <Button
        fullWidth
        onClick={async () => {
          const value = ref.current?.value
          if (!value) return

          if (!providerTokenSignal.value) {
            console.error('Provider token is not set')
            return
          }

          loading.value = true

          const isNewCalendarValid = await validateGoogleCalendar(value, providerTokenSignal.value)

          if (isNewCalendarValid) calendarIdSignal.value = value
          else
            error.value =
              'It is not a valid Google Calendar ID! Provide ID to your existing Google Calendar!'

          loading.value = false
        }}
      >
        Save calendar ID
      </Button>
    </>
  )
}
