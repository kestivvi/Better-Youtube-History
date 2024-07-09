export async function fetchGoogleCalendar(calendarId: string, providerToken: string) {
  return await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}`, {
    headers: { Authorization: `Bearer ${providerToken}` },
  })
}
