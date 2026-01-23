import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'

import quote from './routes/quote'
import type { Bindings } from './types'

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', contextStorage())

const api = app.basePath('/api')

api.route('/quote', quote)

export default app
