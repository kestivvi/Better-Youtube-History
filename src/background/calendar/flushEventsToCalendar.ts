import { MyDatabase } from '../database'
import { queryEventsInBounds } from './queryEventsInBounds'
import { isEventLongEnough } from './isEventLongEnough'
import { prepareEventInfo } from './prepareEventInfo'
import dayjs from 'dayjs'
import { addEventToCalendar } from '@/shared/calendar/addEventToCalendar'

export const flushEventsToCalendar = async (
  database: MyDatabase,
  queryStartTime: string,
  queryEndTime: string,
  minEventDurationSeconds: number,
  calendarEventPrefix: string,
  calendarId: string,
  providerToken: string,
) => {
  const events = await queryEventsInBounds(database, queryStartTime, queryEndTime)
  console.debug(
    `Found ${events.length} events in bounds`,
    events.flatMap((event) => dayjs(event.endTime).diff(event.startTime, 'minute')),
  )

  const longEnoughEvents = events.filter((event) =>
    isEventLongEnough(event, 'seconds', minEventDurationSeconds),
  )
  console.debug(`Found ${longEnoughEvents.length} events to flush to Calendar`, longEnoughEvents)

  for (const videoEvent of longEnoughEvents) {
    const eventInfo = prepareEventInfo(videoEvent, calendarEventPrefix)
    const added = await addEventToCalendar(calendarId, eventInfo, providerToken)
    if (added) {
      await videoEvent.patch({ uploaded: true })
    }
  }
}
