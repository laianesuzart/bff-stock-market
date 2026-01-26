import { getContext } from 'hono/context-storage'
import z from 'zod'
import { Bindings } from '../types'
import { CurrencyResponse, MajorCurrency } from '../types/currency'
import { requestMarketData } from '../utils/market-data.client'

export const UnifiedCurrencySchema = z.object({
  code: z.enum(['USD', 'EUR', 'JPY', 'GBP']),
  bid: z.string(),
  ask: z.string(),
  pctChange: z.string(),
})

export type UnifiedCurrency = z.infer<typeof UnifiedCurrencySchema>

export async function fetchMajorCurrencies(): Promise<UnifiedCurrency[]> {
  const c = getContext<{ Bindings: Bindings }>()
  const res = await requestMarketData<CurrencyResponse<MajorCurrency>>({
    endpoint: `${c.env.CURRENCY_API_BASE_URL}/last/USD-BRL,EUR-BRL,JPY-BRL,GBP-BRL`,
    authHeader: 'x-api-key',
    token: c.env.CURRENCY_API_KEY,
    cacheTtl: 2 * 60 * 60,
  })
  return Object.entries(res).map(([_key, value]) => value)
}
