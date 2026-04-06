import { formatCurrency } from '../store/index.js'
import db from './database.js'

function average(values) {
  if (!values.length) return 0
  return Math.round(values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length)
}

function buildCityPerformance(restaurants) {
  const groups = new Map()

  restaurants.forEach((r) => {
    const current = groups.get(r.city) ?? { city: r.city, restaurants: 0, orders: 0, revenue: 0, readiness: 0 }
    current.restaurants += 1
    current.orders += Number(r.stats?.todayOrders ?? 0)
    current.revenue += Number(r.stats?.todayRevenue ?? 0)
    current.readiness += Number(r.stats?.readyRate ?? 0)
    groups.set(r.city, current)
  })

  return [...groups.values()]
    .map((entry) => {
      const readiness = Math.round(entry.readiness / Math.max(1, entry.restaurants))
      return {
        city: entry.city,
        restaurants: entry.restaurants,
        orders: String(entry.orders),
        revenue: formatCurrency(entry.revenue),
        readiness: `${readiness}%`,
        fill: readiness,
      }
    })
    .sort((a, b) => Number(b.orders) - Number(a.orders))
}

export async function buildDashboard(req, user) {
  if (!user) return null

  if (user.role === 'admin') {
    return buildAdminDashboard(user)
  }

  if (user.role === 'restaurant') {
    return buildRestaurantDashboard(user)
  }

  return buildCustomerDashboard(user)
}

async function buildAdminDashboard(user) {
  const allUsers = await db.getAllUsers()
  const restaurants = await db.getAllRestaurants()

  const customers = allUsers.filter((u) => u.role === 'customer')
  const restaurantUsers = allUsers.filter((u) => u.role === 'restaurant')
  const totalRevenue = restaurants.reduce((s, r) => s + Number(r.stats?.todayRevenue ?? 0), 0)
  const totalAlerts = restaurants.reduce((s, r) => s + Number(r.stats?.arrivalAlerts ?? 0), 0)
  const liveCities = new Set(restaurants.map((r) => r.city)).size
  const avgReadyRate = average(restaurants.map((r) => r.stats?.readyRate))
  const avgPrepMins = average(restaurants.map((r) => r.stats?.avgPrepMins))

  return {
    role: 'admin',
    heading: 'Admin command deck',
    subheading: 'Run onboarding, watch city readiness, and keep every restaurant balanced for arrival-based service.',
    overview: [
      { label: 'Restaurants live', value: String(restaurants.length), detail: 'Venues active inside the rollout program', tone: 'blue' },
      { label: 'Customer accounts', value: String(customers.length), detail: 'Guests who can plan and order ahead', tone: 'emerald' },
      { label: 'Restaurant logins', value: String(restaurantUsers.length), detail: 'Venue manager accounts issued by admin', tone: 'slate' },
      { label: 'GMV today', value: formatCurrency(totalRevenue), detail: 'Revenue tracked across live kitchens', tone: 'amber' },
    ],
    platformPulse: [
      { label: 'Cities live', value: String(liveCities), detail: 'Current geographic coverage', fill: Math.min(100, liveCities * 28), tone: 'blue' },
      { label: 'Hot-serve success', value: `${avgReadyRate}%`, detail: 'Meals landing on-table on time', fill: avgReadyRate, tone: 'emerald' },
      { label: 'Arrival alerts fired', value: String(totalAlerts), detail: 'Kitchen triggers sent today', fill: Math.min(100, totalAlerts * 10), tone: 'amber' },
      { label: 'Average prep', value: `${avgPrepMins} mins`, detail: 'From trigger to hot pass', fill: Math.max(12, 100 - avgPrepMins * 4), tone: 'slate' },
    ],
    cityPerformance: buildCityPerformance(restaurants),
    activityFeed: restaurants.slice(0, 4).map((r, index) => ({
      id: `${r.id}-activity-${index}`,
      restaurantName: r.name,
      title: ['Arrival timing synced', 'Ops handoff complete', 'Menu pulse reviewed', 'Support note added'][index % 4],
      detail: ['Kitchen triggers are now active for evening service.', 'Restaurant manager credentials were acknowledged by the venue team.', 'Top dishes were re-ranked after today\'s booking wave.', 'Follow-up checklist queued for launch-readiness review.'][index % 4],
      tone: ['blue', 'emerald', 'amber', 'slate'][index % 4],
      time: ['Just now', '18 mins ago', '42 mins ago', '1 hr ago'][index % 4],
    })),
    supportQueue: restaurants.slice(0, 3).map((r, index) => ({
      id: `${r.id}-support-${index}`,
      restaurantName: r.name,
      issue: ['Finalize hero photography upload', 'Confirm weekend seating override', 'Review prep buffer after 8 PM'][index % 3],
      owner: ['Creative ops', 'Restaurant success', 'Performance desk'][index % 3],
      priority: ['Low', 'Medium', 'High'][index % 3],
      eta: ['Today, 6:30 PM', 'Today, 7:10 PM', 'Immediate'][index % 3],
      tone: ['blue', 'amber', 'brand'][index % 3],
    })),
    recentCredentials: restaurants.slice(0, 4).map((r) => ({
      id: r.id,
      restaurantName: r.name,
      loginId: r.login_id,
      contactEmail: r.contact_email,
      issuedAt: r.created_at,
      serviceModel: r.service_model,
      seatingCapacity: r.seating_capacity,
    })),
    restaurants: restaurants.map((r, index) => ({
      id: r.id,
      name: r.name,
      city: r.city,
      cuisine: r.cuisine,
      status: r.status,
      contactName: r.contact_name,
      contactEmail: r.contact_email,
      loginId: r.login_id,
      createdAt: r.created_at,
      serviceModel: r.service_model,
      seatingCapacity: r.seating_capacity,
      operatingHours: r.operating_hours,
      staffCount: r.staff?.length ?? 0,
      priority: index === 0 ? 'Prime coverage' : index === 1 ? 'Scale next' : 'Stable operations',
      stats: {
        todayOrders: String(r.stats?.todayOrders ?? 0),
        readyRate: `${r.stats?.readyRate ?? 0}%`,
        avgPrepMins: `${r.stats?.avgPrepMins ?? 0} mins`,
        todayRevenue: formatCurrency(r.stats?.todayRevenue ?? 0),
        arrivalAlerts: String(r.stats?.arrivalAlerts ?? 0),
      },
    })),
    guidance: [
      'Only admin can create restaurant access and distribute login credentials.',
      'Restaurant teams should receive credentials one time and rotate them after onboarding.',
      'Customer signup stays separate so guest growth never blocks restaurant operations.',
    ],
  }
}

