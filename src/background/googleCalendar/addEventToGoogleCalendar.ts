import { providerTokenSignal } from '@/shared/state/auth/tokens/providerToken'
import { VideoEventDocType } from '../database/collections/VideoEvent/schema'

export async function addEventToGoogleCalendar(
  videoEvent: VideoEventDocType,
  googleCalendarEventPrefix: string,
): Promise<{ error: string | null }> {
  const { calendarId } = await chrome.storage.local.get('calendarId')

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
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
