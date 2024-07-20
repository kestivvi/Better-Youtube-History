import { Container, Title } from "@mantine/core"

export const Home = () => {
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
      <Title order={1}>Better Youtube History</Title>
    </Container>
  )
}

export default Home
