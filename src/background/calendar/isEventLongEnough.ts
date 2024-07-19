import dayjs from "dayjs"
import { VideoEventDocType } from "../database/collections/VideoEvent/schema"

export function isEventLongEnough(
  event: VideoEventDocType,
  duration: dayjs.OpUnitType,
  minDuration: number,
) {
  let started = dayjs(event.startTime)
  let ended = dayjs(event.endTime)
  let lasted = ended.diff(started, duration)
  return lasted >= minDuration
}
