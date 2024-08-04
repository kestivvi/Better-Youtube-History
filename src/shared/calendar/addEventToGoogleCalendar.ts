export type EventInfo = {
  summary: string
  description: string
  startTime: string
  endTime: string
}

export async function addEventToGoogleCalendar(
  calendarId: string,
  eventInfo: EventInfo,
  providerToken: string,
): Promise<boolean> {
  // The API URL for adding an event to a specified calendar
  const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`

  const headers = {
    Authorization: `Bearer ${providerToken}`,
    // The Google Calendar API requires the Content-Type to be application/json
    "Content-Type": "application/json",
  }

  const body = JSON.stringify({
    summary: eventInfo.summary,
    description: eventInfo.description,
    start: {
      dateTime: eventInfo.startTime,
      // Our events are always in UTC, so we set the timezone to UTC
      timeZone: "UTC",
    },
    end: {
      dateTime: eventInfo.endTime,
      timeZone: "UTC",
    },
  })

  // We use try/catch to handle network errors
  try {
    const response = await fetch(apiUrl, {
      // The Google Calendar API requires POST requests for adding events
      method: "POST",
      headers,
      body,
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[addEventToGoogleCalendar] Error adding to calendar:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[addEventToGoogleCalendar] Network error:", error)
    return false
  }
}
