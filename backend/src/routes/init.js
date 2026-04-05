import { sendJson } from '../lib/http.js'
import db from '../services/database.js'

export async function handleInitRoutes({ req, res, pathname }) {
  if (pathname === '/api/init' && req.method === 'POST') {
    try {
      const result = await db.initializeDatabase()
      sendJson(res, 200, result, { request: req })
      return true
    } catch (error) {
      console.error('Database initialization error:', error)
      sendJson(res, 500, { 
        message: 'Failed to initialize database',
        error: error.message 
      }, { request: req })
      return true
    }
  }

  return false
}