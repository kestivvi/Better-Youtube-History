import { type MyDatabase, database } from "@/background/database"
import type { VideoEventDocType } from "@/background/database/collections/VideoEvent/schema"
import { videoResumeThresholdSignal } from "@/shared/state/calendar/videoResumeThreshold"
import { currentlyPlayedVideosSignal } from "@/shared/state/video/currentlyPlayedVideos"
import dayjs from "dayjs"
import type { RxDocument } from "rxdb"
import type { OnMessageListener, VideoPlayingMessage } from "../types"

export class VideoPlayingHandler {
  constructor(private readonly db: MyDatabase) {}

  async handleVideoEvent(message: VideoPlayingMessage): Promise<void> {
    try {
      const { timestamp, videoInfo } = message.data

      const lastVideoEvent = await this.getLastVideoEvent(videoInfo.videoId)
      const timeSinceLastEvent = lastVideoEvent
        ? dayjs(timestamp).diff(dayjs(lastVideoEvent.endTime), "seconds")
        : Number.POSITIVE_INFINITY

      const shouldCreateNew =
        !lastVideoEvent || timeSinceLastEvent > videoResumeThresholdSignal.value

      if (shouldCreateNew) {
        await this.createNewVideoEvent(timestamp, videoInfo)
      } else {
        await this.updateExistingVideoEvent(lastVideoEvent, timestamp)
      }
    } catch (error) {
      console.error("Error handling video playing event:", error)
    }
  }

  private async getLastVideoEvent(
    videoId: string,
  ): Promise<RxDocument<VideoEventDocType> | null> {
    const [lastVideoEvent] = await this.db.videos_events
      .find({
        selector: { videoId },
        sort: [{ startTime: "desc" }],
        limit: 1,
      })
      .exec()

    return lastVideoEvent || null
  }

  private async createNewVideoEvent(
    timestamp: string,
    videoInfo: VideoPlayingMessage["data"]["videoInfo"],
  ): Promise<void> {
    const newVideo: VideoEventDocType = {
      id: `${timestamp}__${videoInfo.videoId}`,
      startTime: timestamp,
      endTime: timestamp,
      uploaded: false,
      videoId: videoInfo.videoId,
      title: videoInfo.title,
      channelName: videoInfo.channelName,
      channelUrl: videoInfo.channelUrl,
      description: videoInfo.description,
    }

    await this.db.videos_events.insert(newVideo)
    currentlyPlayedVideosSignal.value = [...currentlyPlayedVideosSignal.value, newVideo]
  }

  private async updateExistingVideoEvent(
    lastVideoEvent: RxDocument<VideoEventDocType>,
    timestamp: string,
  ): Promise<void> {
    await lastVideoEvent.patch({ endTime: timestamp })
    currentlyPlayedVideosSignal.value = currentlyPlayedVideosSignal.value.map((v) =>
      v.id === lastVideoEvent.id ? { ...v, endTime: timestamp } : v,
    )
  }
}

export const handleVideoPlaying: OnMessageListener<VideoPlayingMessage> = async (
  message,
  _sender,
  _sendResponse,
) => {
  if (!database) {
    console.error("Database not initialized.")
    return
  }

  const handler = new VideoPlayingHandler(database)
  await handler.handleVideoEvent(message)
}
