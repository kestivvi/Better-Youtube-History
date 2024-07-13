import { createSignal } from '../createSignal'

export type CurrentlyPlayedVideoType = {
  id: string
  title: string
  channel: string
  channelUrl: string
  startTime: string
  endTime: string
  uploaded: boolean
}

export const DEFAULT_CURRENTLY_PLAYED_VIDEOS: CurrentlyPlayedVideoType[] = []

export const { currentlyPlayedVideosSignal } = createSignal(
  'currentlyPlayedVideos',
  DEFAULT_CURRENTLY_PLAYED_VIDEOS,
)
