import { randomBytes, randomUUID } from 'node:crypto'

const TEAM_BLUEPRINT = [
  {
    name: 'Riya Malhotra',
    role: 'Floor Lead',
    shift: '5:30 PM - 11:30 PM',
    status: 'On station',
    score: 96,
  },
  {
    name: 'Kabir Jain',
    role: 'Expediter',
    shift: '5:00 PM - 10:30 PM',
    status: 'Watching arrivals',
    score: 92,
  },
  {
    name: 'Aarav Patel',
    role: 'Sous Chef',
    shift: '4:30 PM - 11:00 PM',
    status: 'Hot line',
    score: 94,
  },
  {
    name: 'Sara Khan',
    role: 'Guest Host',
    shift: '6:00 PM - 10:00 PM',
    status: 'Front desk',
    score: 91,
  },
  {
    name: 'Nikhil Desai',
    role: 'Dessert Station',
    shift: '6:30 PM - 11:00 PM',
    status: 'Prep backup',
    score: 89,
  },
]

export function formatCurrency(value) {
  return `INR ${Number(value ?? 0).toLocaleString('en-IN')}`
}

export function sanitizeUser(user) {
  const { passwordHash, password_hash, ...safeUser } = user
  return safeUser
}

export function titleToken(value, fallback = 'Signature') {
  const token = String(value ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)[0]

  return token || fallback
}

export function createStaffRoster() {
  return TEAM_BLUEPRINT.map((member) => ({
    id: randomUUID(),
    ...member,
  }))
}

export function createFloorZones(restaurantName) {
  const anchor = titleToken(restaurantName, 'Guest')

  return [
    {
      id: randomUUID(),
      name: `${anchor} Lounge`,
      occupied: 8,
      capacity: 10,
      status: 'Ready',
      note: 'Walk-ins are being merged into pre-booked arrivals.',
    },
    {
      id: randomUUID(),
      name: 'Main Dining',
      occupied: 18,
      capacity: 24,
      status: 'Active',
      note: 'Highest volume window is expected between 8:00 PM and 9:15 PM.',
    },
    {
      id: randomUUID(),
      name: 'Chef Counter',
      occupied: 4,
      capacity: 6,
      status: 'Watch',
      note: 'Hold premium seats for loyalty guests and late arrivals.',
    },
  ]
}

export function createInventoryAlerts(cuisine) {
  const anchor = titleToken(cuisine, 'Chef')

  return [
    {
      id: randomUUID(),
      item: `${anchor} sauce base`,
      level: 'Low',
      action: 'Prep one extra batch in the next 20 mins.',
      tone: 'amber',
    },
    {
      id: randomUUID(),
      item: 'Dessert garnish',
      level: 'Watch',
      action: 'Move one chilled tray closer to the pass.',
      tone: 'blue',
    },
    {
      id: randomUUID(),
      item: 'Packaging sleeves',
      level: 'Healthy',
      action: 'Stock is comfortable through closing.',
      tone: 'emerald',
    },
  ]
}

export function buildMenu(cuisine) {
  return [
    {
      id: randomUUID(),
      name: `${titleToken(cuisine)} Arrival Bowl`,
      category: 'Guest favorite',
      prepMinutes: 12,
      price: 320,
      demand: 'High',
    },
    {
      id: randomUUID(),
      name: 'Chef Special Platter',
      category: 'Fast moving',
      prepMinutes: 16,
      price: 410,
      demand: 'Medium',
    },
    {
      id: randomUUID(),
      name: 'Express Dessert Finish',
      category: 'Add-on',
      prepMinutes: 8,
      price: 180,
      demand: 'High',
    },
  ]
}

