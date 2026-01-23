import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('Hello world!'))

export default app
