import { useEffect, useState } from 'react'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import { motion } from 'framer-motion'
import { api } from '../../api/client'
import { formatDateLabel } from '../shared'
import { useSettings } from '../../hooks/useSettings.jsx'

const CARD = 'rounded-2xl border border-white/[0.08] bg-[rgba(15,20,40,0.65)] backdrop-blur-sm'
const INNER = 'rounded-xl border border-white/[0.06] bg-white/[0.03]'

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ enabled, onChange, saving }) {
  return (
    <button
      onClick={() => !saving && onChange(!enabled)}
      disabled={saving}
      className={`relative flex h-6 w-11 items-center rounded-full transition-colors duration-200 disabled:opacity-60 ${
        enabled ? 'bg-blue-600' : 'bg-white/[0.12]'
      }`}
    >
      <span className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`} />
      {saving && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-3 w-3 animate-spin rounded-full border border-white/40 border-t-white" />
        </span>
      )}
    </button>
  )
}

// ── Setting row ───────────────────────────────────────────────────────────────
function SettingRow({ icon: Icon, label, description, children, danger }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 px-4 py-4 ${danger ? 'border-rose-500/10' : ''}`}>
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${danger ? 'border-rose-500/20 bg-rose-500/10' : 'border-white/10 bg-white/[0.05]'}`}>
          <Icon className={`text-[0.9rem] ${danger ? 'text-rose-400' : 'text-slate-400'}`} />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${danger ? 'text-rose-300' : 'text-slate-100'}`}>{label}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function SettingsSection({ title, description, children }) {
  return (
    <div className={CARD}>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <div className="divide-y divide-white/[0.04] px-1">
        {children}
      </div>
    </div>
  )
}

