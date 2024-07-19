import { NumberInput, NumberInputProps } from "@mantine/core"
import { ForwardedRef, forwardRef } from "react"
import * as v from "valibot"

export const minVideoWatchDurationFieldSchema = v.pipe(
  v.number("Value must be a number"),
  v.minValue(5, "Value must be greater than 5"),
  v.maxValue(3600, "Value must be less than 3600"),
)

export default forwardRef(
  (props: NumberInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <NumberInput
        label="Minimum Video Watch Duration (seconds)"
        description="The minimum duration of a video to be considered adding to calendar."
        ref={ref}
        {...props}
      />
    )
  },
)
