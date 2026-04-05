import { createServer } from 'node:http'
import { PORT, validateEnv } from './config/env.js'
import { createApp } from './app.js'

validateEnv()

const app = createApp(PORT)
const server = createServer(app)

server.listen(PORT, () => {
  console.log(`AyoZ backend running on http://localhost:${PORT}`)
})
