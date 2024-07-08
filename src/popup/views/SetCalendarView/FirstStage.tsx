import { Button, Stack } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { IconCalendarShare } from '@tabler/icons-react'
import { setCalendarViewStage } from '.'

export default function () {
  return (
    <Stack>
      <Button
        onClick={() => {
          console.log('setCalendarViewStage.value', setCalendarViewStage.value)
          setCalendarViewStage.value = 'CREATE'
          console.log('setCalendarViewStage.value', setCalendarViewStage.value)
        }}
        leftSection={<IconPlus stroke={3} />}
      >
        Create new Google Calendar...
      </Button>

      <Button
        onClick={() => (setCalendarViewStage.value = 'USE_EXISTING')}
        leftSection={<IconCalendarShare />}
        variant="default"
      >
        or use existing one...
      </Button>
    </Stack>
  )
}
