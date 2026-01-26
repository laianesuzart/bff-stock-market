import { z } from 'zod'
import { QuoteRespose } from '../types/stock'
import { requestMarketData } from '../utils/market-data.client'
import { getContext } from 'hono/context-storage'
import { Bindings } from '../types'

export const UnifiedStockSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  logo: z.url(),
  history: z.array(z.object({ price: z.number(), date: z.date() })),
})

export type UnifiedStock = z.infer<typeof UnifiedStockSchema>

export async function fetchStockQuote(
  symbol: string,
  range: string,
): Promise<UnifiedStock[]> {
  const c = getContext<{ Bindings: Bindings }>()
  const data = await requestMarketData<QuoteRespose>({
    endpoint: `${c.env.MARKET_API_BASE_URL}/quote/${symbol}?range=${range}&interval=1d`,
  })

  return data.results.map((result) => {
    const history = result.historicalDataPrice.map((price) => ({
      price: price.close,
      date: new Date(price.date * 1000),
    }))

    return {
      symbol: result.symbol,
      name: result.longName,
      logo: result.logourl,
      history,
    }
  })
}
