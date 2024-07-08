import { providerTokenSignal } from '@/shared/state/auth/tokens/providerToken'
import { calendarIdSignal } from '@/shared/state/calendarId'
import { Button, Stack, TextInput } from '@mantine/core'
import { useRef } from 'react'
import { setCalendarViewStage } from '.'
import { IconCaretLeftFilled } from '@tabler/icons-react'
import { signal } from '@preact/signals-react'

const fetchGoogleCalendar = async (calendarId: string) =>
  await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}`, {
    headers: { Authorization: `Bearer ${providerTokenSignal.value}` },
  })

const checkGoogleCalendar = async (calendarId: string): Promise<boolean> => {
  if (!calendarId) return false
  const response = await fetchGoogleCalendar(calendarId)
  return response.status === 200
}

export default function () {
  const textInputRef = useRef<HTMLInputElement>(null)

  const loading = signal(false)

  return (
    <Stack>
      {/* TODO: Input cannot be empty and max lenght is 20 chars or sth */}
      <TextInput ref={textInputRef} label="Existing google calendar id" />

      <Button
        onClick={async () => {
          loading.value = true

          if (!textInputRef.current?.value) return
          const calendarId = textInputRef.current?.value
          const calendarExists = await checkGoogleCalendar(calendarId)
          if (calendarExists) calendarIdSignal.value = calendarId

          loading.value = false
        }}
      >
        Use
      </Button>

      <Button
        onClick={() => (setCalendarViewStage.value = 'FIRST_STAGE')}
        leftSection={<IconCaretLeftFilled />}
        variant="transparent"
      >
        Back
      </Button>
    </Stack>
  )
}
