import type { ReactNode } from "react"
import CustomMantineProvider from "./CustomMantineProvider"

type Props = {
  children: ReactNode
}

export default function ({ children }: Props) {
  return <CustomMantineProvider>{children}</CustomMantineProvider>
}
