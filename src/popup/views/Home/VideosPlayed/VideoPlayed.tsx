import { minVideoWatchDurationSignal } from '@/shared/state/calendar/minVideoWatchDuration'
import { CurrentlyPlayedVideoType } from '@/shared/state/video/currentlyPlayedVideos'
import { Group, Text, Timeline, Tooltip } from '@mantine/core'
import { effect, useComputed, useSignal } from '@preact/signals-react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { getBullet } from './getBullet'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IconHourglassFilled } from '@tabler/icons-react'

dayjs.extend(duration)
dayjs.extend(relativeTime)

type Props = {
  videoPlayed: CurrentlyPlayedVideoType
  last: boolean
}

export type State = 'UNDER_MIN_DURATION' | 'MIN_DURATION_FULLFILLED' | 'UPLOADED'

const secondsToHms = (timeInSeconds: number) => dayjs.duration(timeInSeconds, 'seconds').humanize()

export default function ({ videoPlayed, last }: Props) {
  const state = useComputed<State>(() => {
    if (videoPlayed.uploaded) return 'UPLOADED'

    const timeWatched = dayjs(videoPlayed.endTime).diff(dayjs(videoPlayed.startTime), 'seconds')
    const minDurationExceeded = timeWatched >= minVideoWatchDurationSignal.value

    if (minDurationExceeded) return 'MIN_DURATION_FULLFILLED'

    return 'UNDER_MIN_DURATION'
  })

  const howLongAgoSeconds = useSignal(dayjs().diff(dayjs(videoPlayed.endTime), 'second'))

  effect(() => {
    const interval = setInterval(() => {
      howLongAgoSeconds.value = dayjs().diff(dayjs(videoPlayed.endTime), 'second')
    }, 1000)

    return () => clearInterval(interval)
  })

  const howLongAgoFormatted = useComputed(() =>
    dayjs.duration(howLongAgoSeconds.value, 'seconds').humanize(),
  )

  const bullet = useComputed(() => getBullet(state.value))

  return (
    <Timeline.Item
      title={videoPlayed.title}
      bullet={bullet.value}
      lineVariant={last ? 'dashed' : 'solid'}
    >
      <Text size="xs" fw={600} c="#999" fs="italic" mb={5}>
        by {videoPlayed.channel}
      </Text>

      <Group justify="space-between">
        <Text size="xs" mt={4}>
          {howLongAgoSeconds.value < 10 ? 'Now' : <>{howLongAgoFormatted} ago</>}
        </Text>

        <Tooltip
          label={<Text size="xs">Having watched this video for this amount of time</Text>}
          withArrow
        >
          <Group align="center" gap={3}>
            <IconHourglassFilled size={12} />
            <Text size="xs">
              {secondsToHms(
                dayjs(videoPlayed.endTime).diff(dayjs(videoPlayed.startTime), 'seconds'),
              )}
            </Text>
          </Group>
        </Tooltip>
      </Group>
    </Timeline.Item>
  )
}
