import { NumberInput, NumberInputProps } from '@mantine/core'
import { ForwardedRef, forwardRef } from 'react'
import * as v from 'valibot'

export const calendarSyncFrequencyFieldSchema = v.pipe(
  v.number('Value must be a number'),
  v.minValue(1, 'Value must be greater than 0'),
  v.maxValue(1440, 'Value must be less than 1440'),
)

export default forwardRef((props: NumberInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <NumberInput
      label="Calendar Sync Frequency (minutes)"
      description="How often to sync the calendar with the Google server."
      ref={ref}
      {...props}
    />
  )
})
