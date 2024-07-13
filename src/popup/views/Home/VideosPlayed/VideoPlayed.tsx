import { minVideoWatchDurationSignal } from '@/shared/state/calendar/minVideoWatchDuration'
import { CurrentlyPlayedVideoType } from '@/shared/state/video/currentlyPlayedVideos'
import { Group, Text, Timeline } from '@mantine/core'
import { useComputed } from '@preact/signals-react'
import { IconClock, IconVideo } from '@tabler/icons-react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useMemo } from 'react'
import { IconCalendarCheck } from '@tabler/icons-react'
dayjs.extend(duration)

type Props = {
  videoPlayed: CurrentlyPlayedVideoType
  last: boolean
}

type State = 'UNDER_MIN_DURATION' | 'MIN_DURATION_FULLFILLED' | 'UPLOADED'

const secondsToHms = (d: number) => {
  const duration = dayjs.duration(d, 'seconds')
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()

  return [hours > 0 ? `${hours}h` : '', minutes > 0 ? `${minutes}m` : '', `${seconds}s`]
    .filter(Boolean)
    .join('')
}

export default function ({ videoPlayed, last }: Props) {
  const state = useComputed<State>(() => {
    const timeWatched = dayjs(videoPlayed.endTime).diff(dayjs(videoPlayed.startTime), 'seconds')
    const minDurationExceeded = timeWatched >= minVideoWatchDurationSignal.value
    if (minDurationExceeded) return 'MIN_DURATION_FULLFILLED'
    if (videoPlayed.uploaded) return 'UPLOADED'
    return 'UNDER_MIN_DURATION'
  })

  const bullet = useMemo(() => {
    if (state.value === 'UNDER_MIN_DURATION') return <IconClock size="0.8rem" />
    if (state.value === 'MIN_DURATION_FULLFILLED') return <IconVideo size="0.8rem" />
    return <IconCalendarCheck size="0.8rem" />
  }, [])

  return (
    <Timeline.Item
      title={videoPlayed.title}
      bullet={bullet}
      lineVariant={last ? 'dashed' : 'solid'}
    >
      <Text size="xs" fw={600} c="#999" fs="italic" mb={5}>
        by {videoPlayed.channel}
      </Text>

      <Text c="dimmed" size="sm">
        {videoPlayed.uploaded && <>Uploaded</>}
        {state}
      </Text>

      <Group justify="space-between">
        <Text size="xs" mt={4}>
          {dayjs(dayjs()).diff(videoPlayed.endTime, 'seconds') < 10 ? (
            'Now'
          ) : (
            <>{secondsToHms(dayjs().diff(dayjs(videoPlayed.endTime), 'second'))} ago</>
          )}
        </Text>

        <Text size="xs" mt={4}>
          {secondsToHms(dayjs(videoPlayed.endTime).diff(dayjs(videoPlayed.startTime), 'seconds'))}
        </Text>
      </Group>
    </Timeline.Item>
  )
}

// <ThemeIcon size={22} color="blue" radius="xl">
//   <IconVideo size="0.8rem" />
// </ThemeIcon>
