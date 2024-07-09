import { providerTokenSignal } from '@/shared/state/auth/tokens/providerToken'
import { calendarIdSignal } from '@/shared/state/calendarId'
import { Button, Stack, TextInput } from '@mantine/core'
import { useRef } from 'react'
import { setCalendarViewStage } from '.'
import { IconCaretLeftFilled } from '@tabler/icons-react'
import { signal } from '@preact/signals-react'
import { validateGoogleCalendar } from '@/shared/calendar/validateGoogleCalendarId'

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

          if (!providerTokenSignal.value) {
            console.error('Provider token is not set')
            loading.value = false
            return
          }

          const calendarExists = await validateGoogleCalendar(calendarId, providerTokenSignal.value)
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
