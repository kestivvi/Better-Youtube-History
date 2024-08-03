export type EventInfo = {
  summary: string
  description: string
  startTime: string
  endTime: string
}

export async function addEventToCalendar(
  calendarId: string,
  eventInfo: EventInfo,
  providerToken: string,
): Promise<boolean> {
  console.debug("[addEventToGoogleCalendar] Adding to calendar", eventInfo)
  console.debug("[addEventToGoogleCalendar] Calendar ID", calendarId)
  console.debug("[addEventToGoogleCalendar] Provider token", providerToken)

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${providerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: eventInfo.summary,
        description: eventInfo.description,
        start: {
          dateTime: eventInfo.startTime,
          timeZone: "UTC",
        },
        end: {
          dateTime: eventInfo.endTime,
          timeZone: "UTC",
        },
      }),
    },
  )

  if (!response.ok) {
    const error = await response.text()
    console.error("[addEventToGoogleCalendar] Error adding to calendar", error)
    return false
  }

  const data = await response.json()
  console.debug("[addEventToGoogleCalendar] Added to calendar", data)

  return true
}
