import { Dispatch, SetStateAction } from 'react'
import { View } from '../../Popup'
import { ActionIcon, Avatar, Box, Button, Group, Title, Text } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import { IconChevronLeft } from '@tabler/icons-react'

type Props = {
  view: View
  setView: Dispatch<SetStateAction<View>>
}

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
  )
}
