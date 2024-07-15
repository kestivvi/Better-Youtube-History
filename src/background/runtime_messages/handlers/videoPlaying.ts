import { type OnMessageListener, type VideoPlayingMessage } from '../types'
import { database } from '../../database'
import { currentlyPlayedVideosSignal } from '@/shared/state/video/currentlyPlayedVideos'
import { videoResumeThresholdSignal } from '@/shared/state/calendar/videoResumeThreshold'
import { VideoEventDocType } from '@/background/database/collections/VideoEvent/schema'

export const videoPlayingHandler: OnMessageListener<VideoPlayingMessage> = async (
  message,
  _sender,
  _sendResponse,
) => {
  if (!database) {
    console.error('Database not initialized.')
    return
  }

  const foundVideos = await database.videos_events
    .find({
      selector: {
        videoId: {
          $eq: message.data.videoInfo.videoId,
        },
      },
      sort: [{ startTime: 'desc' }],
      limit: 1,
    })
    .exec()

  console.log(
    'foundVideos',
    foundVideos.flatMap((v) => v.toJSON()),
  )

  if (foundVideos.length === 0) {
    console.log('Inserting new video event, because no video found.')

    const newVideo: VideoEventDocType = {
      id: `${message.data.timestamp}__${message.data.videoInfo.videoId}`,
      startTime: message.data.timestamp,
      endTime: message.data.timestamp,
      uploaded: false,
      ...message.data.videoInfo,
    }

    await database.videos_events.insert(newVideo)
    currentlyPlayedVideosSignal.value.push(newVideo)
  } else if (foundVideos.length > 0) {
    let foundVideo = foundVideos[0]!

    let time_difference_ms = Math.abs(
      new Date(foundVideo.endTime).getTime() - new Date(message.data.timestamp).getTime(),
    )

    if (time_difference_ms > videoResumeThresholdSignal.value * 1000) {
      console.log(`Inserting new video event, because time difference is big.`)

      const newVideo: VideoEventDocType = {
        id: `${message.data.timestamp}__${message.data.videoInfo.videoId}`,
        startTime: message.data.timestamp,
        endTime: message.data.timestamp,
        uploaded: false,
        ...message.data.videoInfo,
      }

      await database.videos_events.insert(newVideo)
      currentlyPlayedVideosSignal.value.push(newVideo)
    } else {
      console.log(`Patching video event with endTime.`)

      await foundVideo.patch({ endTime: message.data.timestamp })

      currentlyPlayedVideosSignal.value = currentlyPlayedVideosSignal.value.map((v) => {
        if (v.id === foundVideo.primary) {
          return { ...v, endTime: message.data.timestamp }
        } else {
          return v
        }
      })
    }
  }
}
