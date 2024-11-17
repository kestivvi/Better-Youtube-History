import { Category, CategoryType } from "@/background/calendar/CategoryService"
import { ActionIcon, Group, Select, Stack, Text, TextInput } from "@mantine/core"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { type ForwardedRef, forwardRef } from "react"
import * as v from "valibot"

const categorySchema = v.object({
  name: v.string("Category name is required"),
  type: v.union([
    v.literal("positive"),
    v.literal("negative"),
    v.literal("neutral")
  ], "Invalid category type")
})

export const categoriesFieldSchema = v.array(categorySchema)

interface CategoriesFieldProps {
  value: Category[]
  onChange: (value: Category[]) => void
  error?: string
  disabled?: boolean
}

export default forwardRef(
  ({ value, onChange, error, disabled }: CategoriesFieldProps, ref: ForwardedRef<HTMLDivElement>) => {
    const addCategory = () => {
      onChange([...value, { name: '', type: 'neutral' }])
    }

    const removeCategory = (index: number) => {
      onChange(value.filter((_, i) => i !== index))
    }

    const updateCategory = (index: number, field: keyof Category, newValue: string) => {
      onChange(
        value.map((category, i) => 
          i === index 
            ? { ...category, [field]: field === 'type' ? newValue as CategoryType : newValue }
            : category
        )
      )
    }

    return (
      <Stack ref={ref} gap="xs">
        <div>
          <Text size="sm" fw={500}>Categories</Text>
          <Text size="xs" c="dimmed">Define categories for video classification</Text>
        </div>
        
        {value.map((category, index) => (
          <Group key={index} wrap="nowrap" gap="xs">
            <TextInput
              placeholder="Category name"
              size="xs"
              value={category.name}
              onChange={(e) => updateCategory(index, 'name', e.target.value)}
              error={error && index === value.length - 1 ? error : undefined}
              disabled={disabled}
              style={{ flex: 1 }}
            />
            <Select
              size="xs"
              value={category.type}
              onChange={(newValue) => updateCategory(index, 'type', newValue || 'neutral')}
              data={[
                { value: 'positive', label: 'Positive' },
                { value: 'negative', label: 'Negative' },
                { value: 'neutral', label: 'Neutral' }
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