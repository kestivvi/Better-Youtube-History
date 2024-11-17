import { type MyDatabase, database } from "@/background/database"
import type { VideoEventDocType } from "@/background/database/collections/VideoEvent/schema"
import { videoResumeThresholdSignal } from "@/shared/state/calendar/videoResumeThreshold"
import { currentlyPlayedVideosSignal } from "@/shared/state/video/currentlyPlayedVideos"
import { minVideoWatchDurationSignal } from "@/shared/state/calendar/minVideoWatchDuration"
import dayjs from "dayjs"
import type { RxDocument } from "rxdb"
import type { OnMessageListener, VideoPlayingMessage } from "../types"
import { CategoryService, CategoryServiceConfig } from "@/background/calendar/CategoryService"
import { categoriesSignal, llmApiUrlSignal, llmApiKeySignal } from "@/shared/state/calendar/categoryConfig"

export class VideoPlayingHandler {
  private readonly categoryService: CategoryService

  constructor(
    private readonly db: MyDatabase,
    private readonly categoryConfig: CategoryServiceConfig
  ) {
    this.categoryService = new CategoryService(categoryConfig)
  }

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
    // First, get the fresh document
    const freshDoc = await this.db.videos_events.findOne(lastVideoEvent.id).exec()
    if (!freshDoc) {
      console.error('Document no longer exists:', lastVideoEvent.id)
      return
    }

    // Update endTime
    await freshDoc.patch({ endTime: timestamp })
    
    // Recheck duration with fresh document
    const timeWatched = dayjs(timestamp).diff(dayjs(freshDoc.startTime), "seconds")
    const minDurationExceeded = timeWatched >= minVideoWatchDurationSignal.value
    
    if (minDurationExceeded && !freshDoc.category) {
      const videoInfo = {
        title: freshDoc.title,
        channelName: freshDoc.channelName,
        channelUrl: freshDoc.channelUrl,
        videoId: freshDoc.videoId,
        description: freshDoc.description
      }
      
      const category = await this.categoryService.categorizeVideo(videoInfo)
      if (category) {
        // Get fresh document again before category update
        const docToUpdate = await this.db.videos_events.findOne(lastVideoEvent.id).exec()
        if (docToUpdate) {
          await docToUpdate.patch({
            category: category.name,
            categoryType: category.type
          })
        }
      }
    }

    // Get final state for signal update
    const finalDoc = await this.db.videos_events.findOne(lastVideoEvent.id).exec()
    if (finalDoc) {
      currentlyPlayedVideosSignal.value = currentlyPlayedVideosSignal.value.map((v) =>
        v.id === finalDoc.id 
          ? { 
              ...v, 
              endTime: finalDoc.endTime,
              category: finalDoc.category,
              categoryType: finalDoc.categoryType
            } 
          : v,
      )
    }
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

  const categoryConfig = {
    categoriesSignal,
    llmApiUrlSignal,
    apiKeySignal: llmApiKeySignal
  }

  const handler = new VideoPlayingHandler(database, categoryConfig)
  await handler.handleVideoEvent(message)
}
