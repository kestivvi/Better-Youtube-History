import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import * as v from "valibot"
import { Box, Button, Stack } from "@mantine/core"
import CalendarIdField, { calendarIdFieldSchema } from "./Fields/CalendarIdField"
import { calendarIdSignal } from "@/shared/state/calendarId"
import CalendarEventPrefixField, {
  calendarEventPrefixFieldSchema,
} from "./Fields/CalendarEventPrefixField"
import { calendarEventPrefixSignal } from "@/shared/state/calendar/calendarEventPrefix"
import { calendarSyncFrequencySignal } from "@/shared/state/calendar/calendarSyncFrequency"
import CalendarSyncFrequencyField, {
  calendarSyncFrequencyFieldSchema,
} from "./Fields/CalendarSyncFrequencyField"
import VideoResumeThresholdField, {
  videoResumeThresholdFieldSchema,
} from "./Fields/VideoResumeThresholdField"
import { videoResumeThresholdSignal } from "@/shared/state/calendar/videoResumeThreshold"
import MinVideoWatchDurationField, {
  minVideoWatchDurationFieldSchema,
} from "./Fields/MinVideoWatchDurationField"
import { minVideoWatchDurationSignal } from "@/shared/state/calendar/minVideoWatchDuration"
import ActivityRetentionPeriodField, {
  activityRetentionPeriodFieldSchema,
} from "./Fields/ActivityRetentionPeriodField"
import { activityRetentionPeriodSignal } from "@/shared/state/calendar/activityRetentionPeriod"

// TODO: Maybe there is a way to generate this from JSON Schema?
const formSchema = v.objectAsync({
  calendarId: calendarIdFieldSchema,
  calendarEventPrefix: calendarEventPrefixFieldSchema,
  calendarSyncFrequency: calendarSyncFrequencyFieldSchema,
  videoResumeThreshold: videoResumeThresholdFieldSchema,
  minVideoWatchDuration: minVideoWatchDurationFieldSchema,
  activityRetentionPeriod: activityRetentionPeriodFieldSchema,
})

type FormType = v.InferOutput<typeof formSchema>

export default function () {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<FormType>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      calendarId: calendarIdSignal.value ?? "",
      calendarEventPrefix: calendarEventPrefixSignal.value,
      // TODO: I think those transformations should be defined in the fields themselves
      calendarSyncFrequency: calendarSyncFrequencySignal.value / 60,
      videoResumeThreshold: videoResumeThresholdSignal.value / 60,
      minVideoWatchDuration: minVideoWatchDurationSignal.value,
      activityRetentionPeriod: activityRetentionPeriodSignal.value / 24 / 60 / 60,
    } satisfies FormType,
  })

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    console.log(data)

    const dataToSend = {
      ...data,
      // TODO: I think those transformations should be defined in the fields themselves
      calendarSyncFrequency: data.calendarSyncFrequency * 60,
      videoResumeThreshold: data.videoResumeThreshold * 60,
      activityRetentionPeriod: data.activityRetentionPeriod * 24 * 60 * 60,
    }

    // TODO: Maybe there is a better way of doing this?
    calendarIdSignal.value = dataToSend.calendarId
    calendarEventPrefixSignal.value = dataToSend.calendarEventPrefix
    calendarSyncFrequencySignal.value = dataToSend.calendarSyncFrequency
    videoResumeThresholdSignal.value = dataToSend.videoResumeThreshold
    minVideoWatchDurationSignal.value = dataToSend.minVideoWatchDuration
    activityRetentionPeriodSignal.value = dataToSend.activityRetentionPeriod

    reset(data)
  }

  // TODO: This should be typed
  const fields = [
    {
      name: "calendarId",
      Component: CalendarIdField,
    },
    {
      name: "calendarEventPrefix",
      Component: CalendarEventPrefixField,
    },
    {
      name: "calendarSyncFrequency",
      Component: CalendarSyncFrequencyField,
    },
    {
      name: "videoResumeThreshold",
      Component: VideoResumeThresholdField,
    },
    {
      name: "minVideoWatchDuration",
      Component: MinVideoWatchDurationField,
    },
    {
      name: "activityRetentionPeriod",
      Component: ActivityRetentionPeriodField,
    },
  ] as const

  return (
    <Stack my={10}>
      {/* TODO: Are those fields disabled while submitting? */}

      {fields.map(({ name, Component }) => (
        <Controller
          key={name}
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Component {...field} error={error?.message} />
          )}
        />
      ))}

      {/* TODO: Show "Validating" when validation is being done */}
      {isDirty && (
        <Box
          style={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <Button
            fullWidth
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {/* TODO: Text should be different for more states like failed submission */}
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </Box>
      )}
    </Stack>
  )
}
