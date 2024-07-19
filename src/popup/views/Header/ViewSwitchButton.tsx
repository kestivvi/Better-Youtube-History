import { Dispatch, ReactNode, SetStateAction } from "react"
import { Button, Group, Text, useMantineTheme } from "@mantine/core"
import { IconSettings } from "@tabler/icons-react"
import { IconChevronLeft } from "@tabler/icons-react"
import { IconCode } from "@tabler/icons-react"

import { View } from "../../Popup"

type Props = {
  view: View
  setView: Dispatch<SetStateAction<View>>
}

// @ts-expect-error
const isDev = process.env.NODE_ENV == "development"

export default function ({ view, setView }: Props) {
  const theme = useMantineTheme()

  const NavigationButton = ({
    viewToSet,
    Icon,
    children,
  }: {
    viewToSet: View
    Icon: ReactNode
    children: ReactNode
  }) => (
    <Button
      onClick={() => setView(viewToSet)}
      variant="transparent"
      component="span"
      size="compact-xs"
      p={0}
      style={{ color: theme.colors.gray[3] }}
    >
      {Icon}
      <Text ml={5}>{children}</Text>
    </Button>
  )

  if (view !== "HOME") {
    return (
      <NavigationButton viewToSet={"HOME"} Icon={<IconChevronLeft />}>
        Back
      </NavigationButton>
    )
  }

  return (
    <Group>
      <NavigationButton viewToSet={"SETTINGS"} Icon={<IconSettings />}>
        Settings
      </NavigationButton>

      {isDev && (
        <NavigationButton viewToSet={"DEV"} Icon={<IconCode />}>
          Dev
        </NavigationButton>
      )}
    </Group>
  )
}
