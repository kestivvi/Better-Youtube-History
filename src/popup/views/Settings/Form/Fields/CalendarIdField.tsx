import { Textarea, type TextareaProps } from "@mantine/core"
import { type ForwardedRef, forwardRef } from "react"
import * as v from "valibot"

import { validateGoogleCalendar } from "@/shared/calendar/validateGoogleCalendarId"
import { providerTokenSignal } from "@/shared/state/auth/tokens/providerToken"

export const calendarIdFieldSchema = v.pipeAsync(
  v.string("value is required"),
  v.trim(),

  v.check(() => {
    console.debug("providerTokenSignal.value", providerTokenSignal.value)
    return providerTokenSignal.value !== null
  }, "Cannot validate Google Calendar ID without provider token!"),

  v.checkAsync(async (value) => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return await validateGoogleCalendar(value, providerTokenSignal.value!)
  }, "It is not a valid Google Calendar ID! Provide ID to your existing Google Calendar!"),
)

export default forwardRef(
  (props: TextareaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
    return (
      <Textarea
        label="Google Calendar ID"
        description="ID of the Google Calendar where events will be added. It's in your Google Calendar settings."
        placeholder="64-long-random-characters-text@group.calendar.google.com"
        rows={3}
        ref={ref}
        {...props}
      />
    )
  },
)
