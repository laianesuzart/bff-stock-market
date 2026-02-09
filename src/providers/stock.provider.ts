import { z } from 'zod'
import { QuoteRespose, StockListResponse } from '../types/stock'
import { requestMarketData } from '../utils/market-data.client'
import { getContext } from 'hono/context-storage'
import { Bindings } from '../types'
import { normalizeDate } from '../utils/date.utils'

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
    token: c.env.MARKET_API_KEY,
  })

  return data.results.map((result) => {
    const history = result.historicalDataPrice.map((price) => ({
      price: price.close,
      date: normalizeDate({
        date: new Date(price.date * 1000),
        endOfDay: true,
      }),
    }))

    return {
      symbol: result.symbol,
      name: result.longName,
      logo: result.logourl,
      history,
    }
  })
}

export async function fetchTickers(type: string) {
  const c = getContext<{ Bindings: Bindings }>()
  let url = `${c.env.MARKET_API_BASE_URL}/quote/list?type=${type}&sortBy=name&sortOrder=asc`

  const data = await requestMarketData<StockListResponse>({
    endpoint: url,
    token: c.env.MARKET_API_KEY,
    cacheTtl: 24 * 60 * 60,
  })

  return {
    tickers: data.stocks.map(({ stock }) => stock),
  }
}
