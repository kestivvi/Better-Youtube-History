import { MyDatabase } from '../database'

export const queryEventsInBounds = async (
  database: MyDatabase,
  queryStartTime: string,
  queryEndTime: string,
) =>
  database?.videos_events
    .find({
      selector: {
        startTime: { $gte: queryStartTime },
        endTime: { $lte: queryEndTime },
        uploaded: { $ne: true },
      },
    })
    .exec()
