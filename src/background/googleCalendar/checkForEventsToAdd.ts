import { MyDatabase } from '../database'
import { addEventToGoogleCalendar } from './addEventToGoogleCalendar'

export async function checkForEventsToAdd(
  database: MyDatabase | null,
  googleCalendarEventPrefix: string,
) {
  console.log('syncing google calendar ...')

  if (!database) {
    console.error('Database not initialized.')
    return
  }

  const current_time = new Date()
  const current_time_minus_5_minutes = new Date(
    current_time.getTime() - 5 * 60 * 1000,
  ).toISOString()

  const current_time_minus_one_week = new Date(
    current_time.getTime() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString()

  console.log('current_time', current_time)
  console.log('current_time_minus_5_minutes', current_time_minus_5_minutes)
  console.log('current_time_minus_one_week', current_time_minus_one_week)

  const all = (await database?.videos_events.find().exec()).flatMap((x) => x.toJSON())
  console.log('all videos events', all)

  const result = await database?.videos_events
    .find({
      selector: {
        startTime: {
          $gte: current_time_minus_one_week,
        },
        endTime: {
          $lte: current_time_minus_5_minutes,
        },
        uploaded: {
          $ne: true,
        },
      },
    })
    .exec()

  const filtered = result.filter((x) => {
    const lasted = new Date(x.endTime).getTime() - new Date(x.startTime).getTime()
    return lasted > 5 * 60 * 1000
  })

  console.log('found videos events', result)
  console.log('filtered videos events', filtered)

  // Create google calendar events
  filtered.forEach(async (videoEvent) => {
    const { error } = await addEventToGoogleCalendar(videoEvent, googleCalendarEventPrefix)
    if (error) {
      console.error('error adding event to google calendar', videoEvent, error)
    } else {
      await videoEvent.patch({ uploaded: true })
    }
  })
}
