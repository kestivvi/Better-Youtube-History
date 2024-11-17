import { createSignalSupabaseSynced } from "../signals/SupabaseSignal/createSignalSupabaseSynced"
import { Category } from "@/background/calendar/CategoryService"

export const DEFAULT_CATEGORIES: Category[] = [
  { 
    name: 'educational',
    type: 'positive',
    description: 'Videos that teach new skills, explain concepts, or provide academic knowledge. Including tutorials, lectures, documentaries, and explainer videos.'
  },
  { 
    name: 'productivity',
    type: 'positive',
    description: 'Videos about self-improvement, time management, work efficiency, and professional development. Including workflow tutorials and productivity tips.'
  },
  { 
    name: 'entertainment',
    type: 'negative',
    description: 'Videos primarily for amusement without educational value. Including gaming, reaction videos, vlogs, and comedy sketches.'
  },
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