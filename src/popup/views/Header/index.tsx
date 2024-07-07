import { Dispatch, SetStateAction } from 'react'
import { View } from '../../Popup'
import { Group } from '@mantine/core'
import ViewSwitchButton from './ViewSwitchButton'
import CustomAvatar from './CustomAvatar'

type Props = {
  view: View
  setView: Dispatch<SetStateAction<View>>
}

export default function ({ view, setView }: Props) {
  return (
    <>
      <Group justify="space-between" px={10} py={5}>
        <ViewSwitchButton view={view} setView={setView} />

        <CustomAvatar />
      </Group>
    </>
  )
}
