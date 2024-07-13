import { activityRetentionPeriodSignal } from '@/shared/state/calendar/activityRetentionPeriod'
import { Button, NumberInput, Space } from '@mantine/core'
import { computed, signal } from '@preact/signals-react'
import { useRef } from 'react'

const loading = signal(false)
const error = signal<string | null>(null)

const secondsToDays = (seconds: number) => seconds / 24 / 60 / 60
const daysToSeconds = (days: number) => days * 24 * 60 * 60

export default function () {
  const ref = useRef<HTMLInputElement>(null)

  // convert to days
  const defaultValue = computed(() => secondsToDays(activityRetentionPeriodSignal.value))

  return (
    <>
      <NumberInput
        ref={ref}
        id="activity-retention-period-input"
        label="Activity retention period (days)"
        description="How long to keep activity data. It will be deleted after this period."
        defaultValue={defaultValue.value}
        disabled={loading.value}
        error={error.value}
        allowNegative={false}
        allowDecimal={false}
        min={1}
      />

      <Space h="md" />

      <Button
        fullWidth
        variant="subtle"
        onClick={async () => {
          const value = ref.current?.value
          if (!value) return

          if (isNaN(Number(value))) {
            error.value = 'Please enter a valid number'
            return
          } else {
            loading.value = true

            const days = Number(value)
            const seconds = daysToSeconds(days)
            activityRetentionPeriodSignal.value = seconds

            loading.value = false
          }
        }}
      >
        Save
      </Button>
    </>
  )
}
