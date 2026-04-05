import { useEffect, useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../api/client'
import { EmptyState, TonePill } from '../shared'

const ROLES = ['Chef', 'Sous Chef', 'Line Cook', 'Server', 'Host', 'Bartender', 'Manager', 'Busser', 'Dishwasher', 'Other']
const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night', 'Full Day', 'Split']
const STATUSES = ['Active', 'On Leave', 'Off Duty', 'Inactive']

const inputCls = 'w-full rounded-[18px] border border-emerald-400/[0.15] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20 transition'
const selectCls = 'w-full appearance-none rounded-[18px] border border-emerald-400/[0.15] bg-[rgba(4,14,14,0.95)] px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20 transition cursor-pointer'
const labelCls = 'block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2'

function SelectField({ label, error, value, onChange, options }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <div className="relative">
        <select className={selectCls} value={value} onChange={onChange}>
          {options.map((o) => (
            <option key={o} value={o} className="bg-[rgba(4,14,14,0.99)] text-slate-100">{o}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400/60">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </label>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </label>
  )
}

function StaffForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    role: initial?.role ?? ROLES[0],
    shift: initial?.shift ?? SHIFTS[2],
    phone: initial?.phone ?? '',
    email: initial?.email ?? '',
    status: initial?.status ?? STATUSES[0],
    score: initial?.score ?? 90,
  })
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.role.trim()) e.role = 'Role is required'
    if (form.score < 0 || form.score > 100) e.score = 'Score must be 0-100'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({ ...form, score: Number(form.score) })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-[24px] border border-emerald-400/[0.18] bg-[linear-gradient(145deg,rgba(8,22,24,0.98),rgba(4,12,14,0.98))] shadow-[0_14px_36px_rgba(16,185,129,0.11),inset_0_1px_0_rgba(110,231,183,0.07)] p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="font-display text-lg tracking-[-0.04em] text-slate-50">
          {initial ? 'Edit staff member' : 'Add staff member'}
        </p>
        <button onClick={onCancel} className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white transition">
          <CloseRoundedIcon fontSize="inherit" className="text-[1rem]" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.name}>
            <input className={inputCls} value={form.name} onChange={set('name')} placeholder="e.g. Ravi Kumar" />
          </Field>
          <SelectField label="Role" error={errors.role} value={form.role} onChange={set('role')} options={ROLES} />
          <SelectField label="Shift" value={form.shift} onChange={set('shift')} options={SHIFTS} />
          <SelectField label="Status" value={form.status} onChange={set('status')} options={STATUSES} />
          <Field label="Phone">
            <input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Email">
            <input className={inputCls} type="email" value={form.email} onChange={set('email')} placeholder="staff@restaurant.com" />
          </Field>
          <Field label="Performance score (0-100)" error={errors.score}>
            <input className={inputCls} type="number" min="0" max="100" value={form.score} onChange={set('score')} />
          </Field>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition hover:-translate-y-0.5 disabled:opacity-60">
            <CheckRoundedIcon fontSize="inherit" className="text-[1rem]" />
            {saving ? 'Saving…' : initial ? 'Save changes' : 'Add to team'}
          </button>
          <button type="button" onClick={onCancel}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08]">
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  )
}

function StaffCard({ member, onEdit, onDelete, deleting }) {
  const scoreTone = member.score >= 94 ? 'emerald' : member.score >= 85 ? 'blue' : 'amber'
  const statusTone = member.status === 'Active' ? 'emerald' : member.status === 'On Leave' ? 'amber' : 'slate'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300">
          <PersonRoundedIcon fontSize="inherit" className="text-[1.2rem]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-base tracking-[-0.03em] text-slate-50 truncate">{member.name}</p>
              <p className="mt-0.5 text-xs text-slate-400">{member.role} · {member.shift} shift</p>
            </div>
            <TonePill tone={scoreTone}>{member.score}%</TonePill>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <TonePill tone={statusTone}>{member.status}</TonePill>
        {member.phone && (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.62rem] text-slate-300">
            <PhoneRoundedIcon fontSize="inherit" className="text-[0.75rem] text-emerald-400" />
            {member.phone}
          </span>
        )}
        {member.email && (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.62rem] text-slate-300">
            <EmailRoundedIcon fontSize="inherit" className="text-[0.75rem] text-blue-400" />
            {member.email}
          </span>
        )}
      </div>

      {/* Score bar */}
      <div className="mt-3">
        <div className="h-1.5 rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${member.score}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-t border-white/[0.06] pt-3">
        <button onClick={() => onEdit(member)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white">
          <EditRoundedIcon fontSize="inherit" className="text-[0.9rem]" />
          Edit
        </button>
        <button onClick={() => onDelete(member.id)} disabled={deleting === member.id}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.07] px-4 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/[0.15] disabled:opacity-50">
          <DeleteRoundedIcon fontSize="inherit" className="text-[0.9rem]" />
          {deleting === member.id ? '…' : 'Remove'}
        </button>
      </div>
    </motion.div>
  )
}

export default function StaffManager({ toast }) {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editMember, setEditMember] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    api.getRestaurantStaff()
      .then((data) => setStaff(data.staff ?? []))
      .catch(() => toast?.('Failed to load staff', 'alert'))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (payload) => {
    setSaving(true)
    try {
      const data = await api.addStaffMember(payload)
      setStaff((prev) => [data.member, ...prev])
      setShowForm(false)
      toast?.(`${data.member.name} added to team`, 'success')
    } catch (err) {
      toast?.(err.message, 'alert')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (payload) => {
    setSaving(true)
    try {
      const data = await api.updateStaffMember(editMember.id, payload)
      setStaff((prev) => prev.map((m) => m.id === editMember.id ? data.member : m))
      setEditMember(null)
      toast?.(`${data.member.name} updated`, 'success')
    } catch (err) {
      toast?.(err.message, 'alert')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await api.deleteStaffMember(id)
      setStaff((prev) => prev.filter((m) => m.id !== id))
      toast?.('Staff member removed', 'success')
    } catch (err) {
      toast?.(err.message, 'alert')
    } finally {
      setDeleting(null)
    }
  }

  const roles = ['All', ...Array.from(new Set(staff.map((m) => m.role)))]
  const filtered = filter === 'All' ? staff : staff.filter((m) => m.role === filter)

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-48 animate-pulse rounded-[22px] border border-white/10 bg-white/[0.04]" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-400">Staff management</p>
          <p className="mt-0.5 font-display text-xl tracking-[-0.04em] text-slate-50">{staff.length} team members</p>
        </div>
        {!showForm && !editMember && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition hover:-translate-y-0.5"
          >
            <AddRoundedIcon fontSize="inherit" className="text-[1rem]" />
            Add member
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showForm && (
          <StaffForm key="add" onSave={handleAdd} onCancel={() => setShowForm(false)} saving={saving} />
        )}
        {editMember && (
          <StaffForm key={editMember.id} initial={editMember} onSave={handleEdit} onCancel={() => setEditMember(null)} saving={saving} />
        )}
      </AnimatePresence>

      {staff.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${filter === r ? 'border-emerald-400/30 bg-emerald-500/[0.12] text-emerald-200' : 'border-white/10 bg-white/[0.04] text-slate-400 hover:text-slate-200'}`}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={staff.length === 0 ? 'No staff members yet' : `No staff with role "${filter}"`}
          description={staff.length === 0 ? 'Click "Add member" to start building your team roster.' : 'Try a different role filter.'}
        />
      ) : (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filtered.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                onEdit={(m) => { setEditMember(m); setShowForm(false) }}
                onDelete={handleDelete}
                deleting={deleting}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
