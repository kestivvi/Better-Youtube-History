import {
  ColorSchemeScript,
  MantineProvider,
  colorsTuple,
  createTheme,
} from "@mantine/core"
import type { ReactNode } from "react"

const theme = createTheme({
  colors: {
    MyRed: colorsTuple("#bc3908"),
    MyYellow: colorsTuple("#f6aa1c"),
    ytBg: colorsTuple("#282828"),
  },
  primaryColor: "MyRed",
})

type Props = {
  children: ReactNode
}

export default function ({ children }: Props) {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />

      <MantineProvider theme={theme} defaultColorScheme="dark">
        {children}
      </MantineProvider>
    </>
  )
}
