import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'

import { HTTPException } from 'hono/http-exception'
import z from 'zod'
import currency from './routes/currency'
import quote from './routes/quote'
import type { Bindings } from './types'

const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

app.use('*', async (c, next) => {
  const envSchema = z.object({
    CORS_ORIGIN: z.string(),
  })

  const env = envSchema.safeParse(c.env)
  if (env.success === false) {
    console.error(
      'Missing required environment variables:',
      z.prettifyError(env.error),
    )
    return c.json(
      {
        error: 'Internal server error',
        details: 'Missing required configuration.',
      },
      500,
    )
  }

  const corsMiddlewareHandler = cors({
    origin: env.data.CORS_ORIGIN,
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
app.route('/currency', currency)

export default app
