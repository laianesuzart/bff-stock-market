import { getContext } from 'hono/context-storage'
import { Bindings } from '../types'

export async function requestMarketData<T>(
  endpoint: string,
  cacheTtl?: number,
): Promise<T> {
  const c = getContext<{ Bindings: Bindings }>()
  const { MARKET_API_BASE_URL, MARKET_API_KEY } = c.env
  const url = `${MARKET_API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    cf: {
      cacheTtl: cacheTtl ?? 4 * 60 * 60,
      cacheEverything: true,
    },

    headers: {
      Authorization: `Bearer ${MARKET_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      `[MARKET_API_ERROR] ${response.status} - ${response.statusText}`,
    )
  }

  return response.json()
}
