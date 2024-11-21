import type { Category, CategoryType } from "@/background/calendar/CategoryService"
import {
  ActionIcon,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { type ForwardedRef, forwardRef } from "react"
import * as v from "valibot"

const categorySchema = v.object({
  name: v.string("Category name is required"),
  type: v.union(
    [v.literal("positive"), v.literal("negative"), v.literal("neutral")],
    "Invalid category type",
  ),
  description: v.optional(
    v.pipe(v.string(), v.maxLength(500, "Description must be less than 500 characters")),
  ),
})

export const categoriesFieldSchema = v.array(categorySchema)

interface CategoriesFieldProps {
  value: Category[]
  onChange: (value: Category[]) => void
  error?: string
  disabled?: boolean
}

export default forwardRef(
  (
    { value, onChange, error, disabled }: CategoriesFieldProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const addCategory = () => {
      onChange([
        ...value,
        {
          name: "",
          type: "neutral",
          description: "",
        },
      ])
    }

    const removeCategory = (index: number) => {
      onChange(value.filter((_, i) => i !== index))
    }

    const updateCategory = (index: number, field: keyof Category, newValue: string) => {
      onChange(
        value.map((category, i) =>
          i === index
            ? {
                ...category,
                [field]: field === "type" ? (newValue as CategoryType) : newValue,
              }
            : category,
        ),
      )
    }

    return (
      <Stack ref={ref} gap="xs">
        <div>
          <Text size="sm" fw={500}>
            Categories
          </Text>
          <Text size="xs" c="dimmed">
            Define categories for video classification
          </Text>
        </div>

        {value.map((category, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Stack key={index} gap="xs">
            <Group wrap="nowrap" gap="xs">
              <TextInput
                placeholder="Category name"
                size="xs"
                value={category.name}
                onChange={(e) => updateCategory(index, "name", e.target.value)}
                error={error && index === value.length - 1 ? error : undefined}
                disabled={disabled}
                style={{ flex: 1 }}
              />
              <Select
                size="xs"
                value={category.type}
                onChange={(newValue) =>
                  updateCategory(index, "type", newValue || "neutral")
                }
                data={[
                  { value: "positive", label: "Positive" },
                  { value: "negative", label: "Negative" },
                  { value: "neutral", label: "Neutral" },
                ]}
                disabled={disabled}
                style={{ width: 100 }}
              />
              <ActionIcon
                color="red"
                onClick={() => removeCategory(index)}
                disabled={disabled}
                variant="light"
                size="sm"
              >
                <IconTrash size="0.9rem" />
              </ActionIcon>
            </Group>

            <Stack gap={0}>
              <Textarea
                placeholder="Category description (optional)"
                size="xs"
                value={category.description || ""}
                onChange={(e) => updateCategory(index, "description", e.target.value)}
                disabled={disabled}
                maxLength={500}
                autosize
                minRows={2}
                styles={{
                  input: {
                    fontSize: "12px",
                    overflow: "hidden",
                  },
                }}
              />
              <Text size="xs" c="dimmed" ta="right" mt={2}>
                {category.description?.length || 0}/500
              </Text>
            </Stack>
          </Stack>
        ))}

        <Group justify="center">
          <ActionIcon
            onClick={addCategory}
            variant="light"
            color="blue"
            disabled={disabled}
            size="sm"
          >
            <IconPlus size="0.9rem" />
          </ActionIcon>
        </Group>
      </Stack>
    )
  },
)
