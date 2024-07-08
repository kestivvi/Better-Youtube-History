import { useEffect, useState } from 'react'
import { providerTokenSignal } from '@/shared/state/auth/tokens/providerToken'
import { supabaseSignal } from '@/shared/state/supabase'

export default function () {
  const [calendarExists, setCalendarExists] = useState<'YES' | 'NO' | 'LOADING'>('LOADING')

  useEffect(() => {
    ;(async () => {
      const query = await supabaseSignal.value.from('user_calendar_ids').select()
      console.log('[CalendarCheck] user_calendar_ids', query)

      if (query.data && query.data?.length > 0) {
        await chrome.storage.local.set({ calendarId: query.data[0].calendar_id })
        console.log('[CalendarCheck] set calendarId chrome storage', query.data[0].calendar_id)
      }

      const { calendarId } = await chrome.storage.local.get('calendarId')

      if (!calendarId) {
        setCalendarExists('NO')
        return
      }

      if (query.data && query.data.length === 0) {
        const y = await supabaseSignal.value
          .from('user_calendar_ids')
          .insert([{ calendar_id: calendarId }])
        console.log('[CalendarCheck] inserted calendar_id', y)
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}`,
        {
          headers: {
            Authorization: `Bearer ${providerTokenSignal.value}`,
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

  return (
    <>
      <p>Youtube History Calendar does not exist</p>
      <p>Create automatically new one: </p>
      <button
        onClick={async () => {
          const response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${providerTokenSignal.value}`,
            },
            body: JSON.stringify({
              summary: 'Youtube History',
              description: 'Calendar for Better Youtube History Extension\n\nDo not delete!',
            }),
          })

          const data = await response.json()
          console.log('[CalendarCheck] Create Youtube History Calendar', data)

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
