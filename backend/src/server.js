import { createServer } from 'node:http'
import { PORT, IS_PRODUCTION, validateEnv } from './config/env.js'
import { createApp } from './app.js'

validateEnv()

const app = createApp(PORT)
const server = createServer(app)

server.listen(PORT, () => {
  const host = IS_PRODUCTION ? process.env.RENDER_EXTERNAL_URL ?? `https://ayoz-backend.onrender.com` : `http://localhost:${PORT}`
  console.log(`AyoZ backend running on ${host}`)
})
