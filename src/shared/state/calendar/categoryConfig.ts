import { createSignalSupabaseSynced } from "../signals/SupabaseSignal/createSignalSupabaseSynced"
import { Category } from "@/background/calendar/CategoryService"

export const DEFAULT_CATEGORIES: Category[] = [
  { name: 'educational', type: 'positive' },
  { name: 'productivity', type: 'positive' },
  { name: 'entertainment', type: 'negative' },
]

export const DEFAULT_LLM_API_URL = 'https://api.openai.com/v1/chat/completions'

export const { categoriesSignal } = createSignalSupabaseSynced(
  "categories",
  DEFAULT_CATEGORIES,
)

export const { llmApiUrlSignal } = createSignalSupabaseSynced(
  "llmApiUrl",
  DEFAULT_LLM_API_URL as string | null,
)

export const { llmApiKeySignal } = createSignalSupabaseSynced(
  "llmApiKey",
  null as string | null,
) 