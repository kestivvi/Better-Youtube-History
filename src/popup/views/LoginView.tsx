import { Button, Flex, Text } from "@mantine/core"
import { IconBrandGoogleFilled } from "@tabler/icons-react"
import { supabaseSignal } from "@/shared/state/supabase"
import { loginWithGoogle } from "@/shared/auth/login/loginWithGoogle"

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
          variant="gradient"
          gradient={{ from: "red", to: "MyYellow", deg: 60 }}
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
