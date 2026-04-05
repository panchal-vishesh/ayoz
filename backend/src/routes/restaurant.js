import { randomUUID } from 'node:crypto'
import multer from 'multer'
import { getAuthContext } from '../lib/auth.js'
import { parseBody, sendJson } from '../lib/http.js'
import db from '../services/database.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })
const singlePhoto = upload.single('photo')

function runMulter(req, res) {
  return new Promise((resolve, reject) => {
    singlePhoto(req, res, (err) => (err ? reject(err) : resolve()))
  })
}

export async function handleRestaurantRoutes({ req, res, pathname }) {
  if (!pathname.startsWith('/api/restaurant')) return false

  const method = req.method?.toUpperCase()

  // ── GET /api/restaurant/settings ──────────────────────────────────────────
  if (pathname === '/api/restaurant/settings' && method === 'GET') {
    try {
      const userId = req.session?.userId
      if (!userId) { sendJson(res, 401, { message: 'Not authenticated.' }, { request: req }); return true }
      const user = await db.getUserById(userId)
      if (!user || user.role !== 'restaurant') { sendJson(res, 403, { message: 'Access denied.' }, { request: req }); return true }
      const notifications = await db.getRestaurantSettings(user.restaurant_id)
      sendJson(res, 200, { notifications }, { request: req })
      return true
    } catch (error) {
      console.error('Get restaurant settings error:', error)
      sendJson(res, 500, { message: 'Failed to fetch settings.' }, { request: req })
      return true
    }
  }

  // ── PATCH /api/restaurant/settings ─────────────────────────────────────────
  if (pathname === '/api/restaurant/settings' && method === 'PATCH') {
    try {
      const userId = req.session?.userId
      if (!userId) { sendJson(res, 401, { message: 'Not authenticated.' }, { request: req }); return true }
      const user = await db.getUserById(userId)
      if (!user || user.role !== 'restaurant') { sendJson(res, 403, { message: 'Access denied.' }, { request: req }); return true }
      const body = await parseBody(req)
      const current = await db.getRestaurantSettings(user.restaurant_id)
      const updated = { ...current, ...body }
      const saved = await db.updateRestaurantSettings(user.restaurant_id, updated)
      sendJson(res, 200, { notifications: saved, message: 'Settings updated.' }, { request: req })
      return true
    } catch (error) {
      console.error('Update restaurant settings error:', error)
      sendJson(res, 500, { message: 'Failed to update settings.' }, { request: req })
      return true
    }
  }

  // ── GET /api/restaurant/menu ──────────────────────────────────────────────
  if (pathname === '/api/restaurant/menu' && method === 'GET') {
    try {
      const auth = await getAuthContext(req, ['restaurant'])
      if (auth.error) { sendJson(res, auth.statusCode, { message: auth.error }, { request: req }); return true }

      const menu = await db.getMenuItemsByRestaurant(auth.user.restaurant_id)
      sendJson(res, 200, { menu }, { request: req })
      return true
    } catch (error) {
      console.error('Get menu error:', error)
      sendJson(res, 500, { message: 'Failed to fetch menu.' }, { request: req })
      return true
    }
  }

  // ── POST /api/restaurant/menu ─────────────────────────────────────────────
  if (pathname === '/api/restaurant/menu' && method === 'POST') {
    try {
      const auth = await getAuthContext(req, ['restaurant'])
      if (auth.error) { sendJson(res, auth.statusCode, { message: auth.error }, { request: req }); return true }

      await runMulter(req, res)

      const body = req.body
      const name = String(body.name ?? '').trim()
      const category = String(body.category ?? '').trim()
      const price = Number(body.price)
      const prepMinutes = Number(body.prepMinutes)
      const description = String(body.description ?? '').trim()
      const isVeg = body.isVeg === true || body.isVeg === 'true'
      const isAvailable = body.isAvailable !== false && body.isAvailable !== 'false'

      if (!name || !category || !price || !prepMinutes) {
        sendJson(res, 400, { message: 'Name, category, price, and prep time are required.' }, { request: req })
        return true
      }

      let photoUrl = ''
      if (req.file) {
        const ext = req.file.originalname.split('.').pop()
        const fileName = `${auth.user.restaurant_id}/${randomUUID()}.${ext}`
        photoUrl = await db.uploadMenuImage(fileName, req.file.buffer, req.file.mimetype)
      }

      const item = await db.createMenuItem({
        id: randomUUID(),
        restaurant_id: auth.user.restaurant_id,
        name,
        category,
        price,
        prep_minutes: prepMinutes,
        description,
        photo_url: photoUrl,
        is_veg: isVeg,
        is_available: isAvailable,
        demand: 'Medium',
      })

      sendJson(res, 201, { message: 'Menu item added.', item }, { request: req })
      return true
    } catch (error) {
      console.error('Add menu item error:', error)
      sendJson(res, 500, { message: 'Failed to add menu item.' }, { request: req })
      return true
    }
  }

  // ── PUT /api/restaurant/menu/:itemId ──────────────────────────────────────
  if (pathname.startsWith('/api/restaurant/menu/') && method === 'PUT') {
    try {
      const auth = await getAuthContext(req, ['restaurant'])
      if (auth.error) { sendJson(res, auth.statusCode, { message: auth.error }, { request: req }); return true }

      const itemId = pathname.slice('/api/restaurant/menu/'.length)
      const existing = await db.getMenuItemById(itemId)
      if (!existing || existing.restaurant_id !== auth.user.restaurant_id) {
        sendJson(res, 404, { message: 'Menu item not found.' }, { request: req })
        return true
      }

      await runMulter(req, res)
      const body = req.body

      let photoUrl = existing.photo_url
      if (req.file) {
        // delete old image if exists
        if (existing.photo_url) {
          const oldKey = existing.photo_url.split('/menu-images/')[1]
          if (oldKey) await db.deleteMenuImage(oldKey).catch(() => {})
        }
        const ext = req.file.originalname.split('.').pop()
        const fileName = `${auth.user.restaurant_id}/${randomUUID()}.${ext}`
        photoUrl = await db.uploadMenuImage(fileName, req.file.buffer, req.file.mimetype)
      }

      const updates = {
        ...(body.name !== undefined && { name: String(body.name).trim() }),
        ...(body.category !== undefined && { category: String(body.category).trim() }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.prepMinutes !== undefined && { prep_minutes: Number(body.prepMinutes) }),
        ...(body.description !== undefined && { description: String(body.description).trim() }),
        ...(body.isVeg !== undefined && { is_veg: body.isVeg === true || body.isVeg === 'true' }),
        ...(body.isAvailable !== undefined && { is_available: body.isAvailable !== false && body.isAvailable !== 'false' }),
        photo_url: photoUrl,
      }

      const item = await db.updateMenuItem(itemId, updates)
      sendJson(res, 200, { message: 'Menu item updated.', item }, { request: req })
      return true
    } catch (error) {
      console.error('Update menu item error:', error)
      sendJson(res, 500, { message: 'Failed to update menu item.' }, { request: req })
      return true
    }
  }

  // ── DELETE /api/restaurant/menu/:itemId ───────────────────────────────────
  if (pathname.startsWith('/api/restaurant/menu/') && method === 'DELETE') {
    try {
      const auth = await getAuthContext(req, ['restaurant'])
      if (auth.error) { sendJson(res, auth.statusCode, { message: auth.error }, { request: req }); return true }

      const itemId = pathname.slice('/api/restaurant/menu/'.length)
      const existing = await db.getMenuItemById(itemId)
      if (!existing || existing.restaurant_id !== auth.user.restaurant_id) {
        sendJson(res, 404, { message: 'Menu item not found.' }, { request: req })
        return true
      }

      // delete image from storage
      if (existing.photo_url) {
        const key = existing.photo_url.split('/menu-images/')[1]
        if (key) await db.deleteMenuImage(key).catch(() => {})
      }

      await db.deleteMenuItem(itemId)
      sendJson(res, 200, { message: 'Menu item deleted.' }, { request: req })
      return true
    } catch (error) {
      console.error('Delete menu item error:', error)
      sendJson(res, 500, { message: 'Failed to delete menu item.' }, { request: req })
      return true
    }
  }

  // ── GET /api/restaurant/staff ──────────────────────────────────────────────
  if (pathname === '/api/restaurant/staff' && method === 'GET') {
    try {
      const auth = await getAuthContext(req, ['restaurant'])
      if (auth.error) { sendJson(res, auth.statusCode, { message: auth.error }, { request: req }); return true }

      const staff = await db.getStaffByRestaurant(auth.user.restaurant_id)
      sendJson(res, 200, { staff }, { request: req })
      return true
    } catch (error) {
      console.error('Get staff error:', error)
      sendJson(res, 500, { message: 'Failed to fetch staff.' }, { request: req })
      return true
    }
  }

  // ── POST /api/restaurant/staff ────────────────────────────────────────────
  if (pathname === '/api/restaurant/staff' && method === 'POST') {
    try {
      const auth = await getAuthContext(req, ['restaurant'])
      if (auth.error) { sendJson(res, auth.statusCode, { message: auth.error }, { request: req }); return true }

      await runMulter(req, res)
      const body = req.body
      const name = String(body.name ?? '').trim()
      const role = String(body.role ?? '').trim()
      const shift = String(body.shift ?? 'Evening').trim()
      const phone = String(body.phone ?? '').trim()
      const email = String(body.email ?? '').trim()
      const status = String(body.status ?? 'Active').trim()
      const score = Number(body.score) || 90

      if (!name || !role) {
        sendJson(res, 400, { message: 'Name and role are required.' }, { request: req })
        return true
      }

      let photoUrl = ''
      if (req.file) {
        const ext = req.file.originalname.split('.').pop()
        const fileName = `staff/${auth.user.restaurant_id}/${randomUUID()}.${ext}`
        photoUrl = await db.uploadMenuImage(fileName, req.file.buffer, req.file.mimetype)
      }

      const member = await db.createStaffMember({
        id: randomUUID(),
        restaurant_id: auth.user.restaurant_id,
        name, role, shift, phone, email, status, score,
        photo_url: photoUrl,
      })

      sendJson(res, 201, { message: 'Staff member added.', member }, { request: req })
      return true
    } catch (error) {
      console.error('Add staff error:', error)
      sendJson(res, 500, { message: 'Failed to add staff member.' }, { request: req })
      return true
    }
  }

  // ── PUT /api/restaurant/staff/:id ─────────────────────────────────────────
  if (pathname.startsWith('/api/restaurant/staff/') && method === 'PUT') {
    try {
      const auth = await getAuthContext(req, ['restaurant'])
      if (auth.error) { sendJson(res, auth.statusCode, { message: auth.error }, { request: req }); return true }

      const memberId = pathname.slice('/api/restaurant/staff/'.length)
      const existing = await db.getStaffMemberById(memberId)
      if (!existing || existing.restaurant_id !== auth.user.restaurant_id) {
        sendJson(res, 404, { message: 'Staff member not found.' }, { request: req })
        return true
      }

      await runMulter(req, res)
      const body = req.body

      let photoUrl = existing.photo_url
      if (req.file) {
        if (existing.photo_url) {
          const oldKey = existing.photo_url.split('/menu-images/')[1]
          if (oldKey) await db.deleteMenuImage(oldKey).catch(() => {})
        }
        const ext = req.file.originalname.split('.').pop()
        const fileName = `staff/${auth.user.restaurant_id}/${randomUUID()}.${ext}`
        photoUrl = await db.uploadMenuImage(fileName, req.file.buffer, req.file.mimetype)
      }

      const updates = {
        ...(body.name !== undefined && { name: String(body.name).trim() }),
        ...(body.role !== undefined && { role: String(body.role).trim() }),
        ...(body.shift !== undefined && { shift: String(body.shift).trim() }),
        ...(body.phone !== undefined && { phone: String(body.phone).trim() }),
        ...(body.email !== undefined && { email: String(body.email).trim() }),
        ...(body.status !== undefined && { status: String(body.status).trim() }),
        ...(body.score !== undefined && { score: Number(body.score) }),
        photo_url: photoUrl,
      }

      const member = await db.updateStaffMember(memberId, updates)
      sendJson(res, 200, { message: 'Staff member updated.', member }, { request: req })
      return true
    } catch (error) {
      console.error('Update staff error:', error)
      sendJson(res, 500, { message: 'Failed to update staff member.' }, { request: req })
      return true
    }
  }

  // ── DELETE /api/restaurant/staff/:id ───────────────────────────────────────
  if (pathname.startsWith('/api/restaurant/staff/') && method === 'DELETE') {
    try {
      const auth = await getAuthContext(req, ['restaurant'])
      if (auth.error) { sendJson(res, auth.statusCode, { message: auth.error }, { request: req }); return true }

      const memberId = pathname.slice('/api/restaurant/staff/'.length)
      const existing = await db.getStaffMemberById(memberId)
      if (!existing || existing.restaurant_id !== auth.user.restaurant_id) {
        sendJson(res, 404, { message: 'Staff member not found.' }, { request: req })
        return true
      }

      if (existing.photo_url) {
        const key = existing.photo_url.split('/menu-images/')[1]
        if (key) await db.deleteMenuImage(key).catch(() => {})
      }

      await db.deleteStaffMember(memberId)
      sendJson(res, 200, { message: 'Staff member removed.' }, { request: req })
      return true
    } catch (error) {
      console.error('Delete staff error:', error)
      sendJson(res, 500, { message: 'Failed to remove staff member.' }, { request: req })
      return true
    }
  }

  sendJson(res, 404, { message: 'Restaurant route not found.' }, { request: req })
  return true
}
