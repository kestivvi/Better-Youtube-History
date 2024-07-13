import { NumberInput, NumberInputProps } from '@mantine/core'
import { ForwardedRef, forwardRef } from 'react'
import * as v from 'valibot'

export const activityRetentionPeriodFieldSchema = v.pipe(
  v.number('Value must be a number'),
  v.minValue(1, 'Value must be greater than 0'),
  v.maxValue(365, 'Value must be less than 365'),
)

export default forwardRef((props: NumberInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <NumberInput
      label="Activity Retention Period (days)"
      description="The number of days to keep the activity data in the local storage. Older data will be automatically deleted to save space."
      ref={ref}
      {...props}
    />
  )
})
