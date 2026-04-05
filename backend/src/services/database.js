import { getSupabaseServiceClient } from '../db/supabase.js'
import { createCustomerProfile, makeRestaurantRecord } from '../store/records.js'
import { hashPassword } from '../store/security.js'
import { randomUUID } from 'node:crypto'

class DatabaseService {
  constructor() {
    this.supabase = getSupabaseServiceClient()
  }

  // User operations
  async createUser(userData) {
    const { data, error } = await this.supabase
      .from('users')
      .insert([userData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserByEmail(email) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async getUserByLoginId(loginId) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('login_id', loginId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async getUserById(id) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async updateUser(id, updates) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getAllUsers() {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Restaurant operations
  async createRestaurant(restaurantData) {
    const { data, error } = await this.supabase
      .from('restaurants')
      .insert([restaurantData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getRestaurantById(id) {
    const { data, error } = await this.supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async getAllRestaurants() {
    const { data, error } = await this.supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async updateRestaurant(id, updates) {
    const { data, error } = await this.supabase
      .from('restaurants')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getRestaurantSettings(restaurantId) {
    const { data, error } = await this.supabase
      .from('restaurant_settings')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data?.notifications ?? {
      arrivalAlerts: true,
      orderUpdates: true,
      staffReminders: false,
      dailySummary: true,
    }
  }

  async updateRestaurantSettings(restaurantId, notifications) {
    const { data, error } = await this.supabase
      .from('restaurant_settings')
      .upsert({ restaurant_id: restaurantId, notifications, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return data.notifications
  }

  // Settings operations
  async getSettings() {
    const { data, error } = await this.supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 'main')
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data?.toggles ?? {
      geoTriggers: true,
      customerSignup: true,
      arrivalAlerts: true,
      autoCredentials: false,
      maintenanceMode: false,
      analyticsTracking: true,
    }
  }

  async updateSettings(toggles) {
    const { data, error } = await this.supabase
      .from('platform_settings')
      .upsert({ id: 'main', toggles, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) throw error
    return data.toggles
  }

  // Customer profile operations
  async createCustomerProfile(profileData) {
    const { data, error } = await this.supabase
      .from('customer_profiles')
      .insert([profileData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getCustomerProfileByUserId(userId) {
    const { data, error } = await this.supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async updateCustomerProfile(userId, updates) {
    const { data, error } = await this.supabase
      .from('customer_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Session operations
  async createSession(sessionId, userId, data, expiresAt) {
    const { data: sessionData, error } = await this.supabase
      .from('user_sessions')
      .insert([{
        id: sessionId,
        user_id: userId,
        data,
        expires_at: expiresAt
      }])
      .select()
      .single()

    if (error) throw error
    return sessionData
  }

  async getSession(sessionId) {
    const { data, error } = await this.supabase
      .from('user_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async updateSession(sessionId, data, expiresAt) {
    const { data: sessionData, error } = await this.supabase
      .from('user_sessions')
      .update({
        data,
        expires_at: expiresAt
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error
    return sessionData
  }

  async deleteSession(sessionId) {
    const { error } = await this.supabase
      .from('user_sessions')
      .delete()
      .eq('id', sessionId)

    if (error) throw error
  }

  async cleanExpiredSessions() {
    const { error } = await this.supabase
      .from('user_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString())

    if (error) throw error
  }

  // Initialize database with seed data
  async initializeDatabase() {
    // Check if data already exists
    const existingUsers = await this.getAllUsers()
    if (existingUsers.length > 0) {
      return { message: 'Database already initialized' }
    }

    const createdAt = new Date().toISOString()
    
    // Create admin user
    const adminId = randomUUID()
    const adminUser = {
      id: adminId,
      role: 'admin',
      name: 'AyoZ Super Admin',
      email: 'admin@ayoz.in',
      login_id: 'AYOZADMIN',
      password_hash: await hashPassword('Admin@12345'),
      created_at: createdAt
    }
    await this.createUser(adminUser)

    // Create restaurant
    const restaurantId = randomUUID()
    const restaurant = {
      id: restaurantId,
      name: 'Saffron Table',
      city: 'Ahmedabad',
      cuisine: 'North Indian Fusion',
      description: 'A premium dining partner using arrival-based kitchen timing.',
      contact_name: 'Riya Malhotra',
      contact_email: 'ops@saffrontable.com',
      login_id: 'AYOZREST01',
      status: 'Live',
      seating_capacity: 84,
      service_model: 'Chef-led dining lounge',
      operating_hours: '12:30 PM - 11:00 PM',
      stats: {
        todayOrders: 18,
        readyRate: 97,
        avgPrepMins: 14,
        todayRevenue: 14580,
        arrivalAlerts: 7,
        repeatGuests: 5,
        satisfaction: 97,
        tableTurnMins: 42
      },
      menu: [
        {
          id: randomUUID(),
          name: 'North Indian Arrival Bowl',
          category: 'Guest favorite',
          prepMinutes: 12,
          price: 320,
          demand: 'High'
        }
      ],
      recent_orders: [],
      staff: [],
      zones: [],
      inventory_alerts: [],
      created_by: adminId,
      created_at: createdAt
    }
    await this.createRestaurant(restaurant)

    // Create restaurant user
    const restaurantUserId = randomUUID()
    const restaurantUser = {
      id: restaurantUserId,
      role: 'restaurant',
      name: 'Riya Malhotra',
      email: 'ops@saffrontable.com',
      login_id: 'AYOZREST01',
      restaurant_id: restaurantId,
      password_hash: await hashPassword('AyoZ@Rest01'),
      created_at: createdAt,
      created_by: adminId
    }
    await this.createUser(restaurantUser)

    // Create customer user
    const customerId = randomUUID()
    const customerUser = {
      id: customerId,
      role: 'customer',
      name: 'Aisha Kapoor',
      email: 'guest@ayoz.in',
      phone: '+91 98765 43210',
      login_id: 'AYOZCUST01',
      password_hash: await hashPassword('Guest@12345'),
      created_at: createdAt
    }
    await this.createUser(customerUser)

    // Create customer profile
    const customerProfile = {
      id: randomUUID(),
      user_id: customerId,
      loyalty_points: 240,
      wallet_balance: 1250,
      preferred_city: 'Ahmedabad',
      favorite_cuisine: 'North Indian',
      upcoming_visit: 'Friday, 7:30 PM',
      saved_restaurant_ids: [restaurantId],
      recent_orders: [
        {
          id: randomUUID(),
          restaurantName: 'Saffron Table',
          status: 'Ready on arrival',
          amount: 640,
          visitTime: 'Yesterday'
        }
      ],
      membership_tier: 'Gold Circle',
      preferred_mood: 'Quick dinner, premium plating',
      celebration_date: 'Saturday, 8:15 PM',
      total_visits: 6,
      reward_progress: {
        current: 240,
        nextTier: 400
      }
    }
    await this.createCustomerProfile(customerProfile)

    return { message: 'Database initialized successfully' }
  }

  // Staff member operations
  async createStaffMember(data) {
    const { data: row, error } = await this.supabase
      .from('staff_members')
      .insert([data])
      .select()
      .single()
    if (error) throw error
    return row
  }

  async getStaffByRestaurant(restaurantId) {
    const { data, error } = await this.supabase
      .from('staff_members')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  }

  async getStaffMemberById(id) {
    const { data, error } = await this.supabase
      .from('staff_members')
      .select('*')
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async updateStaffMember(id, updates) {
    const { data, error } = await this.supabase
      .from('staff_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async deleteStaffMember(id) {
    const { error } = await this.supabase
      .from('staff_members')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // Menu item operations
  async createMenuItem(itemData) {
    const { data, error } = await this.supabase
      .from('menu_items')
      .insert([itemData])
      .select()
      .single()
    if (error) throw error
    return data
  }

  async getMenuItemsByRestaurant(restaurantId) {
    const { data, error } = await this.supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  }

  async getMenuItemById(id) {
    const { data, error } = await this.supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async updateMenuItem(id, updates) {
    const { data, error } = await this.supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async deleteMenuItem(id) {
    const { error } = await this.supabase
      .from('menu_items')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // Supabase Storage – upload image and return public CDN URL
  async uploadMenuImage(fileName, fileBuffer, mimeType) {
    const { error } = await this.supabase.storage
      .from('menu-images')
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      })
    if (error) throw error

    const { data } = this.supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  async deleteMenuImage(fileName) {
    const { error } = await this.supabase.storage
      .from('menu-images')
      .remove([fileName])
    if (error) throw error
  }

  // Helper method to get user with profile data
  async getUserWithProfile(userId) {
    const user = await this.getUserById(userId)
    if (!user) return null

    if (user.role === 'customer') {
      const profile = await this.getCustomerProfileByUserId(userId)
      return { ...user, profile }
    }

    if (user.role === 'restaurant' && user.restaurant_id) {
      const restaurant = await this.getRestaurantById(user.restaurant_id)
      return { ...user, restaurant }
    }

    return user
  }
}

export const db = new DatabaseService()
export default db