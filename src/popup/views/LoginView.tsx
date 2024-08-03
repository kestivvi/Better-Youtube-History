import { loginWithGoogle } from "@/shared/auth/login/loginWithGoogle"
import { supabaseSignal } from "@/shared/state/supabase"
import { Button, Flex, Text } from "@mantine/core"
import { IconBrandGoogleFilled } from "@tabler/icons-react"

export default function () {
  return (
    <>
      <Flex
        style={{
          width: "100vw",
          height: "70vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Text
          fw={900}
          c="white"
          style={{
            fontSize: 25,
          }}
        >
          Better Youtube History
        </Text>
        <Button
          onClick={() => loginWithGoogle(supabaseSignal.value)}
          leftSection={<IconBrandGoogleFilled />}
        >
          Login with Google
        </Button>
      </Flex>
    </>
  )
}
