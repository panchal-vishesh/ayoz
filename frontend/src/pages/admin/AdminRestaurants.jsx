import { useEffect, useRef, useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import KeyRoundedIcon from '@mui/icons-material/KeyRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded'
import { AnimatePresence, motion } from 'framer-motion'
import { api } from '../../api/client'
import { formatDateLabel } from '../shared'

const iCls = 'w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 transition focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-blue-500/20'
const lCls = 'text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500'

function Badge({ tone = 'slate', children }) {
  const map = {
    blue: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    amber: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    slate: 'bg-white/[0.06] text-slate-300 border-white/10',
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold ${map[tone] ?? map.slate}`}>
      {children}
    </span>
  )
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
      <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-100 break-all">{value}</p>
    </div>
  )
}

function ModalShell({ children, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        className="w-full max-h-[92vh] overflow-y-auto rounded-t-2xl border border-white/10 bg-[rgba(12,16,32,0.99)] shadow-2xl sm:max-w-2xl sm:rounded-2xl">
        {children}
      </motion.div>
    </motion.div>
  )
}

function EditModal({ item, onSaved, onCancel, toast }) {
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', city: '', cuisine: '', description: '', contactName: '',
    contactEmail: '', serviceModel: '', seatingCapacity: '', status: '',
    operatingHours: '',
  })
  
  // Fetch complete restaurant details when modal opens
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true)
        const data = await api.getRestaurant(item.id)
        const restaurant = data.restaurant
        setForm({
          name: restaurant.name ?? '',
          city: restaurant.city ?? '',
          cuisine: restaurant.cuisine ?? '',
          description: restaurant.description ?? '',
          contactName: restaurant.contactName ?? '',
          contactEmail: restaurant.contactEmail ?? '',
          serviceModel: restaurant.serviceModel ?? '',
          seatingCapacity: String(restaurant.seatingCapacity ?? ''),
          status: restaurant.status ?? '',
          operatingHours: restaurant.operatingHours ?? '',
        })
      } catch (err) {
        setError('Failed to load restaurant details: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRestaurantDetails()
  }, [item.id])
  
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true); setError('')
    try {
      await api.updateRestaurant(item.id, form)
      toast?.(`"${form.name}" updated successfully.`, 'success', 4000)
      onSaved()
    }
    catch (err) { setError(err.message) }
    finally { setSubmitting(false) }
  }

  return (
    <ModalShell onClose={onCancel}>
      <div className="p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Editing restaurant</p>
            <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">{item.name}</h2>
          </div>
          <button onClick={onCancel} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-400 hover:text-white transition">
            <CloseRoundedIcon className="text-[1rem]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {[1,2,3,4,5,6,7,8,9].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-3 w-20 rounded-full bg-white/[0.08]" />
                    <div className="h-10 rounded-xl bg-white/[0.06]" />
                  </div>
                ))}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="h-3 w-20 rounded-full bg-white/[0.08]" />
                  <div className="h-10 rounded-xl bg-white/[0.06]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { k: 'name', label: 'Restaurant name *', req: true },
                { k: 'city', label: 'City *', req: true },
                { k: 'cuisine', label: 'Cuisine *', req: true },
                { k: 'seatingCapacity', label: 'Seating capacity', type: 'number' },
                { k: 'contactName', label: 'Contact name' },
                { k: 'contactEmail', label: 'Contact email', type: 'email' },
                { k: 'serviceModel', label: 'Service model' },
                { k: 'operatingHours', label: 'Operating hours', placeholder: '12:30 PM – 11:00 PM' },
                { k: 'status', label: 'Status', placeholder: 'e.g. Live onboarding' },
              ].map(({ k, label, req, type, placeholder }) => (
                <label key={k} className="block">
                  <span className={lCls}>{label}</span>
                  <input className={`mt-1.5 ${iCls}`} value={form[k]} onChange={set(k)} required={req} type={type ?? 'text'} placeholder={placeholder} />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className={lCls}>Description</span>
                <input className={`mt-1.5 ${iCls}`} value={form.description} onChange={set('description')} />
              </label>
            </div>
          )}
          {error ? <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">{error}</p> : null}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={submitting || loading}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" onClick={onCancel}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.09]">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  )
}

function DeleteModal({ item, onDeleted, onCancel }) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const handleDelete = async () => {
    setDeleting(true)
    try { await api.deleteRestaurant(item.id); onDeleted() }
    catch (err) { setError(err.message); setDeleting(false) }
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}
        className="w-full rounded-t-2xl border border-rose-500/20 bg-[rgba(12,16,32,0.99)] p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10">
          <DeleteRoundedIcon className="text-rose-400 text-[1.2rem]" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-white">Delete {item.name}?</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {item.city && (
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-xs text-slate-400">
              {item.city}
            </span>
          )}
          {item.cuisine && (
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-xs text-slate-400">
              {item.cuisine}
            </span>
          )}
          {item.status && (
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-xs text-slate-400">
              {item.status}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm text-slate-400">This permanently removes the restaurant and its linked manager account. This cannot be undone.</p>
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        <div className="mt-5 flex gap-3">
          <button onClick={handleDelete} disabled={deleting}
            className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60">
            {deleting ? 'Deleting…' : 'Yes, delete'}
          </button>
          <button onClick={onCancel}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.09]">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CreateModal({ onCreated, onCancel, toast }) {
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', city: '', cuisine: '', description: '', contactName: '', contactEmail: '', serviceModel: '', seatingCapacity: '' })
  const [touched, setTouched] = useState({})
  const firstRef = useRef(null)
  useEffect(() => { firstRef.current?.focus() }, [])
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const touch = (k) => () => setTouched((t) => ({ ...t, [k]: true }))

  const REQUIRED = ['name', 'city', 'cuisine', 'contactName', 'contactEmail']
  const fieldError = (k) => touched[k] && REQUIRED.includes(k) && !form[k].trim()
    ? 'This field is required'
    : k === 'contactEmail' && touched[k] && form[k] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[k])
      ? 'Enter a valid email address'
      : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Mark all required fields as touched on submit
    setTouched(REQUIRED.reduce((acc, k) => ({ ...acc, [k]: true }), {}))
    // Check for any validation errors before submitting
    const hasErrors = REQUIRED.some((k) => !form[k].trim()) ||
      (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail))
    if (hasErrors) return
    setSubmitting(true); setError('')
    try {
      const data = await api.createRestaurant(form)
      setResult(data.credentials)
      toast?.(`"${data.restaurant.name}" created — ID: ${data.restaurant.loginId}`, 'success', 6000)
      onCreated()
    } catch (err) { setError(err.message) }
    finally { setSubmitting(false) }
  }

  return (
    <ModalShell onClose={onCancel}>
      <div className="p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">New restaurant</p>
            <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">Create restaurant account</h2>
          </div>
          <button onClick={onCancel} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-400 hover:text-white transition">
            <CloseRoundedIcon className="text-[1rem]" />
          </button>
        </div>
        {result ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3">
              <p className="text-sm font-semibold text-emerald-300">Restaurant created successfully</p>
              <p className="mt-1 text-xs text-slate-400">Share these credentials once — the password cannot be shown again.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Restaurant', value: result.restaurantName },
                { label: 'Login ID', value: result.loginId },
                { label: 'Temp password', value: result.temporaryPassword },
                { label: 'Contact email', value: result.contactEmail },
              ].map((s) => <StatPill key={s.label} label={s.label} value={s.value} />)}
            </div>
            <button onClick={onCancel} className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={lCls}>Restaurant name *</span>
                <input ref={firstRef} className={`mt-1.5 ${iCls} ${fieldError('name') ? 'border-rose-500/50' : ''}`} value={form.name} onChange={set('name')} onBlur={touch('name')} placeholder="e.g. The Spice Garden" required />
                {fieldError('name') && <p className="mt-1 text-[0.65rem] text-rose-400">{fieldError('name')}</p>}
              </label>
              <label className="block">
                <span className={lCls}>City *</span>
                <input className={`mt-1.5 ${iCls} ${fieldError('city') ? 'border-rose-500/50' : ''}`} value={form.city} onChange={set('city')} onBlur={touch('city')} placeholder="e.g. Mumbai" required />
                {fieldError('city') && <p className="mt-1 text-[0.65rem] text-rose-400">{fieldError('city')}</p>}
              </label>
              <label className="block">
                <span className={lCls}>Cuisine *</span>
                <input className={`mt-1.5 ${iCls} ${fieldError('cuisine') ? 'border-rose-500/50' : ''}`} value={form.cuisine} onChange={set('cuisine')} onBlur={touch('cuisine')} placeholder="e.g. South Indian" required />
                {fieldError('cuisine') && <p className="mt-1 text-[0.65rem] text-rose-400">{fieldError('cuisine')}</p>}
              </label>
              <label className="block">
                <span className={lCls}>Seating capacity</span>
                <input className={`mt-1.5 ${iCls}`} value={form.seatingCapacity} onChange={set('seatingCapacity')} placeholder="e.g. 60" type="number" min="1" />
              </label>
              <label className="block">
                <span className={lCls}>Contact name *</span>
                <input className={`mt-1.5 ${iCls} ${fieldError('contactName') ? 'border-rose-500/50' : ''}`} value={form.contactName} onChange={set('contactName')} onBlur={touch('contactName')} placeholder="Manager full name" required />
                {fieldError('contactName') && <p className="mt-1 text-[0.65rem] text-rose-400">{fieldError('contactName')}</p>}
              </label>
              <label className="block">
                <span className={lCls}>Contact email *</span>
                <input className={`mt-1.5 ${iCls} ${fieldError('contactEmail') ? 'border-rose-500/50' : ''}`} value={form.contactEmail} onChange={set('contactEmail')} onBlur={touch('contactEmail')} placeholder="manager@venue.com" type="email" required />
                {fieldError('contactEmail') && <p className="mt-1 text-[0.65rem] text-rose-400">{fieldError('contactEmail')}</p>}
              </label>
              <label className="block">
                <span className={lCls}>Service model</span>
                <input className={`mt-1.5 ${iCls}`} value={form.serviceModel} onChange={set('serviceModel')} placeholder="e.g. Chef-led dining lounge" />
              </label>
              <label className="block sm:col-span-2">
                <span className={lCls}>Description</span>
                <input className={`mt-1.5 ${iCls}`} value={form.description} onChange={set('description')} placeholder="Short venue description" />
              </label>
            </div>
            {error ? <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">{error}</p> : null}
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={submitting}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">
                {submitting ? 'Creating…' : 'Create restaurant'}
              </button>
              <button type="button" onClick={onCancel}
                className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.09]">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </ModalShell>
  )
}

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const options = [
    { value: 'name',    label: 'Name A–Z' },
    { value: 'city',    label: 'City A–Z' },
    { value: 'revenue', label: 'Revenue ↓' },
    { value: 'seats',   label: 'Seats ↓' },
  ]
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] pl-4 pr-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.09]">
        {selected?.label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-white/10 bg-[rgba(12,16,32,0.98)] p-1.5 shadow-2xl backdrop-blur-xl"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                  value === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatusBadge({ status }) {
  const s = String(status ?? '').toLowerCase()
  if (s.includes('live') && !s.includes('onboard')) return <Badge tone="emerald">{status}</Badge>
  if (s.includes('onboard')) return <Badge tone="amber">{status}</Badge>
  if (s.includes('suspend') || s.includes('inactive')) return <Badge tone="rose">{status}</Badge>
  return <Badge tone="slate">{status}</Badge>
}

function RestaurantCard({ item, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.08] bg-[rgba(15,20,40,0.6)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <StorefrontRoundedIcon className="text-[1rem] text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">{item.name}</p>
            <p className="text-xs text-slate-500">{item.cuisine}</p>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        <LocationOnRoundedIcon className="text-[0.8rem] text-slate-500" />
        {item.city}
        <span className="text-slate-600">·</span>
        <span className="font-mono text-slate-300">{item.loginId}</span>
        {item.operatingHours && (
          <>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">{item.operatingHours}</span>
          </>
        )}
      </div>
      {item.serviceModel && (
        <p className="mt-1.5 text-[0.65rem] text-slate-600 truncate">{item.serviceModel}</p>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <p className="text-[0.6rem] uppercase tracking-widest text-slate-500">Revenue</p>
          <p className="mt-0.5 text-sm font-bold text-slate-100">
            {item.stats?.todayRevenue && Number(String(item.stats.todayRevenue).replace(/[^0-9.]/g, '')) > 0
              ? item.stats.todayRevenue
              : <span className="text-slate-600">&mdash;</span>}
          </p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <p className="text-[0.6rem] uppercase tracking-widest text-slate-500">Orders · Seats</p>
          <p className="mt-0.5 text-sm font-bold text-slate-100">
            {Number(String(item.stats?.todayOrders ?? '0').replace(/[^0-9]/g, '')) > 0
              ? item.stats.todayOrders
              : <span className="text-slate-600">&mdash;</span>}
            {' · '}
            {item.seatingCapacity ?? <span className="text-slate-600">&mdash;</span>}
          </p>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              {[
                { label: 'Contact', value: item.contactName },
                { label: 'Email', value: item.contactEmail },
                { label: 'Description', value: item.description },
                { label: 'Ready rate', value: item.stats?.readyRate },
                { label: 'Avg prep', value: item.stats?.avgPrepMins },
              ].filter(({ value }) => value).map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-2">
                  <p className="text-[0.6rem] uppercase tracking-widest text-slate-600 shrink-0">{label}</p>
                  <p className="text-xs text-slate-300 text-right truncate">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.08]">
          {expanded ? 'Less' : 'More'}
        </button>
        <button onClick={() => onEdit(item)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 py-2 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/20">
          <EditRoundedIcon className="text-[0.85rem]" /> Edit
        </button>
        <button onClick={() => onDelete(item)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20">
          <DeleteRoundedIcon className="text-[0.85rem]" /> Delete
        </button>
      </div>
    </motion.div>
  )
}

function RestaurantRow({ item, onEdit, onDelete }) {
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[rgba(15,20,40,0.6)] px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
          <StorefrontRoundedIcon className="text-[0.9rem] text-blue-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-100 truncate">{item.name}</p>
          <p className="text-xs text-slate-500 truncate">{item.city} · {item.cuisine} · <span className="font-mono">{item.loginId}</span></p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <StatusBadge status={item.status} />
          <span className="text-xs text-slate-400">
            {item.stats?.todayRevenue && Number(String(item.stats.todayRevenue).replace(/[^0-9.]/g, '')) > 0
              ? item.stats.todayRevenue
              : <span className="text-slate-600">&mdash;</span>}
          </span>
          <span className="text-xs text-slate-500">
            {Number(String(item.stats?.todayOrders ?? '0').replace(/[^0-9]/g, '')) > 0
              ? `${item.stats.todayOrders} orders`
              : <span className="text-slate-600">&mdash;</span>}
          </span>
        </div>
        <button onClick={() => onEdit(item)}
          className="flex items-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1.5 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/20">
          <EditRoundedIcon fontSize="inherit" /> Edit
        </button>
        <button onClick={() => onDelete(item)}
          className="flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20">
          <DeleteRoundedIcon fontSize="inherit" /> Delete
        </button>
      </div>
    </motion.div>
  )
}

function CredentialRow({ item, onCopy }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10">
          <KeyRoundedIcon className="text-[0.9rem] text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">{item.restaurantName}</p>
          <p className="text-xs text-slate-500">{item.contactEmail}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onCopy(item.loginId, 'Login ID')}
          className="flex items-center gap-1.5 rounded-lg border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/20"
        >
          <KeyRoundedIcon className="text-[0.75rem]" />
          {item.loginId}
        </button>
        <p className="text-xs text-slate-500">{formatDateLabel(item.issuedAt)}</p>
      </div>
    </div>
  )
}

export default function AdminRestaurants({ dashboard, onSectionChange, onRefresh, toast }) {
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name')
  const [view, setView] = useState(() => {
    try { return localStorage.getItem('ayoz_restaurant_view') ?? 'grid' }
    catch { return 'grid' }
  })

  const handleViewChange = (v) => {
    setView(v)
    try { localStorage.setItem('ayoz_restaurant_view', v) } catch {}
  }

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      toast?.(`${label} copied to clipboard`, 'success', 2000)
    }).catch(() => {
      toast?.('Failed to copy', 'alert', 2000)
    })
  }

  const items = (dashboard.restaurants ?? [])
    .filter((r) =>
      !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.city.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'city') return a.city.localeCompare(b.city)
      if (sort === 'revenue') {
        const ra = Number(String(a.stats?.todayRevenue ?? '0').replace(/[^0-9.]/g, ''))
        const rb = Number(String(b.stats?.todayRevenue ?? '0').replace(/[^0-9.]/g, ''))
        return rb - ra
      }
      if (sort === 'seats') return Number(b.seatingCapacity ?? 0) - Number(a.seatingCapacity ?? 0)
      return 0
    })

  return (
    <div className="space-y-6 sm:space-y-8">
      <AnimatePresence>
        {editing && <EditModal item={editing} onSaved={() => { setEditing(null); onRefresh() }} onCancel={() => setEditing(null)} toast={toast} />}
        {deleting && <DeleteModal item={deleting} onDeleted={() => { setDeleting(null); onRefresh() }} onCancel={() => setDeleting(null)} />}
        {creating && <CreateModal onCreated={() => { setCreating(false); onRefresh() }} onCancel={() => setCreating(false)} toast={toast} />}
      </AnimatePresence>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Admin · Restaurants</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Restaurant network</h1>
            <p className="mt-1 text-sm text-slate-400">Manage all onboarded venues across your food tech platform.</p>
          </div>
          <button onClick={() => setCreating(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 sm:px-4 sm:py-2.5">
            <AddRoundedIcon className="text-[1rem]" /> Add restaurant
          </button>
        </div>
        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: 'Total venues',
              value: dashboard.restaurants?.length ?? 0,
              icon: StorefrontRoundedIcon,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/20',
            },
            {
              label: 'Cities covered',
              value: dashboard.cityPerformance?.length ?? 0,
              icon: LocationOnRoundedIcon,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/20',
            },
            {
              label: 'Total seats',
              value: (dashboard.restaurants ?? []).reduce((s, r) => s + Number(r.seatingCapacity ?? 0), 0),
              icon: KeyRoundedIcon,
              color: 'text-amber-400',
              bg: 'bg-amber-400/10 border-amber-400/20',
            },
            {
              label: 'Orders today',
              value: (() => {
                const total = (dashboard.restaurants ?? []).reduce((s, r) => s + Number(String(r.stats?.todayOrders ?? '0').replace(/[^0-9]/g, '')), 0)
                return total > 0 ? total : '—'
              })(),
              icon: AddRoundedIcon,
              color: 'text-orange-400',
              bg: 'bg-orange-500/10 border-orange-500/20',
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${bg} bg-opacity-10`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${bg}`}>
                <Icon className={`text-[1rem] ${color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-[0.65rem] text-slate-500 truncate">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + sort + view toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 sm:max-w-sm">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or city…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20"
          />
          {search && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-[0.65rem] font-semibold text-slate-500">
                {items.length} result{items.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setSearch('')}
                className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white transition"
              >
                <CloseRoundedIcon className="text-[0.65rem]" />
              </button>
            </div>
          )}
        </div>
        <SortDropdown value={sort} onChange={setSort} />
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.12] bg-white/[0.06] p-1">
          {[
            { key: 'grid', Icon: GridViewRoundedIcon,  label: 'Grid' },
            { key: 'list', Icon: TableRowsRoundedIcon, label: 'List' },
          ].map(({ key, Icon, label }) => (
            <button key={key} onClick={() => handleViewChange(key)} title={label}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                view === key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
              }`}>
              <Icon fontSize="small" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant list */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <StorefrontRoundedIcon className="text-[1.4rem] text-slate-500" />
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-300">
            {search ? `No restaurants match "${search}"` : 'No restaurants yet'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {search ? 'Try a different name or city.' : 'Add your first restaurant to get started.'}
          </p>
          {!search && (
            <button
              onClick={() => setCreating(true)}
              className="mt-4 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 mx-auto">
              <AddRoundedIcon className="text-[1rem]" /> Add restaurant
            </button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => <RestaurantCard key={item.id} item={item} onEdit={setEditing} onDelete={setDeleting} />)}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => <RestaurantRow key={item.id} item={item} onEdit={setEditing} onDelete={setDeleting} />)}
        </div>
      )}

      {/* Recent credentials */}
      {(dashboard.recentCredentials ?? []).length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recently issued credentials</p>
          <div className="space-y-2">
            {dashboard.recentCredentials.map((item) => <CredentialRow key={item.id} item={item} onCopy={handleCopy} />)}
          </div>
        </div>
      )}
    </div>
  )
}
