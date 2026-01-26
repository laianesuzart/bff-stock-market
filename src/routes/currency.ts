import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { getMidMarketCurrencyRates } from '../services/currency.service'

const app = new Hono()

app.get(
  '/majors',
  cache({
    cacheName: 'currency',
    cacheControl: 'max-age=14400',
  }),
  async (c) => {
    const currencies = await getMidMarketCurrencyRates()
    return c.json({ currencies })
  },
)

export default app
