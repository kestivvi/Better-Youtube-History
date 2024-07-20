import type { VideoEventDocType } from "../database/collections/VideoEvent/schema"

export const prepareEventInfo = (
  event: VideoEventDocType,
  calendarEventPrefix: string,
) => ({
  summary: `${calendarEventPrefix} ${event.title}`,
  description: `https://www.youtube.com/watch?v=${event.videoId}\nChannel: ${event.channelName}`,
  startTime: event.startTime,
  endTime: event.endTime,
})
