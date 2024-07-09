import { ColorSchemeScript, colorsTuple, createTheme, MantineProvider } from '@mantine/core'
import { ReactNode } from 'react'

const theme = createTheme({
  colors: {
    ytRed: colorsTuple('#F00'),
    ytBg: colorsTuple('#282828'),
  },
  primaryColor: 'ytRed',
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
