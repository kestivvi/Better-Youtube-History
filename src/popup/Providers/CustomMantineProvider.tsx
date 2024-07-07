import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core'
import { ReactNode } from 'react'

const theme = createTheme({
  primaryColor: 'red',
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