export function buildRecentOrders(guestNames = ['Guest A', 'Guest B', 'Guest C']) {
  const [g1, g2, g3] = guestNames
  return [
    {
      id: randomUUID(),
      guestName: g1,
      eta: '6 mins away',
      items: 3,
      amount: 920,
      status: 'Cooking now',
      table: 'Table 12',
      channel: 'Arrival alert',
    },
    {
      id: randomUUID(),
      guestName: g2,
      eta: 'Arrived',
      items: 2,
      amount: 540,
      status: 'Ready on table',
      table: 'Window 4',
      channel: 'Seated',
    },
    {
      id: randomUUID(),
      guestName: g3,
      eta: '12 mins away',
      items: 4,
      amount: 1280,
      status: 'Queued for alert',
      table: 'Family 7',
      channel: 'Geo-trigger standby',
    },
  ]
}

export function buildRestaurantStats(multiplier = 1) {
  return {
    todayOrders: 18 * multiplier,
    readyRate: Math.max(88, 97 - multiplier),
    avgPrepMins: 14 + multiplier,
    todayRevenue: 14580 * multiplier,
    arrivalAlerts: 7 * multiplier,
    repeatGuests: 5 * multiplier,
    satisfaction: Math.max(90, 97 - multiplier),
    tableTurnMins: Math.max(28, 42 - multiplier * 2),
  }
}

export function createCustomerProfile({ userId, restaurantId = null, restaurantName = 'Saffron Table' }) {
  const recentOrders = restaurantId
    ? [
        {
          id: randomUUID(),
          restaurantName,
          status: 'Ready on arrival',
          amount: 640,
          visitTime: 'Yesterday',
        },
        {
          id: randomUUID(),
          restaurantName,
          status: 'Served in 11 mins',
          amount: 890,
          visitTime: 'Last weekend',
        },
      ]
    : []

  return {
    id: randomUUID(),
    userId,
    loyaltyPoints: 240,
    walletBalance: 1250,
    preferredCity: 'Ahmedabad',
    favoriteCuisine: 'North Indian',
    upcomingVisit: 'Friday, 7:30 PM',
    savedRestaurantIds: restaurantId ? [restaurantId] : [],
    recentOrders,
    membershipTier: 'Gold Circle',
    preferredMood: 'Quick dinner, premium plating',
    celebrationDate: 'Saturday, 8:15 PM',
    totalVisits: recentOrders.length + 4,
    rewardProgress: {
      current: 240,
      nextTier: 400,
    },
  }
}

export function makeRestaurantRecord({
  id,
  name,
  city,
  cuisine,
  description,
  contactName,
  contactEmail,
  loginId,
  createdBy,
  createdAt,
  status = 'Live onboarding',
  seatingCapacity = 72,
  serviceModel = 'Smart dine-in service',
  multiplier = 1,
  guestNames,
}) {
  return {
    id,
    name,
    city,
    cuisine,
    description,
    contactName,
    contactEmail,
    loginId,
    createdBy,
    createdAt,
    status,
    seatingCapacity,
    serviceModel,
    operatingHours: '12:30 PM - 11:00 PM',
    stats: buildRestaurantStats(multiplier),
    menu: buildMenu(cuisine),
    recentOrders: buildRecentOrders(guestNames),
    staff: createStaffRoster(),
    zones: createFloorZones(name),
    inventoryAlerts: createInventoryAlerts(cuisine),
  }
}

export function buildRestaurantLoginId(store, name) {
  const base =
    (name || 'RESTAURANT')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 8) || 'AYOZREST'

  let suffix = 1
  let candidate = `${base}${String(suffix).padStart(2, '0')}`

  while (store.users.some((user) => user.loginId === candidate)) {
    suffix += 1
    candidate = `${base}${String(suffix).padStart(2, '0')}`
  }

  return candidate
}

export function buildCustomerLoginId(store) {
  let suffix = 1
  let candidate = `AYOZCUST${String(suffix).padStart(2, '0')}`

  while (store.users.some((user) => user.loginId === candidate)) {
    suffix += 1
    candidate = `AYOZCUST${String(suffix).padStart(2, '0')}`
  }

  return candidate
}

export function generateTemporaryPassword() {
  return `AyoZ@${randomBytes(3).toString('hex').toUpperCase()}`
}
