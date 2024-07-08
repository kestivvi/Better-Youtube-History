import { providerTokenSignal } from '@/shared/state/auth/tokens/providerToken'
import { VideoEventDocType } from '../database/collections/VideoEvent/schema'
import { calendarIdSignal } from '@/shared/state/calendarId'

export async function addEventToGoogleCalendar(
  videoEvent: VideoEventDocType,
  googleCalendarEventPrefix: string,
): Promise<{ error: string | null }> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarIdSignal.value}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${providerTokenSignal.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `${googleCalendarEventPrefix}${videoEvent.title}`,
        description: `https://www.youtube.com/watch?v=${videoEvent.videoId}\nChannel: ${videoEvent.channel}`,
        start: {
          dateTime: videoEvent.startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: videoEvent.endTime,
          timeZone: 'UTC',
        },
      }),
    },
  )

  // Handle error
  if (!response.ok) {
    const error = await response.text()
    return { error }
  }

  const data = await response.json()
  console.log('Add to calendar', data)

  return { error: null }
}
