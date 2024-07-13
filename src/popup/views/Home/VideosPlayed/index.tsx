import { currentlyPlayedVideosSignal } from '@/shared/state/video/currentlyPlayedVideos'
import VideoPlayed from './VideoPlayed'
import { Stack, Timeline, Text } from '@mantine/core'
import { useComputed } from '@preact/signals-react'
import dayjs from 'dayjs'
import { minVideoWatchDurationSignal } from '@/shared/state/calendar/minVideoWatchDuration'
import { videoResumeThresholdSignal } from '@/shared/state/calendar/videoResumeThreshold'
import { useSignals } from '@preact/signals-react/runtime'

export default function () {
  useSignals()

  const videoFiltered = useComputed(() => {
    console.time('videoFiltered')
    const result = currentlyPlayedVideosSignal.value
      .filter((video) => {
        const inTheLast12Hours = dayjs(video.endTime).isAfter(dayjs().subtract(12, 'hour'))
        const resumeThresholdExceeded = dayjs(video.endTime).isBefore(
          dayjs().subtract(videoResumeThresholdSignal.value, 'second'),
        )
        const minDurationExceeded =
          dayjs(video.endTime).diff(dayjs(video.startTime), 'seconds') >=
          minVideoWatchDurationSignal.value
        return (
          inTheLast12Hours && (!resumeThresholdExceeded || minDurationExceeded || video.uploaded)
        )
      })
      .sort((a, b) => dayjs(b.endTime).diff(dayjs(a.endTime)))

    console.timeEnd('videoFiltered')

    return result
  })

  return (
    <Stack>
      <Timeline bulletSize={24} lineWidth={2}>
        {videoFiltered.value.map((video, index, array) => (
          <VideoPlayed key={video.id} videoPlayed={video} last={index === array.length - 1} />
        ))}

        <Timeline.Item
          title={
            <Text size="xs" fw={500} c="dimmed" pt={5}>
              Videos watched more than 12 hours ago are not displayed
            </Text>
          }
          styles={{
            itemBullet: {
              border: '2px dashed #444',
            },
          }}
        ></Timeline.Item>
      </Timeline>
    </Stack>
  )
}
