import dayjs from "dayjs"
import type { VideoEventDocType } from "../database/collections/VideoEvent/schema"

export function isEventLongEnough(
  event: VideoEventDocType,
  duration: dayjs.OpUnitType,
  minDuration: number,
) {
  const started = dayjs(event.startTime)
  const ended = dayjs(event.endTime)
  const lasted = ended.diff(started, duration)
  return lasted >= minDuration
}