async function buildRestaurantDashboard(user) {
  const restaurant = await db.getRestaurantById(user.restaurant_id)

  if (!restaurant) {
    return {
      role: 'restaurant',
      heading: 'Restaurant dashboard unavailable',
      subheading: 'This restaurant account has not been linked yet.',
      overview: [], restaurant: null, serviceBoard: [], guestSignals: [],
      staffRoster: [], inventoryAlerts: [], menuPerformance: [], floorZones: [], checklist: [], guidance: [],
    }
  }

  // Get real menu items from database
  const menuItems = await db.getMenuItemsByRestaurant(restaurant.id)
  const staffMembers = await db.getStaffByRestaurant(restaurant.id)

  // Always show zero stats - real stats come from actual orders placed today
  const stats = {
    todayOrders: 0,
    readyRate: 0,
    avgPrepMins: 0,
    todayRevenue: 0,
    arrivalAlerts: 0,
    repeatGuests: 0,
    satisfaction: 0,
    tableTurnMins: 0,
  }

  const floorZones = (restaurant.zones ?? []).map((zone) => ({
    ...zone,
    occupancy: `${zone.occupied}/${zone.capacity}`,
    fill: Math.round((Number(zone.occupied ?? 0) / Math.max(1, Number(zone.capacity ?? 1))) * 100),
  }))

  const guestSignals = (restaurant.recent_orders ?? []).map((order, index) => ({
    ...order,
    amount: formatCurrency(order.amount),
    tone: order.status === 'Ready on table' ? 'emerald' : order.status === 'Cooking now' ? 'brand' : 'blue',
    priority: index === 0 ? 'Immediate' : index === 1 ? 'At table' : 'Queued',
  }))

  // Use real menu items from DB, fall back to restaurant.menu if empty
  const menuSource = menuItems.length > 0 ? menuItems : (restaurant.menu ?? [])
  const menuPerformance = menuSource.map((item, index) => ({
    ...item,
    prepMinutes: item.prep_minutes ?? item.prepMinutes,
    price: formatCurrency(item.price),
    share: `${32 - index * 7}% of orders`,
    margin: index === 0 ? 'Strong margin' : index === 1 ? 'Healthy repeat' : 'Upsell item',
    fill: Math.max(36, 82 - index * 16),
    tone: index === 0 ? 'brand' : index === 1 ? 'blue' : 'emerald',
  }))

  return {
    role: 'restaurant',
    heading: `${restaurant.name} service deck`,
    subheading: 'Watch arrivals, prep pace, staff coverage, and menu movers from one compact operations view.',
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      city: restaurant.city,
      cuisine: restaurant.cuisine,
      description: restaurant.description,
      status: restaurant.status,
      contactName: restaurant.contact_name,
      contactEmail: restaurant.contact_email,
      loginId: restaurant.login_id,
      createdAt: restaurant.created_at,
      serviceModel: restaurant.service_model,
      seatingCapacity: restaurant.seating_capacity,
      operatingHours: restaurant.operating_hours,
    },
    overview: [
      { label: 'Orders today', value: '0', detail: 'No orders recorded yet today', tone: 'brand' },
      { label: 'Hot-serve rate', value: '—', detail: 'Will update as orders come in', tone: 'emerald' },
      { label: 'Arrival alerts', value: '0', detail: 'No alerts fired yet today', tone: 'blue' },
      { label: 'Revenue today', value: '—', detail: 'No revenue recorded yet today', tone: 'slate' },
    ],
    serviceBoard: [
      { label: 'Guests on the way', value: '0', detail: 'ETA under 15 mins', fill: 0, tone: 'blue' },
      { label: 'Cooking now', value: '0', detail: 'Live fires across kitchen stations', fill: 0, tone: 'brand' },
      { label: 'Ready to serve', value: '0', detail: 'Plates held for under 4 mins', fill: 0, tone: 'emerald' },
      { label: 'Table reset pace', value: '—', detail: 'Front-of-house reset estimate', fill: 0, tone: 'slate' },
    ],
    guestSignals,
    staffRoster: staffMembers.length > 0 ? staffMembers : (restaurant.staff ?? []),
    inventoryAlerts: (restaurant.inventory_alerts ?? []).map((item) => ({ ...item, tone: item.tone ?? 'slate' })),
    menuPerformance,
    floorZones,
    checklist: [
      { id: 'arrival-sync', label: 'Arrival trigger board synced', note: 'No triggers fired yet today.', done: false },
      { id: 'host-brief', label: 'Front desk brief shared', note: 'Hosts should hold premium seats for loyalty guests after 8 PM.', done: false },
      { id: 'dessert-buffer', label: 'Dessert backup batch', note: 'Complete one extra chilled backup tray before peak hour.', done: false },
      { id: 'vip-window', label: 'VIP table holdback', note: 'Reserve the chef counter for celebration bookings and gold-tier members.', done: false },
    ],
    guidance: [
      'Restaurant credentials are issued by admin and should stay with management only.',
      'Arrival alerts help the kitchen start late enough for freshness and early enough for speed.',
      'Use the menu and floor cards to spot bottlenecks before they become delays.',
    ],
  }
}

