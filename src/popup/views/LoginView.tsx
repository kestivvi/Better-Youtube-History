import { Button, Flex, Text } from '@mantine/core'
import { SupabaseClient } from '@supabase/supabase-js'
import { IconBrandGoogleFilled } from '@tabler/icons-react'
import { useSupabase } from '../Providers/SubapabaseProvider'

const manifest = chrome.runtime.getManifest()

export default function () {
  const supabase = useSupabase()

  return (
    <>
      <Flex
        style={{
          width: '100vw',
          height: '70vh',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <Text
          fw={900}
          variant="gradient"
          gradient={{ from: 'red', to: 'yellow', deg: 60 }}
          style={{
            fontSize: 25,
          }}
        >
          Better Youtube History
        </Text>
        <Button
          onClick={() => {
            loginWithGoogle(supabase)
          }}
          leftSection={<IconBrandGoogleFilled />}
        >
          Login with Google
        </Button>
      </Flex>
    </>
  )
}

/**
 * Method used to login with google provider.
 */
export async function loginWithGoogle(supabase: SupabaseClient) {
  const redirectTo = chrome.identity.getRedirectURL()
  console.log('redirecting to', redirectTo)

  console.log('manifest.oauth2!.scopes!.join', manifest.oauth2!.scopes!.join(' '))
  console.log('manifest.oauth2!.client_id', manifest.oauth2!.client_id)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        client_id: manifest.oauth2!.client_id,
        response_type: 'code',
        scope: manifest.oauth2!.scopes!.join(' '),
        access_type: 'offline',
        prompt: 'consent',
        include_granted_scopes: 'true',
      },
    },
  })
  if (error) throw error
  await chrome.tabs.create({ url: data.url })
}
