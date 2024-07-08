import { providerTokenInfoSignal } from '@/shared/state/auth/tokens/providerTokenInfo'
import { fetchTokenInfo } from './fetchTokenInfo'

export async function fetchAndSaveTokenInfo(providerToken: string): Promise<void> {
  try {
    const response = await fetchTokenInfo(providerToken)
    const data = await response.json()

    console.log('[fetchAndSaveTokenInfo] Token info fetched:', data)

    providerTokenInfoSignal.value = data
  } catch (err) {
    console.error('[fetchAndSaveTokenInfo] Unexpected error:', err)
  }
}
