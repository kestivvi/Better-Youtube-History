import { addEventToGoogleCalendar } from '@/shared/calendar/addEventToGoogleCalendar'
import { MyDatabase } from '../database'
import { calendarIdSignal } from '@/shared/state/calendarId'
import { providerTokenSignal } from '@/shared/state/auth/tokens/providerToken'

export async function checkForEventsToAdd(database: MyDatabase, googleCalendarEventPrefix: string) {
  console.log('[checkForEventsToAdd] syncing google calendar ...')

  const current_time = new Date()
  const current_time_minus_5_minutes = new Date(
    current_time.getTime() - 5 * 60 * 1000,
  ).toISOString()

  const current_time_minus_one_week = new Date(
    current_time.getTime() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString()

  console.log('[checkForEventsToAdd] current_time', current_time)
  console.log('[checkForEventsToAdd] current_time_minus_5_minutes', current_time_minus_5_minutes)
  console.log('[checkForEventsToAdd] current_time_minus_one_week', current_time_minus_one_week)

  const all = (await database?.videos_events.find().exec()).flatMap((x) => x.toJSON())
  console.log('[checkForEventsToAdd] all videos events', all)

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

  console.log('[checkForEventsToAdd] found videos events', result)
  console.log('[checkForEventsToAdd] filtered videos events', filtered)

  // Create google calendar events
  filtered.forEach(async (videoEvent) => {
    if (!calendarIdSignal.value) {
      console.error('[checkForEventsToAdd] Calendar ID not set.')
      return
    }
    if (!providerTokenSignal.value) {
      console.error('[checkForEventsToAdd] Provider token not set.')
      return
    }

    const added = await addEventToGoogleCalendar(
      calendarIdSignal.value,
      {
        summary: `${googleCalendarEventPrefix}${videoEvent.title}`,
        description: `https://www.youtube.com/watch?v=${videoEvent.videoId}\nChannel: ${videoEvent.channel}`,
        startTime: videoEvent.startTime,
        endTime: videoEvent.endTime,
      },
      providerTokenSignal.value,
    )

    if (added) await videoEvent.patch({ uploaded: true })
  })
}
