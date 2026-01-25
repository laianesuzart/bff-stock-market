import { z } from 'zod'
import { QuoteRespose, StockListResponse } from '../types/stock'
import { requestMarketData } from '../utils/market-data.client'

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
  const data = await requestMarketData<QuoteRespose>(
    `/quote/${symbol}?range=${range}&interval=1d`,
  )

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

export async function fetchTickers() {
  const data = await requestMarketData<StockListResponse>(
    '/quote/list?type=stock&sortBy=name&sortOrder=asc',
    24 * 60 * 60,
  )
  return data.stocks.map((item) => item.stock)
}
