import { type OnMessageListener, type VideoPlayingMessage } from '../types'
import { database } from '../../database'

const TIME_DIFFERENCE_THRESHOLD_MINUTES = 5

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
    })
    .exec()

  if (foundVideos.length === 0) {
    console.log('Inserting new video event, because no video found.')
    await database.videos_events.insert({
      id: `${message.data.timestamp}__${message.data.videoInfo.videoId}`,
      videoId: message.data.videoInfo.videoId,
      title: message.data.videoInfo.title,
      channel: message.data.videoInfo.channel,
      channelUrl: message.data.videoInfo.channelUrl,
      startTime: message.data.timestamp,
      endTime: message.data.timestamp,
    })
  } else if (foundVideos.length > 0) {
    let foundVideo = foundVideos[0]!

    let time_difference_ms = Math.abs(
      new Date(foundVideo.endTime).getTime() - new Date(message.data.timestamp).getTime(),
    )

    if (time_difference_ms > TIME_DIFFERENCE_THRESHOLD_MINUTES * 60 * 1000) {
      console.log(`Inserting new video event, because time difference is big.`)
      await database.videos_events.insert({
        id: `${message.data.timestamp}__${message.data.videoInfo.videoId}`,
        videoId: message.data.videoInfo.videoId,
        title: message.data.videoInfo.title,
        channel: message.data.videoInfo.channel,
        channelUrl: message.data.videoInfo.channelUrl,
        startTime: message.data.timestamp,
        endTime: message.data.timestamp,
      })
    } else {
      console.log(`Patching video event with endTime.`)
      const video = foundVideo
      await video.patch({
        endTime: message.data.timestamp,
      })
    }
  }
}
