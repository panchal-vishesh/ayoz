import { randomUUID } from 'node:crypto'
import { createCustomerProfile, makeRestaurantRecord } from './records.js'
import { hashPassword } from './security.js'

export async function createDefaultStore() {
  const createdAt = new Date().toISOString()
  const adminId = randomUUID()
  const restaurantId = randomUUID()
  const restaurantUserId = randomUUID()
  const customerId = randomUUID()
  const [adminPasswordHash, restaurantPasswordHash, customerPasswordHash] = await Promise.all([
    hashPassword('Admin@12345'),
    hashPassword('AyoZ@Rest01'),
    hashPassword('Guest@12345'),
  ])

  const restaurant = makeRestaurantRecord({
    id: restaurantId,
    name: 'Saffron Table',
    city: 'Ahmedabad',
    cuisine: 'North Indian Fusion',
    description: 'A premium dining partner using arrival-based kitchen timing.',
    contactName: 'Riya Malhotra',
    contactEmail: 'ops@saffrontable.com',
    loginId: 'AYOZREST01',
    createdBy: adminId,
    createdAt,
    status: 'Live',
    seatingCapacity: 84,
    serviceModel: 'Chef-led dining lounge',
    guestNames: ['Priya Sharma', 'Arjun Nair', 'Meera Iyer'],
  })

  return {
    meta: {
      seededAt: createdAt,
      updatedAt: createdAt,
    },
    users: [
      {
        id: adminId,
        role: 'admin',
        name: 'AyoZ Super Admin',
        email: 'admin@ayoz.in',
        loginId: 'AYOZADMIN',
        passwordHash: adminPasswordHash,
        createdAt,
      },
      {
        id: restaurantUserId,
        role: 'restaurant',
        name: 'Riya Malhotra',
        email: 'ops@saffrontable.com',
        loginId: 'AYOZREST01',
        restaurantId,
        passwordHash: restaurantPasswordHash,
        createdAt,
        createdBy: adminId,
      },
      {
        id: customerId,
        role: 'customer',
        name: 'Aisha Kapoor',
        email: 'guest@ayoz.in',
        phone: '+91 98765 43210',
        loginId: 'AYOZCUST01',
        passwordHash: customerPasswordHash,
        createdAt,
      },
    ],
    restaurants: [restaurant],
    customerProfiles: [createCustomerProfile({ userId: customerId, restaurantId, restaurantName: 'Saffron Table' })],
  }
}

export async function buildInitialStore() {
  return createDefaultStore()
}
