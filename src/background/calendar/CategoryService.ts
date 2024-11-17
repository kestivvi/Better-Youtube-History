import { Signal } from "@preact/signals-react"
import { VideoInfo } from "../runtime_messages/types"

export type CategoryType = "positive" | "negative" | "neutral"

export interface Category {
  name: string
  type: CategoryType
  description?: string
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
    const categoryDescriptions = categories.map(c => {
      const description = c.description || `Videos that belong to the ${c.name} category`
      return `[CATEGORY]
Name: ${c.name}
Description >>>
${description}
<<<`
    }).join('\n\n')
    
    return `You are tasked with categorizing a YouTube video into exactly one of the following categories:

${categoryDescriptions}

[VIDEO METADATA]
Title: ${videoInfo.title}
Channel: ${videoInfo.channelName}
Description >>>
${videoInfo.description}
<<<

[INSTRUCTIONS]
Analyze the video metadata and respond with exactly one category name from the list above.
Focus on the main content and topic of the video - ignore affiliate links, social media links, 
sponsorship mentions, and other promotional content in the description.
If the video doesn't fit any specific category, respond with "other".
Respond with just the category name, nothing else.`
  }

  private async queryLLM(prompt: string): Promise<string | null> {
    try {
      const apiUrl = this.config.llmApiUrlSignal.value
      const apiKey = this.config.apiKeySignal.value

      if (!apiUrl) {
        console.error('CategoryService: API URL not set')
        return null
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
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
          temperature: 0.3
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`CategoryService: LLM API request failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        })
        return null
      }

      const data = await response.json()
      if (!data.choices?.[0]?.message?.content) {
        console.error('CategoryService: Unexpected API response format:', data)
        return null
      }
      
      return data.choices[0].message.content.trim().toLowerCase()
    } catch (error) {
      console.error('CategoryService: Error querying LLM:', error)
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

