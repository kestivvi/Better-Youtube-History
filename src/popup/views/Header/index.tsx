import { Group } from "@mantine/core"
import type { Dispatch, SetStateAction } from "react"
import type { View } from "../../Popup"
import CustomAvatar from "./CustomAvatar"
import ViewSwitchButton from "./ViewSwitchButton"

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
