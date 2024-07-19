import { Tooltip, Text, ThemeIcon } from "@mantine/core"
import type { Icon, IconProps } from "@tabler/icons-react"

export const Bullet = ({
  label,
  Icon,
  color,
}: {
  label: string
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
  color: string
}) => {
  return (
    <Tooltip multiline label={<Text size="xs">{label}</Text>} withArrow>
      <ThemeIcon size={25} color={color} radius="xl">
        <Icon size={15} />
      </ThemeIcon>
    </Tooltip>
  )
}
