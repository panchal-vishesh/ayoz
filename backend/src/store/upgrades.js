import {
  buildMenu,
  buildRecentOrders,
  buildRestaurantStats,
  createCustomerProfile,
  createFloorZones,
  createInventoryAlerts,
  createStaffRoster,
} from './records.js'

function getRestaurantMultiplier(restaurant, index = 0) {
  const derived = Math.round((restaurant.stats?.todayOrders ?? 18) / 18)
  return Number.isFinite(derived) && derived > 0 ? derived : index + 1
}

export function upgradeRestaurantRecord(restaurant, index = 0) {
  return {
    ...restaurant,
    status: restaurant.status ?? 'Live onboarding',
    seatingCapacity: restaurant.seatingCapacity ?? 72 + index * 8,
    serviceModel: restaurant.serviceModel ?? 'Smart dine-in service',
    operatingHours: restaurant.operatingHours ?? '12:30 PM - 11:00 PM',
    stats: {
      ...buildRestaurantStats(getRestaurantMultiplier(restaurant, index)),
      ...(restaurant.stats ?? {}),
    },
    menu: restaurant.menu?.length ? restaurant.menu : buildMenu(restaurant.cuisine),
    recentOrders: restaurant.recentOrders?.length ? restaurant.recentOrders : buildRecentOrders(),
    staff: restaurant.staff?.length ? restaurant.staff : createStaffRoster(),
    zones: restaurant.zones?.length ? restaurant.zones : createFloorZones(restaurant.name),
    inventoryAlerts: restaurant.inventoryAlerts?.length
      ? restaurant.inventoryAlerts
      : createInventoryAlerts(restaurant.cuisine),
  }
}

function upgradeCustomerProfile(profile) {
  const savedRestaurantIds = Array.isArray(profile.savedRestaurantIds) ? profile.savedRestaurantIds : []
  const recentOrders = Array.isArray(profile.recentOrders) ? profile.recentOrders : []
  const currentPoints = Number(profile.rewardProgress?.current ?? profile.loyaltyPoints ?? 240)
  const nextTier = Number(profile.rewardProgress?.nextTier ?? Math.max(currentPoints + 160, 400))

  return {
    loyaltyPoints: 240,
    walletBalance: 1250,
    preferredCity: 'Ahmedabad',
    favoriteCuisine: 'North Indian',
    upcomingVisit: 'Friday, 7:30 PM',
    membershipTier: 'Gold Circle',
    preferredMood: 'Quick dinner, premium plating',
    celebrationDate: 'Saturday, 8:15 PM',
    totalVisits: recentOrders.length + 4,
    ...profile,
    savedRestaurantIds,
    recentOrders,
    rewardProgress: {
      current: currentPoints,
      nextTier,
    },
  }
}

export function normalizeStore(store) {
  const nextStore = {
    meta: store.meta ?? {},
    users: [...(store.users ?? [])],
    restaurants: [...(store.restaurants ?? [])],
    customerProfiles: [...(store.customerProfiles ?? [])],
  }

  const customerIds = new Set(nextStore.customerProfiles.map((profile) => profile.userId))

  nextStore.users
    .filter((user) => user.role === 'customer')
    .forEach((user) => {
      if (!customerIds.has(user.id)) {
        nextStore.customerProfiles.push(createCustomerProfile({ userId: user.id }))
      }
    })

  nextStore.restaurants = nextStore.restaurants.map((restaurant, index) =>
    upgradeRestaurantRecord(restaurant, index),
  )
  nextStore.customerProfiles = nextStore.customerProfiles.map(upgradeCustomerProfile)

  return nextStore
}
