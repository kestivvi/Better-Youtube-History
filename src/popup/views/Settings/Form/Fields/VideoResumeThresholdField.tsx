import { NumberInput, NumberInputProps } from '@mantine/core'
import { ForwardedRef, forwardRef } from 'react'
import * as v from 'valibot'

export const videoResumeThresholdFieldSchema = v.pipe(
  v.number('Value must be a number'),
  v.minValue(1, 'Value must be greater than 0'),
  v.maxValue(30, 'Value must be less than 30'),
)

export default forwardRef((props: NumberInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <NumberInput
      label="Video Resume Threshold (minutes)"
      description="The time period after which resuming a video will be considered a new viewing session rather than continuing the previous one."
      ref={ref}
      {...props}
    />
  )
})
