import { sendJson } from '../lib/http.js'
import db from '../services/database.js'

export async function handlePublicRoutes({ req, res, pathname, port }) {
  if (pathname === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, {
      ok: true,
      service: 'AyoZ backend',
      port,
    }, { request: req })
    return true
  }

  if (pathname === '/api/stats' && req.method === 'GET') {
    try {
      const [allUsers, restaurants] = await Promise.all([
        db.getAllUsers(),
        db.getAllRestaurants(),
      ])
      const totalOrders = restaurants.reduce((s, r) => s + Number(r.stats?.todayOrders ?? 0), 0)
      const totalRevenue = restaurants.reduce((s, r) => s + Number(r.stats?.todayRevenue ?? 0), 0)
      const cities = new Set(restaurants.map((r) => r.city).filter(Boolean)).size
      const customers = allUsers.filter((u) => u.role === 'customer').length
      const avgReadyRate = restaurants.length
        ? Math.round(restaurants.reduce((s, r) => s + Number(r.stats?.readyRate ?? 0), 0) / restaurants.length)
        : 0

      sendJson(res, 200, {
        stats: {
          restaurants: restaurants.length,
          customers,
          cities,
          totalOrders,
          totalRevenue,
          avgReadyRate,
        },
      }, { request: req })
    } catch (error) {
      console.error('Stats error:', error)
      sendJson(res, 500, { message: 'Failed to fetch stats' }, { request: req })
    }
    return true
  }

  if (pathname === '/api/restaurants' && req.method === 'GET') {
    try {
      const restaurants = await db.getAllRestaurants()

      sendJson(res, 200, {
        restaurants: restaurants.map((restaurant) => ({
          id: restaurant.id,
          name: restaurant.name,
          city: restaurant.city,
          cuisine: restaurant.cuisine,
          description: restaurant.description,
          averagePrep: `${restaurant.stats?.avgPrepMins ?? 0} mins`,
          topDish: restaurant.menu?.[0]?.name ?? 'Chef special',
          serviceModel: restaurant.service_model,
          seatingCapacity: restaurant.seating_capacity,
        })),
      }, { request: req })
    } catch (error) {
      console.error('Error fetching restaurants:', error)
      sendJson(res, 500, { message: 'Failed to fetch restaurants' }, { request: req })
    }

    return true
  }

  return false
}
