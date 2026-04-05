import { randomUUID } from 'node:crypto'
import { getAuthContext } from '../lib/auth.js'
import { parseBody, sendJson } from '../lib/http.js'
import {
  buildRestaurantLoginId,
  generateTemporaryPassword,
  hashPassword,
  sanitizeUser,
} from '../store/index.js'
import db from '../services/database.js'

export async function handleAdminRoutes({ req, res, pathname }) {
  // Only handle /api/admin/* routes
  if (!pathname.startsWith('/api/admin')) {
    return false
  }

  console.log('Processing admin route:', pathname, req.method)

  // ── GET /api/admin/users ──────────────────────────────────────────────────
  if (pathname === '/api/admin/users' && req.method === 'GET') {
    try {
      const auth = await getAuthContext(req, ['admin'])
      if (auth.error) { 
        sendJson(res, auth.statusCode, { message: auth.error }, { request: req })
        return true 
      }

      const allUsers = await db.getAllUsers()
      const restaurants = await db.getAllRestaurants()
      
      const users = allUsers
        .filter((u) => u.role !== 'admin')
        .map((u) => {
          const safe = sanitizeUser(u)
          const restaurant = u.role === 'restaurant' ? restaurants.find((r) => r.id === u.restaurant_id) : null
          return {
            id: safe.id,
            role: safe.role,
            name: safe.name,
            email: safe.email,
            phone: safe.phone ?? u.phone ?? null,
            loginId: safe.login_id,
            createdAt: safe.created_at,
            suspended: safe.suspended ?? false,
            restaurantName: restaurant?.name ?? null,
            city: restaurant?.city ?? null,
            restaurantId: restaurant?.id ?? null,
          }
        })

      sendJson(res, 200, { users }, { request: req })
      return true
    } catch (error) {
      console.error('Admin users error:', error)
      sendJson(res, 500, { message: 'Failed to fetch users' }, { request: req })
      return true
    }
  }

  // ── GET /api/admin/settings ──────────────────────────────────────────────
  if (pathname === '/api/admin/settings' && req.method === 'GET') {
    try {
      const toggles = await db.getSettings()
      sendJson(res, 200, { toggles }, { request: req })
      return true
    } catch (error) {
      console.error('Get settings error:', error)
      sendJson(res, 500, { message: 'Failed to fetch settings' }, { request: req })
      return true
    }
  }

  // ── PATCH /api/admin/settings ─────────────────────────────────────────────
  if (pathname === '/api/admin/settings' && req.method === 'PATCH') {
    try {
      const body = await parseBody(req)
      const current = await db.getSettings()
      const updated = { ...current, ...body }
      const saved = await db.updateSettings(updated)
      sendJson(res, 200, { toggles: saved, message: 'Settings updated.' }, { request: req })
      return true
    } catch (error) {
      console.error('Update settings error:', error)
      sendJson(res, 500, { message: 'Failed to update settings' }, { request: req })
      return true
    }
  }

  // ── GET /api/admin/platform ───────────────────────────────────────────────
  if (pathname === '/api/admin/platform' && req.method === 'GET') {
    try {
      const auth = await getAuthContext(req, ['admin'])
      if (auth.error) { 
        sendJson(res, auth.statusCode, { message: auth.error }, { request: req })
        return true 
      }

      const allUsers = await db.getAllUsers()
      const restaurants = await db.getAllRestaurants()
      
      const customers = allUsers.filter((u) => u.role === 'customer').length
      const restaurantManagers = allUsers.filter((u) => u.role === 'restaurant').length
      const totalRevenue = restaurants.reduce((s, r) => s + Number(r.stats?.todayRevenue ?? 0), 0)
      const totalOrders = restaurants.reduce((s, r) => s + Number(r.stats?.todayOrders ?? 0), 0)
      const cities = new Set(restaurants.map((r) => r.city)).size

      sendJson(res, 200, {
        platform: {
          restaurants: restaurants.length,
          customers,
          restaurantManagers,
          totalRevenue,
          totalOrders,
          cities,
          seededAt: new Date().toISOString(), // Since we don't have meta anymore
        },
      }, { request: req })
      return true
    } catch (error) {
      console.error('Admin platform error:', error)
      sendJson(res, 500, { message: 'Failed to fetch platform data' }, { request: req })
      return true
    }
  }

  // ── PATCH /api/admin/users/:id/status ────────────────────────────────────
  if (pathname.startsWith('/api/admin/users/') && pathname.endsWith('/status') && req.method === 'PATCH') {
    try {
      const auth = await getAuthContext(req, ['admin'])
      if (auth.error) { 
        sendJson(res, auth.statusCode, { message: auth.error }, { request: req })
        return true 
      }

      const id = pathname.slice('/api/admin/users/'.length, -'/status'.length)
      const user = await db.getUserById(id)
      
      if (!user) { 
        sendJson(res, 404, { message: 'User not found.' }, { request: req })
        return true 
      }
      
      if (user.role === 'admin') { 
        sendJson(res, 403, { message: 'Cannot modify admin accounts.' }, { request: req })
        return true 
      }

      const body = await parseBody(req)
      const suspended = body.suspended === true
      
      const updatedUser = await db.updateUser(id, { 
        suspended, 
        updated_at: new Date().toISOString() 
      })

      sendJson(res, 200, { 
        message: `User ${suspended ? 'suspended' : 'reactivated'}.`, 
        user: sanitizeUser(updatedUser) 
      }, { request: req })
      return true
    } catch (error) {
      console.error('Admin user status error:', error)
      sendJson(res, 500, { message: 'Failed to update user status' }, { request: req })
      return true
    }
  }

  // ── POST /api/admin/restaurants ───────────────────────────────────────────
  if (pathname === '/api/admin/restaurants' && req.method === 'POST') {
    console.log('ORIGINAL ADMIN ROUTES - Restaurant creation started')
    try {
      const auth = await getAuthContext(req, ['admin'])
      if (auth.error) { 
        sendJson(res, auth.statusCode, { message: auth.error }, { request: req })
        return true 
      }

      const body = await parseBody(req)
      const name = String(body.name ?? '').trim()
      const city = String(body.city ?? '').trim()
      const cuisine = String(body.cuisine ?? '').trim()
      const description = String(body.description ?? '').trim()
      const contactName = String(body.contactName ?? '').trim()
      const contactEmail = String(body.contactEmail ?? '').trim().toLowerCase()
      const serviceModel = String(body.serviceModel ?? '').trim()
      const seatingCapacityInput = Number.parseInt(String(body.seatingCapacity ?? ''), 10)
      const seatingCapacity = Number.isFinite(seatingCapacityInput) && seatingCapacityInput > 0 ? seatingCapacityInput : 72

      if (!name || !city || !cuisine || !contactName || !contactEmail) {
        sendJson(res, 400, { message: 'Restaurant name, city, cuisine, contact name, and contact email are required.' }, { request: req })
        return true
      }

      // Check if email already exists
      const existingUser = await db.getUserByEmail(contactEmail)
      if (existingUser) {
        sendJson(res, 409, { message: 'This contact email is already linked to another account.' }, { request: req })
        return true
      }

      const createdAt = new Date().toISOString()
      const restaurantId = randomUUID()
      
      // Generate unique login ID
      const allUsers = await db.getAllUsers()
      const store = { users: allUsers } // For compatibility with existing function
      const loginId = buildRestaurantLoginId(store, name)
      const temporaryPassword = generateTemporaryPassword()

      // Create restaurant first
      const restaurant = {
        id: restaurantId,
        name,
        city,
        cuisine,
        description: description || `Arrival-based dining setup for ${name}.`,
        contact_name: contactName,
        contact_email: contactEmail,
        login_id: loginId,
        status: 'Live onboarding',
        seating_capacity: seatingCapacity,
        service_model: serviceModel || 'Smart dine-in service',
        operating_hours: '12:30 PM - 11:00 PM',
        stats: {
          todayOrders: 0,
          readyRate: 95,
          avgPrepMins: 15,
          todayRevenue: 0,
          arrivalAlerts: 0,
          repeatGuests: 0,
          satisfaction: 95,
          tableTurnMins: 45
        },
        menu: [],
        recent_orders: [],
        staff: [],
        zones: [],
        inventory_alerts: [],
        created_by: auth.user.id
        // Note: created_at and updated_at will be set automatically by the database
      }
      
      const createdRestaurant = await db.createRestaurant(restaurant)

      // Create restaurant user
      const restaurantUser = {
        id: randomUUID(),
        role: 'restaurant',
        name: `${name} Manager`,
        email: contactEmail,
        login_id: loginId,
        restaurant_id: restaurantId,
        password_hash: await hashPassword(temporaryPassword),
        created_by: auth.user.id
        // Note: created_at and updated_at will be set automatically by the database
      }
      
      await db.createUser(restaurantUser)

      sendJson(res, 201, {
        message: 'Restaurant account created.',
        restaurant: {
          id: createdRestaurant.id,
          name: createdRestaurant.name,
          city: createdRestaurant.city,
          cuisine: createdRestaurant.cuisine,
          description: createdRestaurant.description,
          contactName: createdRestaurant.contact_name,
          contactEmail: createdRestaurant.contact_email,
          loginId: createdRestaurant.login_id,
          serviceModel: createdRestaurant.service_model,
          seatingCapacity: createdRestaurant.seating_capacity,
          operatingHours: createdRestaurant.operating_hours,
          status: createdRestaurant.status
        },
        credentials: { 
          restaurantName: createdRestaurant.name, 
          loginId, 
          temporaryPassword, 
          contactEmail 
        },
      }, { request: req })
      return true
    } catch (error) {
      console.error('Create restaurant error:', error)
      sendJson(res, 500, { message: 'Failed to create restaurant' }, { request: req })
      return true
    }
  }

  // ── GET /api/admin/restaurants (list all) ────────────────────────────────────────
  if (pathname === '/api/admin/restaurants' && req.method === 'GET') {
    try {
      const auth = await getAuthContext(req, ['admin'])
      if (auth.error) { 
        sendJson(res, auth.statusCode, { message: auth.error }, { request: req })
        return true 
      }

      const restaurants = await db.getAllRestaurants()
      
      // Format restaurants for frontend
      const formattedRestaurants = restaurants.map(restaurant => ({
        id: restaurant.id,
        name: restaurant.name,
        city: restaurant.city,
        cuisine: restaurant.cuisine,
        description: restaurant.description,
        contactName: restaurant.contact_name,
        contactEmail: restaurant.contact_email,
        loginId: restaurant.login_id,
        serviceModel: restaurant.service_model,
        seatingCapacity: restaurant.seating_capacity,
        operatingHours: restaurant.operating_hours,
        status: restaurant.status,
        stats: restaurant.stats
      }))

      sendJson(res, 200, { restaurants: formattedRestaurants }, { request: req })
      return true
    } catch (error) {
      console.error('Get restaurants error:', error)
      sendJson(res, 500, { message: 'Failed to fetch restaurants' }, { request: req })
      return true
    }
  }

  // ── GET /api/admin/restaurants/:id ────────────────────────────────────────
  if (pathname.startsWith('/api/admin/restaurants/') && req.method === 'GET') {
    const id = pathname.slice('/api/admin/restaurants/'.length)
    console.log('GET restaurant details for ID:', id)
    
    // Skip if it's a status route or other sub-routes
    if (id.includes('/')) {
      return false
    }
    
    try {
      const auth = await getAuthContext(req, ['admin'])
      if (auth.error) { 
        sendJson(res, auth.statusCode, { message: auth.error }, { request: req })
        return true 
      }

      const id = pathname.slice('/api/admin/restaurants/'.length)
      const restaurant = await db.getRestaurantById(id)
      
      if (!restaurant) { 
        sendJson(res, 404, { message: 'Restaurant not found.' }, { request: req })
        return true 
      }

      // Format the restaurant data for the frontend
      const formattedRestaurant = {
        id: restaurant.id,
        name: restaurant.name,
        city: restaurant.city,
        cuisine: restaurant.cuisine,
        description: restaurant.description,
        contactName: restaurant.contact_name,
        contactEmail: restaurant.contact_email,
        loginId: restaurant.login_id,
        serviceModel: restaurant.service_model,
        seatingCapacity: restaurant.seating_capacity,
        operatingHours: restaurant.operating_hours,
        status: restaurant.status,
        stats: restaurant.stats,
        menu: restaurant.menu,
        recentOrders: restaurant.recent_orders,
        staff: restaurant.staff,
        zones: restaurant.zones,
        inventoryAlerts: restaurant.inventory_alerts
      }

      sendJson(res, 200, { restaurant: formattedRestaurant }, { request: req })
      return true
    } catch (error) {
      console.error('Get restaurant error:', error)
      sendJson(res, 500, { message: 'Failed to fetch restaurant' }, { request: req })
      return true
    }
  }

  // ── PUT /api/admin/restaurants/:id ────────────────────────────────────────
  if (pathname.startsWith('/api/admin/restaurants/') && req.method === 'PUT') {
    try {
      const auth = await getAuthContext(req, ['admin'])
      if (auth.error) { 
        sendJson(res, auth.statusCode, { message: auth.error }, { request: req })
        return true 
      }

      const id = pathname.slice('/api/admin/restaurants/'.length)
      const restaurant = await db.getRestaurantById(id)
      
      if (!restaurant) { 
        sendJson(res, 404, { message: 'Restaurant not found.' }, { request: req })
        return true 
      }

      const body = await parseBody(req)
      const allowed = ['name', 'city', 'cuisine', 'description', 'contact_name', 'contact_email', 'service_model', 'seating_capacity', 'status', 'operating_hours']
      const updates = {}
      
      for (const key of allowed) {
        const bodyKey = key === 'contact_name' ? 'contactName' : 
                       key === 'contact_email' ? 'contactEmail' :
                       key === 'service_model' ? 'serviceModel' :
                       key === 'seating_capacity' ? 'seatingCapacity' :
                       key === 'operating_hours' ? 'operatingHours' : key
                       
        if (body[bodyKey] !== undefined) {
          updates[key] = key === 'seating_capacity'
            ? (Number.isFinite(Number.parseInt(String(body[bodyKey]), 10)) ? Number.parseInt(String(body[bodyKey]), 10) : restaurant.seating_capacity)
            : String(body[bodyKey]).trim()
        }
      }

      const updatedRestaurant = await db.updateRestaurant(id, updates)

      // Update restaurant user email if contact email changed
      if (updates.contact_email) {
        const restaurantUser = await db.getAllUsers()
        const userToUpdate = restaurantUser.find(u => u.restaurant_id === id)
        if (userToUpdate) {
          await db.updateUser(userToUpdate.id, { email: updates.contact_email.toLowerCase() })
        }
      }

      sendJson(res, 200, { 
        message: 'Restaurant updated.', 
        restaurant: updatedRestaurant 
      }, { request: req })
      return true
    } catch (error) {
      console.error('Update restaurant error:', error)
      sendJson(res, 500, { message: 'Failed to update restaurant' }, { request: req })
      return true
    }
  }

  // ── DELETE /api/admin/restaurants/:id ─────────────────────────────────────
  if (pathname.startsWith('/api/admin/restaurants/') && req.method === 'DELETE') {
    try {
      const auth = await getAuthContext(req, ['admin'])
      if (auth.error) { 
        sendJson(res, auth.statusCode, { message: auth.error }, { request: req })
        return true 
      }

      const id = pathname.slice('/api/admin/restaurants/'.length)
      const restaurant = await db.getRestaurantById(id)
      
      if (!restaurant) { 
        sendJson(res, 404, { message: 'Restaurant not found.' }, { request: req })
        return true 
      }

      // Delete restaurant users first (due to foreign key constraints)
      const allUsers = await db.getAllUsers()
      const restaurantUsers = allUsers.filter(u => u.restaurant_id === id)
      
      for (const user of restaurantUsers) {
        await db.updateUser(user.id, { restaurant_id: null })
      }

      // Delete the restaurant
      await db.deleteRestaurant(id)

      sendJson(res, 200, { message: 'Restaurant deleted.' }, { request: req })
      return true
    } catch (error) {
      console.error('Delete restaurant error:', error)
      sendJson(res, 500, { message: 'Failed to delete restaurant' }, { request: req })
      return true
    }
  }
  
  // No route matched under /api/admin
  return false
}
