import { minVideoWatchDurationSignal } from "@/shared/state/calendar/minVideoWatchDuration"
import type { CurrentlyPlayedVideoType } from "@/shared/state/video/currentlyPlayedVideos"
import { Group, Text, Timeline, Tooltip } from "@mantine/core"
import { useComputed } from "@preact/signals-react"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { getBullet } from "./getBullet"
import relativeTime from "dayjs/plugin/relativeTime"
import { IconHourglassFilled } from "@tabler/icons-react"
import VideoWatchTime from "./VideoWatchTime"

dayjs.extend(duration)
dayjs.extend(relativeTime)

type Props = {
  videoPlayed: CurrentlyPlayedVideoType
  last: boolean
}

export type State = "UNDER_MIN_DURATION" | "MIN_DURATION_FULLFILLED" | "UPLOADED"

const secondsToHms = (timeInSeconds: number) =>
  dayjs.duration(timeInSeconds, "seconds").humanize()

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

  return (
    <Timeline.Item
      title={videoPlayed.title}
      bullet={bullet.value}
      lineVariant={last ? "dashed" : "solid"}
    >
      {/* TODO: Hardcoded color */}
      <Text size="xs" fw={600} c="#999" fs="italic" mb={5}>
        by {videoPlayed.channelName}
      </Text>

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