// ── Value badge ───────────────────────────────────────────────────────────────
function ValueBadge({ value, color = 'blue' }) {
  const colors = {
    blue:    'border-blue-500/20 bg-blue-500/10 text-blue-300',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    amber:   'border-amber-400/20 bg-amber-400/10 text-amber-300',
    rose:    'border-rose-500/20 bg-rose-500/10 text-rose-300',
    slate:   'border-white/10 bg-white/[0.06] text-slate-300',
  }
  return (
    <span className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${colors[color] ?? colors.slate}`}>
      <CheckRoundedIcon className="text-[0.7rem]" />
      {value}
    </span>
  )
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ value, toast }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      toast?.('Copied to clipboard', 'success', 2000)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.09]"
    >
      <ContentCopyRoundedIcon className="text-[0.75rem]" />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
const STAT_ICONS = {
  'Total restaurants':   StorefrontRoundedIcon,
  'Customer accounts':   PeopleRoundedIcon,
  'Restaurant managers': GroupsRoundedIcon,
  'Cities covered':      LocationOnRoundedIcon,
  'Total orders today':  ReceiptRoundedIcon,
  'Platform GMV today':  TrendingUpRoundedIcon,
}

const STAT_CONFIG = [
  { border: 'border-blue-500/20',    bg: 'bg-blue-500/10',    text: 'text-blue-400' },
  { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  { border: 'border-slate-500/20',   bg: 'bg-white/[0.06]',   text: 'text-slate-400' },
  { border: 'border-amber-400/20',   bg: 'bg-amber-400/10',   text: 'text-amber-400' },
  { border: 'border-orange-500/20',  bg: 'bg-orange-500/10',  text: 'text-orange-400' },
  { border: 'border-cyan-500/20',    bg: 'bg-cyan-500/10',    text: 'text-cyan-400' },
]

function StatCard({ label, value, detail, index }) {
  const Icon = STAT_ICONS[label] ?? SettingsRoundedIcon
  const c = STAT_CONFIG[index % STAT_CONFIG.length]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`${INNER} p-4`}
    >
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${c.border} ${c.bg}`}>
        <Icon className={`text-[0.9rem] ${c.text}`} />
      </div>
      <p className={`mt-3 text-xl font-bold ${c.text}`}>{value}</p>
      <p className="mt-0.5 text-xs font-semibold text-slate-300">{label}</p>
      <p className="mt-0.5 text-[0.65rem] text-slate-500">{detail}</p>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminSettings({ dashboard, onSectionChange, toast }) {
  const [platform, setPlatform] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const { toggles, setToggles } = useSettings()

  const load = () => {
    setLoading(true)
    api.getAdminPlatform()
      .then((data) => setPlatform(data.platform))
      .catch((err) => toast?.(err.message, 'alert', 4000))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleToggle = async (key, val) => {
    if (saving) return
    setToggles((t) => ({ ...t, [key]: val }))
    setSaving(key)
    try {
      await api.updateAdminSettings({ [key]: val })
      toast?.(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${val ? 'enabled' : 'disabled'}.`, 'success', 2000)
    } catch (err) {
      setToggles((t) => ({ ...t, [key]: !val }))
      toast?.(err.message, 'alert', 4000)
    } finally {
      setSaving(null)
    }
  }

  const setToggle = (key) => (val) => handleToggle(key, val)

  const stats = platform ? [
    { label: 'Total restaurants',   value: String(platform.restaurants),                                   detail: 'Live venues' },
    { label: 'Customer accounts',   value: String(platform.customers),                                     detail: 'Registered guests' },
    { label: 'Restaurant managers', value: String(platform.restaurantManagers),                            detail: 'Operator logins' },
    { label: 'Cities covered',      value: String(platform.cities),                                        detail: 'Geographic rollout' },
    { label: 'Total orders today',  value: String(platform.totalOrders),                                   detail: 'Across all kitchens' },
    { label: 'Platform GMV today',  value: `INR ${Number(platform.totalRevenue).toLocaleString('en-IN')}`, detail: 'Gross merchandise value' },
  ] : []

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[linear-gradient(135deg,rgba(10,20,50,0.98),rgba(5,10,28,0.97))] p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20">
                <SettingsRoundedIcon className="text-[0.8rem] text-blue-400" />
              </span>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-blue-400">Admin · Settings</p>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Platform settings</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Configure your food tech platform — feature toggles, policies, billing, and system info.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => onSectionChange('overview')}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
                <DashboardRoundedIcon className="text-[1rem]" /> Overview
              </button>
              <button onClick={load} disabled={loading}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.09] disabled:opacity-50">
                <RefreshRoundedIcon className={`text-[1rem] ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading…' : 'Refresh'}
              </button>
            </div>
          </div>
          {/* System status */}
          <div className={`${INNER} p-4 min-w-[160px]`}>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-500 mb-3">System status</p>
            {[
              { label: 'Database',  color: 'bg-emerald-400' },
              { label: 'Auth',      color: 'bg-emerald-400' },
              { label: 'API',       color: 'bg-emerald-400' },
              { label: 'Triggers',  color: toggles.geoTriggers ? 'bg-blue-400' : 'bg-slate-600' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center justify-between mb-2 last:mb-0">
                <span className="text-xs text-slate-400">{label}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
                  <span className="text-[0.65rem] font-semibold text-slate-300">
                    {label === 'Triggers' ? (toggles.geoTriggers ? 'Live' : 'Off') : 'Online'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform stats */}
      <div className={CARD}>
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-white">Platform stats</h2>
            <p className="mt-0.5 text-xs text-slate-500">Live numbers across your food tech network</p>
          </div>
          {loading && <RefreshRoundedIcon className="animate-spin text-[1rem] text-slate-500" />}
        </div>
        <div className="p-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.08]" />
                  <div className="h-6 w-12 rounded-lg bg-white/[0.08]" />
                  <div className="h-2.5 w-20 rounded-full bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
            </div>
          )}
        </div>
      </div>

      {/* Feature toggles */}
      <SettingsSection title="Feature toggles" description="Enable or disable platform features in real time">
        <SettingRow icon={NotificationsActiveRoundedIcon} label="Geo-based arrival triggers" description="Kitchen alerts fire when guest GPS crosses the proximity threshold.">
          <Toggle enabled={toggles.geoTriggers} onChange={setToggle('geoTriggers')} saving={saving === 'geoTriggers'} />
        </SettingRow>
        <SettingRow icon={PeopleRoundedIcon} label="Customer self-signup" description="Allow guests to register directly without admin approval.">
          <Toggle enabled={toggles.customerSignup} onChange={setToggle('customerSignup')} saving={saving === 'customerSignup'} />
        </SettingRow>
        <SettingRow icon={BoltRoundedIcon} label="Arrival alert notifications" description="Send push notifications to kitchen staff on guest arrival.">
          <Toggle enabled={toggles.arrivalAlerts} onChange={setToggle('arrivalAlerts')} saving={saving === 'arrivalAlerts'} />
        </SettingRow>
        <SettingRow icon={SecurityRoundedIcon} label="Auto-credential generation" description="Automatically generate login credentials for new restaurants.">
          <Toggle enabled={toggles.autoCredentials} onChange={setToggle('autoCredentials')} saving={saving === 'autoCredentials'} />
        </SettingRow>
        <SettingRow icon={TrendingUpRoundedIcon} label="Analytics tracking" description="Track platform usage, orders, and revenue metrics.">
          <Toggle enabled={toggles.analyticsTracking} onChange={setToggle('analyticsTracking')} saving={saving === 'analyticsTracking'} />
        </SettingRow>
        <SettingRow icon={SettingsRoundedIcon} label="Maintenance mode" description="Take the platform offline for scheduled maintenance." danger>
          <Toggle enabled={toggles.maintenanceMode} onChange={setToggle('maintenanceMode')} saving={saving === 'maintenanceMode'} />
        </SettingRow>
      </SettingsSection>

      {/* Billing & fees */}
      <SettingsSection title="Billing & fees" description="Platform fee structure and payout configuration">
        <SettingRow icon={ReceiptRoundedIcon} label="Platform fee" description="Applied per order. Tax calculated separately at 5%.">
          <div className="flex items-center gap-2">
            <ValueBadge value="10% + ₹30" color="amber" />
            <button className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.09]">
              <EditRoundedIcon className="text-[0.75rem]" /> Edit
            </button>
          </div>
        </SettingRow>
        <SettingRow icon={PaymentsRoundedIcon} label="Payout cycle" description="Restaurants receive settlement the next business day after service.">
          <ValueBadge value="24h" color="emerald" />
        </SettingRow>
        <SettingRow icon={TrendingUpRoundedIcon} label="GST rate" description="Goods and services tax applied on platform fee.">
          <ValueBadge value="5%" color="blue" />
        </SettingRow>
        <SettingRow icon={ReceiptRoundedIcon} label="Minimum order value" description="Minimum cart value required to place an order.">
          <ValueBadge value="₹99" color="slate" />
        </SettingRow>
      </SettingsSection>

      {/* Access control */}
      <SettingsSection title="Access control" description="Who can do what on your platform">
        <SettingRow icon={StorefrontRoundedIcon} label="Restaurant onboarding" description="Only admins can create restaurant accounts and issue credentials.">
          <ValueBadge value="Admin-only" color="blue" />
        </SettingRow>
        <SettingRow icon={PeopleRoundedIcon} label="Customer signup" description="Guests can self-register. No admin approval required.">
          <ValueBadge value="Open" color="emerald" />
        </SettingRow>
        <SettingRow icon={SecurityRoundedIcon} label="Credential rotation" description="Restaurant managers must request a password reset through admin.">
          <ValueBadge value="Manual" color="amber" />
        </SettingRow>
        <SettingRow icon={GroupsRoundedIcon} label="Admin accounts" description="Admin accounts can only be created directly in the database.">
          <ValueBadge value="DB-only" color="slate" />
        </SettingRow>
      </SettingsSection>

      {/* System info */}
      <SettingsSection title="System info" description="Technical details about your deployment">
        <SettingRow icon={StorageRoundedIcon} label="Database" description="Primary data store for all platform data.">
          <div className="flex items-center gap-2">
            <ValueBadge value="Supabase PostgreSQL" color="emerald" />
            <CopyButton value="Supabase PostgreSQL" toast={toast} />
          </div>
        </SettingRow>
        <SettingRow icon={SecurityRoundedIcon} label="Authentication" description="Session-based auth with CSRF protection.">
          <ValueBadge value="Session + CSRF" color="blue" />
        </SettingRow>
        <SettingRow icon={BoltRoundedIcon} label="Environment" description="Current deployment environment.">
          <ValueBadge value="Development" color="amber" />
        </SettingRow>
        <SettingRow icon={RefreshRoundedIcon} label="Last refreshed" description="When platform stats were last fetched.">
          <ValueBadge value={formatDateLabel(new Date().toISOString())} color="slate" />
        </SettingRow>
        <SettingRow icon={NotificationsActiveRoundedIcon} label="Trigger engine" description="Geo-based kitchen alert system status.">
          <ValueBadge value={toggles.geoTriggers ? 'Active' : 'Disabled'} color={toggles.geoTriggers ? 'emerald' : 'rose'} />
        </SettingRow>
      </SettingsSection>

      {/* Guidance */}
      {(dashboard.guidance ?? []).length > 0 && (
        <div className={CARD}>
          <div className="border-b border-white/[0.06] px-5 py-4">
            <h2 className="text-sm font-bold text-white">Admin guidance</h2>
            <p className="mt-0.5 text-xs text-slate-500">Platform notes for administrators</p>
          </div>
          <div className="space-y-2 p-4">
            {dashboard.guidance.map((note, i) => (
              <div key={i} className={`${INNER} flex gap-3 p-3`}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-[0.65rem] font-bold text-blue-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm leading-6 text-slate-400">{note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
