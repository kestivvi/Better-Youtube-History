export async function createNewCalendar(
  calendarName: string,
  providerToken: string,
): Promise<{ newCalendarId: string }> {
  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${providerToken}`,
    },
    body: JSON.stringify({
      summary: calendarName,
      description: "Calendar for Better Youtube History Extension\n\nDo not delete!",
    }),
  })

  const data = await response.json()
  console.log("[SetCalendarView] Create Youtube History Calendar", data)

  return { newCalendarId: data.id }
}
