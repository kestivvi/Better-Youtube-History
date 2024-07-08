import { Text, Box, Avatar, Popover, Button } from '@mantine/core'
import { IconLogout2 } from '@tabler/icons-react'
import { sessionSignal, sessionStateSignal } from '@/shared/state/auth/session'
import { supabaseSignal } from '@/shared/state/supabase'
import { providerTokenSignal } from '@/shared/state/auth/tokens/providerToken'
import { providerRefreshTokenSignal } from '@/shared/state/auth/tokens/providerRefreshToken'

const logout = async () => {
  const { error } = await supabaseSignal.value.auth.signOut()

  if (error) {
    console.error('signOut error', error)
    return
  }

  sessionSignal.value = null
  providerTokenSignal.value = null
  providerRefreshTokenSignal.value = null
  sessionStateSignal.value = 'NOT_LOGGED_IN'
}

export default function () {
  return (
    <Box>
      <Popover width={200} position="bottom" shadow="md">
        <Popover.Target>
          <Avatar
            src={
              sessionSignal.value?.user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/300'
            }
            alt="Avatar"
            radius="xl"
            size="md"
            style={{ cursor: 'pointer' }}
          />
        </Popover.Target>
        <Popover.Dropdown p={4}>
          <Box p={4}>
            <Text>{sessionSignal.value?.user?.user_metadata?.full_name}</Text>

            <Text size="sm" fw={600}>
              {sessionSignal.value?.user?.email}
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
