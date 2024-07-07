import { ReactNode } from 'react'
import CustomMantineProvider from './CustomMantineProvider'
import SessionProvider from './SessionProvider'
import SubapabaseProvider from './SubapabaseProvider'

type Props = {
  children: ReactNode
}

export default function ({ children }: Props) {
  return (
    <SubapabaseProvider>
      <CustomMantineProvider>
        <SessionProvider>{children}</SessionProvider>
      </CustomMantineProvider>
    </SubapabaseProvider>
  )
}
