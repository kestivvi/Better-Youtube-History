import { fetchGoogleCalendar } from './fetchGoogleCalendar'

export async function validateGoogleCalendar(
  calendarId: string,
  providerToken: string,
): Promise<boolean> {
  if (!calendarId) return false
  const response = await fetchGoogleCalendar(calendarId, providerToken)
  return response.status === 200
}
