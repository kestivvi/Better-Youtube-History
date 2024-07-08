import { providerTokenSignal } from '@/shared/state/auth/tokens/providerToken'
import { calendarIdSignal } from '@/shared/state/calendarId'
import { Button, Stack, TextInput } from '@mantine/core'
import { useRef } from 'react'
import { setCalendarViewStage } from '.'
import { IconCaretLeftFilled } from '@tabler/icons-react'
import { signal } from '@preact/signals-react'

const createNewGoogleCalendar = async (calendarName: string) => {
  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${providerTokenSignal.value}`,
    },
    body: JSON.stringify({
      summary: calendarName,
      description: 'Calendar for Better Youtube History Extension\n\nDo not delete!',
    }),
  })

  const data = await response.json()
  console.log('[SetCalendarView] Create Youtube History Calendar', data)

  calendarIdSignal.value = data.id
}

const DEFAULT_CALENDAR_NAME = 'Youtube History'

export default function () {
  const textInputRef = useRef<HTMLInputElement>(null)

  const loading = signal(false)

  return (
    <Stack>
      {/* TODO: Input cannot be empty and max lenght is 20 chars or sth */}
      <TextInput
        ref={textInputRef}
        label="Name for new calendar"
        defaultValue={DEFAULT_CALENDAR_NAME}
      />

      <Button
        onClick={async () => {
          loading.value = true
          createNewGoogleCalendar(textInputRef.current?.value || DEFAULT_CALENDAR_NAME)
          loading.value = false
        }}
        loading={loading.value}
      >
        Create
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
