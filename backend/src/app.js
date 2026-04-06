import express from 'express'
import helmet from 'helmet'
import { createRequire } from 'node:module'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { IS_PRODUCTION, PORT } from './config/env.js'
import { sendJson } from './lib/http.js'
import { applyCors } from './middleware/cors.js'
import {
  authRateLimiter,
  createSessionMiddleware,
  csrfProtection,
  loginRateLimiter,
} from './middleware/security.js'
import { handleAdminRoutes } from './routes/admin.js'
import { handleAuthRoutes } from './routes/auth.js'
import { handleDashboardRoutes } from './routes/dashboard.js'
import { handlePublicRoutes } from './routes/public.js'
import { handleInitRoutes } from './routes/init.js'
import { handleRestaurantRoutes } from './routes/restaurant.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function dispatchRoutes(req, res, port) {
  const pathname = req.path.replace(/\/+$/, '') || '/'
  console.log('Dispatching route:', pathname, req.method)

  if (await handlePublicRoutes({ req, res, pathname, port })) {
    console.log('Handled by public routes')
    return
  }

  if (await handleInitRoutes({ req, res, pathname })) {
    console.log('Handled by init routes')
    return
  }

  if (await handleAuthRoutes({ req, res, pathname })) {
    console.log('Handled by auth routes')
    return
  }

  if (await handleDashboardRoutes({ req, res, pathname })) {
    console.log('Handled by dashboard routes')
    return
  }

  if (await handleRestaurantRoutes({ req, res, pathname })) {
    console.log('Handled by restaurant routes')
    return
  }

  if (await handleAdminRoutes({ req, res, pathname })) {
    console.log('Handled by admin routes')
    return
  }

  console.log('No route handler found for:', pathname, req.method)
  sendJson(res, 404, { message: 'Route not found.' }, { request: req })
}

export function createApp(port = PORT) {
  const app = express()

  app.disable('x-powered-by')

  if (IS_PRODUCTION) {
    app.set('trust proxy', 1)
  }

  app.use(applyCors)
  app.use(helmet())
  app.use(express.json({ limit: '1mb' }))
  app.use(createSessionMiddleware())
  app.use('/api/auth', authRateLimiter)
  app.use('/api/auth/login', loginRateLimiter)

  app.use(async (req, res, next) => {
    try {
      await dispatchRoutes(req, res, port)
    } catch (error) {
      next(error)
    }
  })

  // Serve frontend static files in production
  if (IS_PRODUCTION) {
    const frontendDist = join(__dirname, '../../frontend/dist')
    if (existsSync(frontendDist)) {
      app.use(express.static(frontendDist))
      app.get('*', (req, res) => {
        res.sendFile(join(frontendDist, 'index.html'))
      })
    }
  }

  app.use((error, req, res, next) => {
    if (res.headersSent) {
      next(error)
      return
    }

    console.error('Server error:', error)

    if (error?.code === 'EBADCSRFTOKEN') {
      sendJson(res, 403, { message: 'Invalid CSRF token.' })
      return
    }

    if (error?.type === 'entity.too.large') {
      sendJson(res, 413, { message: 'Request body too large.' })
      return
    }

    if (error instanceof SyntaxError && 'body' in error) {
      sendJson(res, 400, { message: 'Invalid JSON body.' })
      return
    }

    sendJson(res, 500, {
      message: error instanceof Error ? error.message : 'Unexpected server error.',
    })
  })

  return app
}
