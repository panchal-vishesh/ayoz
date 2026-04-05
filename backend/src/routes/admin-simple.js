import { sendJson } from '../lib/http.js'

export async function handleAdminRoutes({ req, res, pathname }) {
  console.log('=== ADMIN ROUTE HANDLER CALLED ===')
  console.log('Pathname:', pathname)
  console.log('Method:', req.method)
  
  // Only handle /api/admin/* routes
  if (!pathname.startsWith('/api/admin')) {
    console.log('Not an admin route, returning false')
    return false
  }
  
  console.log('This IS an admin route!')
  
  // Simple test route
  if (pathname === '/api/admin/test' && req.method === 'GET') {
    console.log('Handling test route')
    sendJson(res, 200, { 
      message: 'Admin routes are working!',
      pathname: pathname,
      method: req.method
    }, { request: req })
    return true
  }
  
  // Restaurant creation route
  if (pathname === '/api/admin/restaurants' && req.method === 'POST') {
    console.log('Handling restaurant creation route')
    sendJson(res, 200, { 
      message: 'Restaurant creation endpoint reached!',
      note: 'This is a test response - actual creation logic will be added'
    }, { request: req })
    return true
  }
  
  console.log('No matching admin route found')
  return false
}