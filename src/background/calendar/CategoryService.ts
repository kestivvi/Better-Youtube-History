import { Signal } from "@preact/signals-react"
import { VideoInfo } from "../runtime_messages/types"

export type CategoryType = "positive" | "negative" | "neutral"

export interface Category {
  name: string
  type: CategoryType
}

export interface CategoryServiceConfig {
  categoriesSignal: Signal<Category[]>
  llmApiUrlSignal: Signal<string | null>
  apiKeySignal: Signal<string | null>
}

export class CategoryService {
  private readonly OTHER_CATEGORY: Category = {
    name: 'other',
    type: 'neutral'
  }

  constructor(private readonly config: CategoryServiceConfig) {}

  private createPrompt(videoInfo: VideoInfo): string {
    const categories = [...this.config.categoriesSignal.value, this.OTHER_CATEGORY]
    const categoryNames = categories.map(c => c.name).join(', ')
    
    return `Analyze the following YouTube video metadata and categorize it into exactly one of these categories: ${categoryNames}.
    
Video Title: ${videoInfo.title}
Channel Name: ${videoInfo.channelName}
Description: ${videoInfo.description}

Respond with just the category name, nothing else. If the video doesn't fit into any specific category, respond with "other".`
  }

  private async queryLLM(prompt: string): Promise<string | null> {
    try {
      const apiUrl = this.config.llmApiUrlSignal.value
      const apiKey = this.config.apiKeySignal.value

      if (!apiUrl) {
        console.warn('CategoryService: API URL not set')
        return null
      }

      if (!apiKey) {
        console.warn('CategoryService: API key not set')
        return null
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a video categorization assistant. Respond only with the category name, nothing else.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 50
        })
      })

      if (!response.ok) {
        console.warn(`CategoryService: LLM API request failed: ${response.statusText}`)
        return null
      }

      const data = await response.json()
      return data.choices[0].message.content.trim().toLowerCase()
    } catch (error) {
      console.warn('CategoryService: Error querying LLM:', error)
      return null
    }
  }

  public async categorizeVideo(videoInfo: VideoInfo): Promise<Category | null> {
    const prompt = this.createPrompt(videoInfo)
    const categoryName = await this.queryLLM(prompt)
    
    if (!categoryName) {
      return null
    }
    
    const categories = [...this.config.categoriesSignal.value, this.OTHER_CATEGORY]
    const category = categories.find(c => c.name.toLowerCase() === categoryName)
    return category ?? this.OTHER_CATEGORY
  }
}

