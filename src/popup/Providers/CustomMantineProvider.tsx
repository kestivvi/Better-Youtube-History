import { ColorSchemeScript, colorsTuple, createTheme, MantineProvider } from '@mantine/core'
import { ReactNode } from 'react'

const theme = createTheme({
  colors: {
    MyRed: colorsTuple('#bc3908'),
    MyYellow: colorsTuple('#f6aa1c'),
    ytBg: colorsTuple('#282828'),
  },
  primaryColor: 'MyRed',
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
