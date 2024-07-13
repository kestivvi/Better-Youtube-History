import { Tooltip, Text } from '@mantine/core'
import { useComputed } from '@preact/signals-react'
import dayjs from 'dayjs'

type Props = {
  startTime: string
  endTime: string
}

export default function VideoWatchTime({ startTime, endTime }: Props) {
  const isEndAndStartTheSameDay = useComputed(() => dayjs(startTime).isSame(dayjs(endTime), 'day'))
  const isItToday = useComputed(() => dayjs().isSame(dayjs(startTime), 'day'))
  const onlyTime = useComputed(() => isEndAndStartTheSameDay.value && isItToday.value)

  const watchedFrom = useComputed(() =>
    onlyTime.value ? dayjs(startTime).format('HH:mm') : dayjs(startTime).format('YYYY-MM-DD HH:mm'),
  )
  const watchedTo = useComputed(() =>
    onlyTime.value ? dayjs(endTime).format('HH:mm') : dayjs(endTime).format('YYYY-MM-DD HH:mm'),
  )

  const howLongAgoSeconds = useComputed(() => dayjs().diff(dayjs(endTime), 'second'))
  const watchingNow = useComputed(() => howLongAgoSeconds.value < 10)

  const howLongAgoFormatted = useComputed(() =>
    watchingNow.value
      ? 'Now'
      : `${dayjs.duration(howLongAgoSeconds.value, 'seconds').humanize()} ago`,
  )

  const tooltipLabel = useComputed(() => (
    <Text size="xs">
      {watchingNow.value ? (
        'You are watching it right now'
      ) : (
        <>
          Video was watched
          <br />
          from {watchedFrom}
          <br />
          to {watchedTo}
        </>
      )}
    </Text>
  ))

  return (
    <Tooltip multiline label={tooltipLabel}>
      <Text size="xs" mt={4}>
        {howLongAgoFormatted}
      </Text>
    </Tooltip>
  )
}
