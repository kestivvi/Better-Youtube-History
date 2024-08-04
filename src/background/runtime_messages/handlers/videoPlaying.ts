import { type MyDatabase, database } from "@/background/database"
import type { VideoEventDocType } from "@/background/database/collections/VideoEvent/schema"
import { videoResumeThresholdSignal } from "@/shared/state/calendar/videoResumeThreshold"
import { currentlyPlayedVideosSignal } from "@/shared/state/video/currentlyPlayedVideos"
import type { Signal } from "@preact/signals-react"
import dayjs from "dayjs"
import type { RxDocument } from "rxdb"
import type { OnMessageListener, VideoInfo, VideoPlayingMessage } from "../types"

async function findLastVideoById(
  database: MyDatabase,
  videoId: string,
): Promise<RxDocument<VideoEventDocType> | undefined> {
  try {
    const [foundVideo] = await database.videos_events
      .find({
        selector: { videoId },
        sort: [{ startTime: "desc" }],
        limit: 1,
      })
      .exec()

    return foundVideo
  } catch (error) {
    console.error("Error finding the last video by ID:", error)
    return undefined
  }
}

async function insertNewVideoEvent(
  database: MyDatabase,
  videoInfo: VideoInfo,
  timestamp: string,
  signal: Signal<VideoEventDocType[]>,
): Promise<void> {
  const newVideo: VideoEventDocType = {
    id: `${timestamp}__${videoInfo.videoId}`,
    startTime: timestamp,
    endTime: timestamp,
    uploaded: false,
    ...videoInfo,
  }

  try {
    await database.videos_events.insert(newVideo)
    signal.value = [...signal.value, newVideo]
  } catch (error) {
    console.error("Error inserting new video event:", error)
  }
}

async function patchVideoEvent(
  video: RxDocument<VideoEventDocType>,
  timestamp: string,
  signal: Signal<VideoEventDocType[]>,
) {
  try {
    await video.patch({ endTime: timestamp })
    signal.value = signal.value.map((v) =>
      v.id === video.primary ? { ...v, endTime: timestamp } : v,
    )
  } catch (error) {
    console.error("Error patching video event:", error)
  }
}

export const videoPlayingHandler: OnMessageListener<VideoPlayingMessage> = async (
  message,
  _sender,
  _sendResponse,
) => {
  // If the database is not initialized, we can't do anything
  if (!database) return console.error("Database not initialized.")

  const { timestamp, videoInfo } = message.data

  // Find the last played video by videoId
  const foundVideo = await findLastVideoById(database, videoInfo.videoId)

  if (!foundVideo) {
    await insertNewVideoEvent(database, videoInfo, timestamp, currentlyPlayedVideosSignal)
  } else {
    const endTime = dayjs(foundVideo.endTime)
    const timestampTime = dayjs(timestamp)
    const time_difference = timestampTime.diff(endTime, "seconds")

    if (time_difference > videoResumeThresholdSignal.value) {
      await insertNewVideoEvent(
        database,
        videoInfo,
        timestamp,
        currentlyPlayedVideosSignal,
      )
    } else {
      await patchVideoEvent(foundVideo, timestamp, currentlyPlayedVideosSignal)
    }
  }
}
