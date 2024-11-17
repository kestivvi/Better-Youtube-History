import { activityRetentionPeriodSignal } from "@/shared/state/calendar/activityRetentionPeriod"
import { calendarEventPrefixSignal } from "@/shared/state/calendar/calendarEventPrefix"
import { calendarSyncFrequencySignal } from "@/shared/state/calendar/calendarSyncFrequency"
import { minVideoWatchDurationSignal } from "@/shared/state/calendar/minVideoWatchDuration"
import { videoResumeThresholdSignal } from "@/shared/state/calendar/videoResumeThreshold"
import { calendarIdSignal } from "@/shared/state/calendarId"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { Box, Button, Stack } from "@mantine/core"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import * as v from "valibot"
import ActivityRetentionPeriodField, {
  activityRetentionPeriodFieldSchema,
} from "./Fields/ActivityRetentionPeriodField"
import CalendarEventPrefixField, {
  calendarEventPrefixFieldSchema,
} from "./Fields/CalendarEventPrefixField"
import CalendarIdField, { calendarIdFieldSchema } from "./Fields/CalendarIdField"
import CalendarSyncFrequencyField, {
  calendarSyncFrequencyFieldSchema,
} from "./Fields/CalendarSyncFrequencyField"
import MinVideoWatchDurationField, {
  minVideoWatchDurationFieldSchema,
} from "./Fields/MinVideoWatchDurationField"
import VideoResumeThresholdField, {
  videoResumeThresholdFieldSchema,
} from "./Fields/VideoResumeThresholdField"
import LLMApiKeyField, { llmApiKeyFieldSchema } from "./Fields/LLMApiKeyField"
import LLMApiUrlField, { llmApiUrlFieldSchema } from "./Fields/LLMApiUrlField"
import CategoriesField, { categoriesFieldSchema } from "./Fields/CategoriesField"
import { llmApiKeySignal, llmApiUrlSignal, categoriesSignal } from "@/shared/state/calendar/categoryConfig"
import { Category } from "@/background/calendar/CategoryService"

// TODO: Maybe there is a way to generate this from JSON Schema?
const formSchema = v.objectAsync({
  calendarId: calendarIdFieldSchema,
  calendarEventPrefix: calendarEventPrefixFieldSchema,
  calendarSyncFrequency: calendarSyncFrequencyFieldSchema,
  videoResumeThreshold: videoResumeThresholdFieldSchema,
  minVideoWatchDuration: minVideoWatchDurationFieldSchema,
  activityRetentionPeriod: activityRetentionPeriodFieldSchema,
  llmApiKey: llmApiKeyFieldSchema,
  llmApiUrl: llmApiUrlFieldSchema,
  categories: categoriesFieldSchema,
})

type FormType = v.InferOutput<typeof formSchema>

type FieldConfig = {
  name: keyof FormType
  Component: React.ComponentType<any>
  type: 'text' | 'number' | 'categories'
}

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
      llmApiKey: llmApiKeySignal.value ?? "",
      llmApiUrl: llmApiUrlSignal.value ?? "",
      categories: categoriesSignal.value,
    } satisfies FormType,
  })

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    console.log(data)

    const dataToSend = {
      ...data,
      // TODO: I think those transformations should be defined in the fields themselves
      calendarSyncFrequency: data.calendarSyncFrequency * 60,
      videoResumeThreshold: data.videoResumeThreshold * 60,
      minVideoWatchDuration: data.minVideoWatchDuration,
      activityRetentionPeriod: data.activityRetentionPeriod * 24 * 60 * 60,
      llmApiKey: data.llmApiKey,
      llmApiUrl: data.llmApiUrl,
      categories: data.categories,
    }

    // TODO: Maybe there is a better way of doing this?
    calendarIdSignal.value = dataToSend.calendarId
    calendarEventPrefixSignal.value = dataToSend.calendarEventPrefix
    calendarSyncFrequencySignal.value = dataToSend.calendarSyncFrequency
    videoResumeThresholdSignal.value = dataToSend.videoResumeThreshold
    minVideoWatchDurationSignal.value = dataToSend.minVideoWatchDuration
    activityRetentionPeriodSignal.value = dataToSend.activityRetentionPeriod
    llmApiKeySignal.value = dataToSend.llmApiKey
    llmApiUrlSignal.value = dataToSend.llmApiUrl
    categoriesSignal.value = dataToSend.categories

    reset(data)
  }

  const fields: FieldConfig[] = [
    {
      name: "calendarId",
      Component: CalendarIdField,
      type: 'text'
    },
    {
      name: "calendarEventPrefix",
      Component: CalendarEventPrefixField,
      type: 'text'
    },
    {
      name: "calendarSyncFrequency",
      Component: CalendarSyncFrequencyField,
      type: 'number'
    },
    {
      name: "videoResumeThreshold",
      Component: VideoResumeThresholdField,
      type: 'number'
    },
    {
      name: "minVideoWatchDuration",
      Component: MinVideoWatchDurationField,
      type: 'number'
    },
    {
      name: "activityRetentionPeriod",
      Component: ActivityRetentionPeriodField,
      type: 'number'
    },
    {
      name: "llmApiKey",
      Component: LLMApiKeyField,
      type: 'text'
    },
    {
      name: "llmApiUrl",
      Component: LLMApiUrlField,
      type: 'text'
    },
    {
      name: "categories",
      Component: CategoriesField,
      type: 'categories'
    },
  ]

  return (
    <Box style={{ position: 'relative', minHeight: '100%' }}>
      <Stack my={10} pb={60}>
        {fields.map(({ name, Component, type }) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
              if (type === 'categories') {
                return (
                  <Component
                    value={field.value as Category[]}
                    onChange={field.onChange}
                    error={error?.message}
                    disabled={isSubmitting}
                  />
                )
              }
              
              return (
                <Component {...field} error={error?.message} disabled={isSubmitting} />
              )
            }}
          />
        ))}
      </Stack>

      <Box
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          padding: "10px 16px",
          background: "#282828",
        }}
      >
        <Button
          fullWidth
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isDirty}
          loading={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  )
}
