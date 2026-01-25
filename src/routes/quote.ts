import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { z } from 'zod'
import { getStockWithHistory } from '../services/stock.service'
import { normalizeDate } from '../utils/date.utils'

const app = new Hono()

app.get(
  '/tickers',
  cache({
    cacheName: 'tickers-list',
    cacheControl: 'max-age=86400',
  }),
  async (c) => {
    return c.json({ tickers: ['ITUB4', 'MGLU3', 'PETR4', 'VALE3'] })
  },
)

const querySchema = z
  .object({
    from: z.iso
      .date()
      .transform((date) => normalizeDate({ date, endOfDay: false })),
    to: z.iso
      .date()
      .transform((date) => normalizeDate({ date, endOfDay: true })),
  })
  .refine((date) => {
    return date.to >= date.from
  })

const paramSchema = z.object({
  tickers: z.string().regex(/^[a-zA-Z0-9,]+$/),
})

app.get(
  '/:tickers',
  sValidator('param', paramSchema),
  sValidator('query', querySchema),
  cache({
    cacheName: 'stock-quote',
    cacheControl: 'max-age=14400',
  }),
  async (c) => {
    const { tickers } = c.req.valid('param')
    const { from, to } = c.req.valid('query')

    const data = await getStockWithHistory(
      tickers,
      new Date(from),
      new Date(to),
    )

    return c.json(data)
  },
)

export default app
