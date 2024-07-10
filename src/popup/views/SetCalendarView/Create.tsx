import { providerTokenSignal } from '@/shared/state/auth/tokens/providerToken'
import { calendarIdSignal } from '@/shared/state/calendarId'
import { Button, Stack, TextInput } from '@mantine/core'
import { useRef } from 'react'
import { setCalendarViewStage } from '.'
import { IconCaretLeftFilled } from '@tabler/icons-react'
import { signal } from '@preact/signals-react'
import { createNewGoogleCalendar } from '@/shared/calendar/createGoogleCalendar'

const DEFAULT_CALENDAR_NAME = 'Youtube History'

export default function () {
  const textInputRef = useRef<HTMLInputElement>(null)

  const loading = signal(false)

  return (
    <Stack px={20} w="100%">
      {/* TODO: Input cannot be empty and max lenght is 20 chars or sth */}
      <TextInput
        ref={textInputRef}
        label="Name for new calendar"
        defaultValue={DEFAULT_CALENDAR_NAME}
      />

      <Button
        onClick={async () => {
          if (!providerTokenSignal.value) {
            console.error('Provider token is not set')
            return
          }

          loading.value = true

          const { newCalendarId } = await createNewGoogleCalendar(
            textInputRef.current?.value || DEFAULT_CALENDAR_NAME,
            providerTokenSignal.value,
          )

          calendarIdSignal.value = newCalendarId

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