import { Container, Title } from "@mantine/core"
import { useEffect } from "react"

export default function () {
  useEffect(() => {
    window.location.href = "https://www.youtube.com/"
  }, [])

  return (
    <Container
      style={{
        height: "100vh",
        width: "100vw",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Title order={1}>Redirecting to Youtube...</Title>
    </Container>
  )
}