async function buildCustomerDashboard(user) {
  const profile = await db.getCustomerProfileByUserId(user.id)
  const restaurants = await db.getAllRestaurants()

  const rewardCurrent = Number(profile?.reward_progress?.current ?? profile?.loyalty_points ?? 0)
  const rewardNext = Number(profile?.reward_progress?.nextTier ?? Math.max(rewardCurrent + 160, 400))
  const rewardPercent = Math.min(100, Math.round((rewardCurrent / Math.max(1, rewardNext)) * 100))
  const savedRestaurantIds = profile?.saved_restaurant_ids ?? []
  const savedRestaurants = restaurants.filter((r) => savedRestaurantIds.includes(r.id))
  const featuredRestaurants = restaurants.slice(0, 3)
  const planRestaurant = savedRestaurants[0] ?? featuredRestaurants[0] ?? null

  return {
    role: 'customer',
    heading: `${user.name.split(' ')[0]}, your next table is getting ready`,
    subheading: 'Plan the evening, unlock perks, and keep favorite restaurants ready before you arrive.',
    profile: {
      loyaltyPoints: profile?.loyalty_points ?? 0,
      walletBalance: formatCurrency(profile?.wallet_balance ?? 0),
      preferredCity: profile?.preferred_city ?? 'Ahmedabad',
      favoriteCuisine: profile?.favorite_cuisine ?? 'Mixed',
      upcomingVisit: profile?.upcoming_visit ?? 'No upcoming visit',
      membershipTier: profile?.membership_tier ?? 'Starter',
      preferredMood: profile?.preferred_mood ?? 'Quick dinner',
      celebrationDate: profile?.celebration_date ?? 'Not planned yet',
      totalVisits: profile?.total_visits ?? 0,
      rewardProgress: { current: rewardCurrent, nextTier: rewardNext, percent: rewardPercent },
    },
    overview: [
      { label: 'Loyalty points', value: String(profile?.loyalty_points ?? 0), detail: 'Progress toward your next dining tier', tone: 'brand' },
      { label: 'Wallet balance', value: formatCurrency(profile?.wallet_balance ?? 0), detail: 'Ready for your next arrival order', tone: 'blue' },
      { label: 'Saved restaurants', value: String(savedRestaurants.length), detail: 'Places you can return to fast', tone: 'emerald' },
      { label: 'Visits completed', value: String(profile?.total_visits ?? 0), detail: 'Arrival-timed dining sessions tracked', tone: 'slate' },
    ],
    diningPlan: {
      restaurantName: planRestaurant?.name ?? 'Choose your next venue',
      time: profile?.upcoming_visit ?? 'No visit planned',
      eta: '18 mins from your current area',
      partySize: 2,
      tableNote: 'Window-side setup with fast kitchen timing',
      confidence: `${Math.min(98, 82 + savedRestaurants.length * 6)}% arrival match`,
    },
    rewardVault: [
      { id: 'blue-hour-credit', title: 'Blue Hour credit', value: 'INR 150', detail: 'Use before 7:00 PM on weekday arrival orders.', tone: 'blue' },
      { id: 'chef-counter-unlock', title: 'Chef counter unlock', value: '2-seat hold', detail: 'Auto-hold for your celebration night.', tone: 'brand' },
      { id: 'dessert-upgrade', title: 'Express dessert perk', value: 'Free upgrade', detail: 'Unlocked after two ready-on-arrival visits.', tone: 'emerald' },
    ],
    featuredRestaurants: featuredRestaurants.map((r, index) => ({
      id: r.id, name: r.name, city: r.city, cuisine: r.cuisine, description: r.description,
      averagePrep: `${r.stats?.avgPrepMins ?? 0} mins`,
      topDish: r.menu?.[0]?.name ?? 'Chef special',
      seatingCapacity: r.seating_capacity,
      serviceModel: r.service_model,
      match: index === 0 ? 'Best match tonight' : index === 1 ? 'Trending fast' : 'Smooth service',
      tone: index === 0 ? 'brand' : index === 1 ? 'blue' : 'emerald',
    })),
    savedRestaurants: savedRestaurants.map((r) => ({
      id: r.id, name: r.name, city: r.city, cuisine: r.cuisine,
      averagePrep: `${r.stats?.avgPrepMins ?? 0} mins`,
      topDish: r.menu?.[0]?.name ?? 'Chef special',
      serviceModel: r.service_model,
    })),
    recentOrders: (profile?.recent_orders ?? []).map((order) => ({ ...order, amount: formatCurrency(order.amount) })),
    guidance: [
      'Customers can sign up directly and keep their own favorites and rewards.',
      'Saved restaurants help you rebook quickly without losing timing preferences.',
      'Restaurant accounts are separate because venue operations are managed by admin.',
    ],
  }
}
