import {
  Area, AreaChart, Bar, BarChart, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

const tooltipStyle = {
  contentStyle: {
    background: 'rgba(10,14,28,0.96)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '14px',
    fontSize: '0.75rem',
    color: '#e2e8f0',
  },
  itemStyle: { color: '#cbd5e1' },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
}

const axisStyle = { fontSize: 11, fill: '#64748b', fontFamily: 'inherit' }

// Admin — revenue line chart across restaurants (alias kept for back-compat)
export { RevenueTrendChart as RevenueLineChart }
export function RevenueTrendChart({ items = [] }) {
  if (!items.length) return null
  const data = items.slice(0, 8).map((r) => ({
    name: String(r.name ?? '').slice(0, 10),
    revenue: Number(String(r.stats?.todayRevenue ?? '0').replace(/[^0-9.]/g, '')) || 0,
    orders: Number(String(r.stats?.todayOrders ?? '0').replace(/[^0-9]/g, '')) || 0,
  }))
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
        <Tooltip {...tooltipStyle} formatter={(v, n) => [n === 'revenue' ? `₹${v.toLocaleString('en-IN')}` : v, n === 'revenue' ? 'Revenue' : 'Orders']} />
        <Legend wrapperStyle={{ fontSize: '0.72rem', color: '#94a3b8' }} />
        <Area type="monotone" dataKey="revenue" name="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" dot={{ r: 3, fill: '#6366f1' }} />
        <Area type="monotone" dataKey="orders" name="orders" stroke="#3b82f6" strokeWidth={2} fill="url(#ordGrad)" dot={{ r: 3, fill: '#3b82f6' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Admin — revenue area chart across cities
export function CityRevenueChart({ items = [] }) {
  if (!items.length) return null
  const data = items.map((c) => ({
    name: c.city,
    orders: Number(c.orders) || 0,
    restaurants: Number(c.restaurants) || 0,
    fill: Number(c.fill) || 0,
  }))
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barGap={4}>
        <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: '0.72rem', color: '#94a3b8' }} />
        <Bar dataKey="orders" name="Orders" radius={[6, 6, 0, 0]} fill="#3b82f6" opacity={0.85} />
        <Bar dataKey="restaurants" name="Restaurants" radius={[6, 6, 0, 0]} fill="#06b6d4" opacity={0.7} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Admin — platform pulse area chart
export function PlatformPulseChart({ items = [] }) {
  if (!items.length) return null
  const data = items.map((p) => ({ name: p.label, value: Number(p.fill) || 0 }))
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} domain={[0, 100]} />
        <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, 'Readiness']} />
        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#pulseGrad)" dot={{ r: 3, fill: '#3b82f6' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Restaurant — hourly orders area chart (mock from serviceBoard)
export function ServiceFlowChart({ items = [] }) {
  if (!items.length) return null
  const data = items.map((s) => ({ name: s.label, value: Number(s.fill) || 0 }))
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="serviceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} domain={[0, 100]} />
        <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, 'Load']} />
        <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#serviceGrad)" dot={{ r: 3, fill: '#10b981' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Restaurant — menu share pie chart
export function MenuShareChart({ items = [] }) {
  if (!items.length) return null
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4']
  const data = items.slice(0, 6).map((m) => ({
    name: m.name,
    value: Number(m.fill) || 10,
  }))
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v, n) => [`${v}%`, n]} />
        <Legend wrapperStyle={{ fontSize: '0.72rem', color: '#94a3b8' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Customer — spending area chart (from recentOrders)
export function SpendingChart({ items = [] }) {
  if (!items.length) return null
  const data = items.map((o) => ({
    name: o.restaurantName?.slice(0, 10) ?? 'Visit',
    amount: Number(String(o.amount ?? '0').replace(/[^0-9.]/g, '')) || 0,
  }))
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
        <Tooltip {...tooltipStyle} formatter={(v) => [`₹${v}`, 'Spent']} />
        <Area type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={2} fill="url(#spendGrad)" dot={{ r: 3, fill: '#f97316' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Customer — reward points bar chart (mock tiers)
export function RewardTierChart({ profile }) {
  const current = profile?.rewardProgress?.current ?? 0
  const nextTier = profile?.rewardProgress?.nextTier ?? 500
  const data = [
    { name: 'Starter', target: 100, fill: '#94a3b8' },
    { name: 'Silver', target: 250, fill: '#3b82f6' },
    { name: 'Gold', target: 500, fill: '#f59e0b' },
    { name: 'Platinum', target: nextTier, fill: '#f97316' },
  ].map((t) => ({ ...t, earned: Math.min(current, t.target) }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barGap={4}>
        <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={36} />
        <Tooltip {...tooltipStyle} formatter={(v, n) => [v, n === 'earned' ? 'Your points' : 'Tier target']} />
        <Bar dataKey="target" name="Tier target" radius={[6, 6, 0, 0]} opacity={0.2}>
          {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
        </Bar>
        <Bar dataKey="earned" name="Your points" radius={[6, 6, 0, 0]} opacity={0.9}>
          {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
