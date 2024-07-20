import { TextInput, type TextInputProps } from "@mantine/core"
import { type ForwardedRef, forwardRef } from "react"
import * as v from "valibot"

export const calendarEventPrefixFieldSchema = v.string()

export default forwardRef(
  (props: TextInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <TextInput
        label="Event prefix"
        description="Prefix for the event title. It will be added to the beginning of the event title."
        ref={ref}
        {...props}
      />
    )
  },
)
