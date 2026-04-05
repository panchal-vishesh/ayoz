import { useEffect, useState } from 'react'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import ChairRoundedIcon from '@mui/icons-material/ChairRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../api/client'
import { GuidanceItems, TonePill, WorkspaceHero } from '../shared'

const inputCls = 'w-full rounded-[14px] border border-emerald-400/[0.2] bg-white/[0.06] px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-white/[0.09] focus:ring-2 focus:ring-emerald-400/20 transition'

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ enabled, onChange, saving }) {
  return (
    <button
      onClick={() => !saving && onChange(!enabled)}
      disabled={saving}
      className={`relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-60 ${enabled ? 'bg-emerald-600' : 'bg-white/[0.12]'}`}
    >
      <span className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      {saving && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-3 w-3 animate-spin rounded-full border border-white/40 border-t-white" />
        </span>
      )}
    </button>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
function Section({ icon: Icon, title, description, badge, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-400/[0.15] bg-[linear-gradient(145deg,rgba(6,18,18,0.98),rgba(3,10,10,0.98))]">
      {/* Section header */}
      <div className="flex items-center gap-3 border-b border-emerald-400/[0.08] bg-emerald-500/[0.03] px-5 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10">
          <Icon className="text-[0.9rem] text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white">{title}</h2>
            {badge && (
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[0.6rem] font-bold text-emerald-400">
                {badge}
              </span>
            )}
          </div>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {children}
      </div>
    </div>
  )
}

// ── Inline editable row ───────────────────────────────────────────────────────
function EditableRow({ icon: Icon, label, description, value, onSave, type = 'text', placeholder, multiline }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(value ?? '')
  const [saving, setSaving]   = useState(false)

  // Sync draft when value changes externally
  useEffect(() => { if (!editing) setDraft(value ?? '') }, [value, editing])

  const handleSave = async () => {
    if (draft === (value ?? '')) { setEditing(false); return }
    setSaving(true)
    try {
      await onSave(draft)
      setEditing(false)
    } catch {
      // error handled by parent
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) handleSave()
    if (e.key === 'Escape') { setDraft(value ?? ''); setEditing(false) }
  }

  return (
    <div className={`px-5 py-4 transition-colors ${editing ? 'bg-emerald-500/[0.03]' : 'hover:bg-white/[0.02]'}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${editing ? 'border-emerald-400/30 bg-emerald-500/15' : 'border-white/[0.08] bg-white/[0.04]'}`}>
          <Icon className={`text-[0.8rem] transition-colors ${editing ? 'text-emerald-400' : 'text-slate-500'}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-100">{label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{description}</p>
            </div>
            {!editing && (
              <button
                onClick={() => { setDraft(value ?? ''); setEditing(true) }}
                className="flex shrink-0 items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-400 transition hover:bg-emerald-500/20 hover:text-emerald-300"
              >
                <EditRoundedIcon className="text-[0.7rem]" /> Edit
              </button>
            )}
          </div>

          {/* Current value display */}
          {!editing && (
            <p className={`mt-2 text-sm ${value ? 'font-medium text-slate-200' : 'text-slate-600 italic'}`}>
              {value || 'Not set'}
            </p>
          )}

          {/* Edit mode */}
          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                {multiline ? (
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={3}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoFocus
                  />
                ) : (
                  <input
                    className={inputCls}
                    type={type}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoFocus
                  />
                )}
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                  >
                    <CheckRoundedIcon className="text-[0.8rem]" />
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setDraft(value ?? ''); setEditing(false) }}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.08]"
                  >
                    <CloseRoundedIcon className="text-[0.8rem]" /> Cancel
                  </button>
                  <p className="ml-1 text-[0.65rem] text-slate-600">
                    {multiline ? 'Ctrl+Enter to save' : 'Enter to save · Esc to cancel'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ── Locked row (admin only) ───────────────────────────────────────────────────
function LockedRow({ icon: Icon, label, description, value, extra }) {
  return (
    <div className="flex items-start gap-3 px-5 py-4">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
        <Icon className="text-[0.8rem] text-slate-500" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">{label}</p>
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[0.65rem] text-slate-600">
            <LockRoundedIcon className="text-[0.65rem]" /> Admin only
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-sm font-medium text-slate-300">{value || <span className="italic text-slate-600">Not set</span>}</p>
          {extra}
        </div>
      </div>
    </div>
  )
}

// ── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({ icon: Icon, label, description, enabled, onChange, saving }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02]`}>
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${enabled ? 'border-emerald-400/25 bg-emerald-500/10' : 'border-white/[0.08] bg-white/[0.04]'}`}>
        <Icon className={`text-[0.8rem] transition-colors ${enabled ? 'text-emerald-400' : 'text-slate-500'}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-100">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <span className={`text-[0.65rem] font-semibold transition-colors ${enabled ? 'text-emerald-400' : 'text-slate-600'}`}>
          {enabled ? 'On' : 'Off'}
        </span>
        <Toggle enabled={enabled} onChange={onChange} saving={saving} />
      </div>
    </div>
  )
}

// ── Static info row ───────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, highlight, children }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
        <Icon className="text-[0.8rem] text-slate-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`mt-0.5 text-sm font-semibold ${highlight ? 'text-emerald-300' : 'text-slate-200'}`}>{value}</p>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  )
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ value, toast }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true)
          toast?.('Copied!', 'success', 2000)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
      className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-1 text-[0.65rem] font-semibold text-slate-400 transition hover:bg-white/[0.09] hover:text-slate-200"
    >
      <ContentCopyRoundedIcon className="text-[0.7rem]" />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function RestaurantSettings({ dashboard, theme, onSectionChange, toast, onRefresh }) {
  const restaurant = dashboard.restaurant
  const [savingKey, setSavingKey] = useState(null)
  const [notifications, setNotifications] = useState({
    arrivalAlerts:  true,
    orderUpdates:   true,
    staffReminders: false,
    dailySummary:   true,
  })

  useEffect(() => {
    api.getRestaurantSettings()
      .then((data) => { if (data?.notifications) setNotifications(data.notifications) })
      .catch(() => {})
  }, [])

  const handleToggle = async (key, val) => {
    setNotifications((n) => ({ ...n, [key]: val }))
    setSavingKey(key)
    try {
      const data = await api.updateRestaurantSettings({ [key]: val })
      if (data?.notifications) setNotifications(data.notifications)
      toast?.(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${val ? 'enabled' : 'disabled'}.`, 'success', 2000)
    } catch (err) {
      setNotifications((n) => ({ ...n, [key]: !val }))
      toast?.(err.message, 'alert', 4000)
    } finally {
      setSavingKey(null)
    }
  }

  const handleFieldSave = async (field, value) => {
    try {
      await api.updateRestaurant(restaurant.id, { [field]: value })
      toast?.(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} updated.`, 'success', 2000)
      onRefresh?.()
    } catch (err) {
      toast?.(err.message, 'alert', 4000)
      throw err
    }
  }

  return (
    <div className="space-y-4">
      <WorkspaceHero
        theme={theme}
        icon={SettingsRoundedIcon}
        eyebrow="Restaurant workspace"
        title="Settings"
        description="Manage your restaurant profile, notifications, and account details."
        badges={[restaurant?.name ?? 'Restaurant', restaurant?.status ?? 'Active']}
        actions={[
          { key: 'overview', label: 'Overview', onClick: () => onSectionChange('overview'), variant: theme.button, icon: StorefrontRoundedIcon },
        ]}
      />

      {/* Restaurant profile */}
      <Section icon={StorefrontRoundedIcon} title="Restaurant profile" description="Update your venue details" badge="5 editable">
        <EditableRow
          icon={LocationOnRoundedIcon}
          label="City"
          description="The city where your restaurant is located."
          value={restaurant?.city}
          onSave={(v) => handleFieldSave('city', v)}
          placeholder="e.g. Mumbai"
        />
        <EditableRow
          icon={RestaurantMenuRoundedIcon}
          label="Cuisine type"
          description="The type of food your restaurant serves."
          value={restaurant?.cuisine}
          onSave={(v) => handleFieldSave('cuisine', v)}
          placeholder="e.g. North Indian Fusion"
        />
        <EditableRow
          icon={AccessTimeRoundedIcon}
          label="Operating hours"
          description="When your restaurant is open for service."
          value={restaurant?.operatingHours}
          onSave={(v) => handleFieldSave('operatingHours', v)}
          placeholder="12:30 PM – 11:00 PM"
        />
        <EditableRow
          icon={ChairRoundedIcon}
          label="Seating capacity"
          description="Total number of seats available."
          value={restaurant?.seatingCapacity ? String(restaurant.seatingCapacity) : ''}
          onSave={(v) => handleFieldSave('seatingCapacity', v)}
          type="number"
          placeholder="e.g. 60"
        />
        <EditableRow
          icon={SettingsRoundedIcon}
          label="Service model"
          description="How your restaurant delivers the AyoZ experience."
          value={restaurant?.serviceModel}
          onSave={(v) => handleFieldSave('serviceModel', v)}
          placeholder="e.g. Chef-led dining lounge"
        />
        <EditableRow
          icon={StorefrontRoundedIcon}
          label="Description"
          description="Short description guests see on your restaurant page."
          value={restaurant?.description}
          onSave={(v) => handleFieldSave('description', v)}
          placeholder="Short description of your restaurant"
          multiline
        />
        <LockedRow
          icon={StorefrontRoundedIcon}
          label="Restaurant name"
          description="Only admin can change the restaurant name."
          value={restaurant?.name}
        />
        <LockedRow
          icon={PersonRoundedIcon}
          label="Contact name"
          description="Only admin can update the contact person."
          value={restaurant?.contactName}
        />
        <LockedRow
          icon={EmailRoundedIcon}
          label="Contact email"
          description="Only admin can change the account email."
          value={restaurant?.contactEmail}
          extra={<CopyButton value={restaurant?.contactEmail ?? ''} toast={toast} />}
        />
        <LockedRow
          icon={StorefrontRoundedIcon}
          label="Account status"
          description="Only admin can change your account status."
          value={restaurant?.status}
        />
      </Section>

      {/* Notifications */}
      <Section icon={NotificationsActiveRoundedIcon} title="Notifications" description="Control which alerts and updates you receive">
        <ToggleRow
          icon={BoltRoundedIcon}
          label="Arrival alerts"
          description="Get notified when a guest is approaching your restaurant."
          enabled={notifications.arrivalAlerts}
          onChange={(v) => handleToggle('arrivalAlerts', v)}
          saving={savingKey === 'arrivalAlerts'}
        />
        <ToggleRow
          icon={RestaurantMenuRoundedIcon}
          label="Order updates"
          description="Receive updates when orders are placed or modified."
          enabled={notifications.orderUpdates}
          onChange={(v) => handleToggle('orderUpdates', v)}
          saving={savingKey === 'orderUpdates'}
        />
        <ToggleRow
          icon={PersonRoundedIcon}
          label="Staff reminders"
          description="Shift start and task reminders for your team."
          enabled={notifications.staffReminders}
          onChange={(v) => handleToggle('staffReminders', v)}
          saving={savingKey === 'staffReminders'}
        />
        <ToggleRow
          icon={NotificationsActiveRoundedIcon}
          label="Daily summary"
          description="End-of-day report with orders, revenue, and performance."
          enabled={notifications.dailySummary}
          onChange={(v) => handleToggle('dailySummary', v)}
          saving={savingKey === 'dailySummary'}
        />
      </Section>

      {/* Platform & billing */}
      <Section icon={PaymentsRoundedIcon} title="Platform & billing" description="AyoZ service configuration and payout details">
        <InfoRow icon={PaymentsRoundedIcon} label="Platform fee" value="10% per order" />
        <InfoRow icon={PaymentsRoundedIcon} label="Payout schedule" value="Next business day" highlight />
        <InfoRow icon={PaymentsRoundedIcon} label="GST rate" value="5% on platform fee" />
        <InfoRow icon={BoltRoundedIcon} label="GPS kitchen triggers" value="Enabled" highlight />
        <InfoRow icon={PaymentsRoundedIcon} label="Minimum order value" value="₹99" />
      </Section>

      {/* Account & security */}
      <Section icon={SecurityRoundedIcon} title="Account & security" description="Your login credentials and account identifiers">
        <InfoRow icon={SecurityRoundedIcon} label="Login ID" value={restaurant?.loginId ?? '—'} highlight>
          <CopyButton value={restaurant?.loginId ?? ''} toast={toast} />
        </InfoRow>
        <InfoRow icon={SecurityRoundedIcon} label="Password" value="Managed by admin" />
        <InfoRow icon={SecurityRoundedIcon} label="Account type" value="Restaurant manager" highlight />
        <InfoRow icon={SecurityRoundedIcon} label="Session" value="Active" highlight />
      </Section>

      {/* Guidance */}
      {(dashboard.guidance ?? []).length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-emerald-400/[0.15] bg-[linear-gradient(145deg,rgba(6,18,18,0.98),rgba(3,10,10,0.98))]">
          <div className="flex items-center gap-3 border-b border-emerald-400/[0.08] bg-emerald-500/[0.03] px-5 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10">
              <BoltRoundedIcon className="text-[0.9rem] text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Restaurant guidance</h2>
              <p className="mt-0.5 text-xs text-slate-500">Platform notes for your restaurant</p>
            </div>
          </div>
          <div className="p-5">
            <GuidanceItems items={dashboard.guidance} />
          </div>
        </div>
      )}
    </div>
  )
}
