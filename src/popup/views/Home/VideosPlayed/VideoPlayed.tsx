import { minVideoWatchDurationSignal } from '@/shared/state/calendar/minVideoWatchDuration'
import { CurrentlyPlayedVideoType } from '@/shared/state/video/currentlyPlayedVideos'
import { Group, Text, ThemeIcon, Timeline, Tooltip } from '@mantine/core'
import { useComputed } from '@preact/signals-react'
import { Icon, IconClock, IconProps, IconVideo } from '@tabler/icons-react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
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

const Bullet = ({
  label,
  Icon,
  color,
}: {
  label: string
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
  color: string
}) => {
  return (
    <Tooltip multiline label={<Text size="xs">{label}</Text>} withArrow>
      <ThemeIcon size={25} color={color} radius="xl">
        <Icon size={15} />
      </ThemeIcon>
    </Tooltip>
  )
}

export default function ({ videoPlayed, last }: Props) {
  const state = useComputed<State>(() => {
    if (videoPlayed.uploaded) return 'UPLOADED'
    const timeWatched = dayjs(videoPlayed.endTime).diff(dayjs(videoPlayed.startTime), 'seconds')
    const minDurationExceeded = timeWatched >= minVideoWatchDurationSignal.value
    if (minDurationExceeded) return 'MIN_DURATION_FULLFILLED'
    return 'UNDER_MIN_DURATION'
  })

  const bullet = useComputed(() => {
    if (state.value === 'UNDER_MIN_DURATION')
      return (
        <Bullet
          label="You haven't watched this video for the minimum duration yet. Keep watching and an event will end up in your calendar."
          Icon={IconClock}
          color="blue"
        />
      )
    if (state.value === 'MIN_DURATION_FULLFILLED')
      return (
        <Bullet
          label="You've been watching this video for more than the minimum duration. When you stop watching, the event will be created in your calendar."
          Icon={IconVideo}
          color="green"
        />
      )
    return (
      <Bullet
        label="Event has been created in your calendar."
        Icon={IconCalendarCheck}
        color="blue"
      />
    )
  })

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
