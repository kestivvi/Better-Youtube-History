import { useEffect, useState } from 'react'
import { getProviderToken } from '../../background/auth/getProviderToken'

export default function () {
  const [calendarExists, setCalendarExists] = useState<'YES' | 'NO' | 'LOADING'>('LOADING')

  useEffect(() => {
    ;(async () => {
      const { calendarId } = await chrome.storage.local.get('calendarId')

      if (!calendarId) {
        setCalendarExists('NO')
        return
      }

      const provider_token = await getProviderToken()

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}`,
        {
          headers: {
            Authorization: `Bearer ${provider_token}`,
          },
        },
      )

      if (response.status === 200) {
        setCalendarExists('YES')
      } else {
        setCalendarExists('NO')
      }
    })()
  }, [])

  if (calendarExists === 'LOADING') {
    return <p>Loading calendar state...</p>
  }

  if (calendarExists === 'YES') {
    return <p>Youtube History Calendar exists</p>
  }

  if (calendarExists === 'NO') {
    return (
      <>
        <p>Youtube History Calendar does not exist</p>
        <p>Create automatically new one: </p>
        <button
          onClick={async () => {
            const provider_token = await getProviderToken()

            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${provider_token}`,
              },
              body: JSON.stringify({
                summary: 'Youtube History',
                description: 'Calendar for Better Youtube History Extension\n\nDo not delete!',
              }),
            })

            const data = await response.json()
            console.log('Create Youtube History Calendar', data)

            chrome.storage.local.set({ calendarId: data.id })
            setCalendarExists('YES')
          }}
        >
          Create Youtube History Calendar
        </button>

        <br />
        <p>Or type in ID of existing calendar here:</p>
        <input type="text" id="calendarId" />
        <button
          onClick={async () => {
            const calendarId = (document.getElementById('calendarId') as HTMLInputElement).value
            chrome.storage.local.set({ calendarId })
            setCalendarExists('YES')
          }}
        >
          Use existing calendar
        </button>
      </>
    )
  }
}
