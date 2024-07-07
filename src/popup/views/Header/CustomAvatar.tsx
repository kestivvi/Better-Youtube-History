import { Text, Box, Avatar, Popover, Button } from '@mantine/core'
import { useSession } from '../../Providers/SessionProvider/SessionContext'
import { IconLogout2 } from '@tabler/icons-react'
import { useMemo } from 'react'
import { useSupabase } from '../../Providers/SubapabaseProvider'

export default function () {
  const supabase = useSupabase()
  const { session, setSession, setSessionState } = useSession()

  const logout = useMemo(
    () => async () => {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('signOut error', error)
        return
      }

      chrome.storage.local.remove('session')
      chrome.storage.local.remove('provider_token')
      setSession(null)
      setSessionState('NOT_LOGGED_IN')
    },
    [setSession],
  )

  return (
    <Box>
      <Popover width={200} position="bottom" shadow="md">
        <Popover.Target>
          <Avatar
            src={session?.user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/300'}
            alt="Avatar"
            radius="xl"
            size="md"
            style={{ cursor: 'pointer' }}
          />
        </Popover.Target>
        <Popover.Dropdown p={4}>
          <Box p={4}>
            <Text>{session?.user?.user_metadata?.full_name}</Text>

            <Text size="sm" fw={600}>
              {session?.user?.email}
            </Text>
          </Box>

          <Button
            leftSection={<IconLogout2 />}
            onClick={() => logout()}
            variant="subtle"
            fullWidth
            justify="flex-start"
            m={0}
            p={0}
            c="white"
          >
            Log out
          </Button>
        </Popover.Dropdown>
      </Popover>
    </Box>
  )
}
