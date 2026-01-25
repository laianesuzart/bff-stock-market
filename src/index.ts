import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'

import { HTTPException } from 'hono/http-exception'
import quote from './routes/quote'
import type { Bindings } from './types'

const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

app.use('*', async (c, next) => {
  if (!c.env.CORS_ORIGIN || !c.env.MARKET_API_KEY) {
    console.error('Missing required environment variables:', {
      CORS_ORIGIN: !!c.env.CORS_ORIGIN,
      MARKET_API_KEY: !!c.env.MARKET_API_KEY,
    })
    return c.json(
      {
        error: 'Configuration Error',
        message: 'Missing required environment variables',
      },
      500,
    )
  }

  const corsMiddlewareHandler = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return corsMiddlewareHandler(c, next)
})
app.use('*', contextStorage())

app.onError((error, c) => {
  console.error('[Global Error Handler]:', error)

  if (error instanceof HTTPException) {
    return error.getResponse()
  }

  return c.json({ error: 'Internal server error', details: error.message }, 500)
})

app.route('/quote', quote)

export default app
