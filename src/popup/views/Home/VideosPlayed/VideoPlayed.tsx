import type { CategoryType } from "@/background/calendar/CategoryService"
import { minVideoWatchDurationSignal } from "@/shared/state/calendar/minVideoWatchDuration"
import type { CurrentlyPlayedVideoType } from "@/shared/state/video/currentlyPlayedVideos"
import { Group, Text, Timeline, Tooltip } from "@mantine/core"
import { useComputed } from "@preact/signals-react"
import { IconHourglassFilled } from "@tabler/icons-react"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import VideoWatchTime from "./VideoWatchTime"
import { getBullet } from "./getBullet"

dayjs.extend(duration)
dayjs.extend(relativeTime)

type Props = {
  videoPlayed: CurrentlyPlayedVideoType
  last: boolean
}

export type State = "UNDER_MIN_DURATION" | "MIN_DURATION_FULLFILLED" | "UPLOADED"

const secondsToHms = (timeInSeconds: number) =>
  dayjs.duration(timeInSeconds, "seconds").humanize()

const getCategoryEmoji = (categoryType: CategoryType): string => {
  switch (categoryType) {
    case "positive":
      return "🟩"
    case "negative":
      return "🟥"
    case "neutral":
      return "🟦"
  }
}

const getCategoryInfluenceText = (categoryType: CategoryType): string => {
  switch (categoryType) {
    case "positive":
      return "Positive Activity"
    case "negative":
      return "Negative Activity"
    case "neutral":
      return "Neutral Activity"
  }
}

export default function ({ videoPlayed, last }: Props) {
  const state = useComputed<State>(() => {
    if (videoPlayed.uploaded) return "UPLOADED"

    const timeWatched = dayjs(videoPlayed.endTime).diff(
      dayjs(videoPlayed.startTime),
      "seconds",
    )
    const minDurationExceeded = timeWatched >= minVideoWatchDurationSignal.value

    if (minDurationExceeded) return "MIN_DURATION_FULLFILLED"

    return "UNDER_MIN_DURATION"
  })

  const bullet = useComputed(() => getBullet(state.value))

  const categoryInfo = useComputed(() => {
    if (!videoPlayed.category || !videoPlayed.categoryType) return null

    return {
      emoji: getCategoryEmoji(videoPlayed.categoryType),
      influence: getCategoryInfluenceText(videoPlayed.categoryType),
      name: videoPlayed.category,
    }
  })

  return (
    <Timeline.Item
      title={videoPlayed.title}
      bullet={bullet.value}
      lineVariant={last ? "dashed" : "solid"}
    >
      <Text size="xs" fw={600} c="#999" fs="italic" mb={5}>
        by {videoPlayed.channelName}
      </Text>

      {categoryInfo.value && (
        <Text size="xs" c="#666" mb={5}>
          {categoryInfo.value.emoji} {categoryInfo.value.name} (
          {categoryInfo.value.influence})
        </Text>
      )}

      <Group justify="space-between">
        <VideoWatchTime startTime={videoPlayed.startTime} endTime={videoPlayed.endTime} />

        <Tooltip
          label={<Text size="xs">Having watched this video for this amount of time</Text>}
          withArrow
        >
          <Group align="center" gap={3}>
            <IconHourglassFilled size={12} />
            <Text size="xs">
              {secondsToHms(
                dayjs(videoPlayed.endTime).diff(dayjs(videoPlayed.startTime), "seconds"),
              )}
            </Text>
          </Group>
        </Tooltip>
      </Group>
    </Timeline.Item>
  )
}
