import { Dispatch, SetStateAction } from 'react'
import { View } from '../../Popup'
import { Button, Group, Text } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import { IconChevronLeft } from '@tabler/icons-react'
import { IconCode } from '@tabler/icons-react'

type Props = {
  view: View
  setView: Dispatch<SetStateAction<View>>
}

// @ts-expect-error
const isDev = process.env.NODE_ENV == 'development'

export default function ({ view, setView }: Props) {
  if (view !== 'HOME') {
    return (
      <Button
        onClick={() => setView('HOME')}
        variant="transparent"
        component="span"
        size="compact-xs"
        p={0}
        style={{
          color: 'white',
        }}
      >
        <IconChevronLeft />
        <Text ml={5}>Back</Text>
      </Button>
    )
  }

  return (
    <Group>
      <Button
        onClick={() => setView('SETTINGS')}
        variant="transparent"
        component="span"
        size="compact-xs"
        p={0}
        style={{
          color: 'white',
        }}
      >
        <IconSettings />
        <Text ml={5}>Settings</Text>
      </Button>
      {isDev && (
        <Button
          onClick={() => setView('DEV')}
          variant="transparent"
          component="span"
          size="compact-xs"
          p={0}
          style={{
            color: 'white',
          }}
        >
          <IconCode />
          <Text ml={5}>Dev</Text>
        </Button>
      )}
    </Group>
  )
}
