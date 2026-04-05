import { useEffect, useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../api/client'
import { EmptyState, TonePill } from '../shared'

const CATEGORIES = ['Starter', 'Main Course', 'Dessert', 'Drink', 'Snack', 'Bread', 'Rice & Biryani', 'Special']

const inputCls = 'w-full rounded-[18px] border border-emerald-400/[0.15] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20 transition'
const selectCls = 'w-full appearance-none rounded-[18px] border border-emerald-400/[0.15] bg-[rgba(4,14,14,0.95)] px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20 transition cursor-pointer'
const labelCls = 'block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2'

function SelectField({ label, value, onChange, options }) {
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

function MenuItemForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    category: initial?.category ?? CATEGORIES[0],
    price: initial?.price ?? '',
    prepMinutes: initial?.prepMinutes ?? initial?.prep_minutes ?? '',
    description: initial?.description ?? '',
    variants: initial?.variants ?? '',
    photoUrl: initial?.photo_url ?? initial?.photoUrl ?? '',
    isVeg: initial?.is_veg ?? initial?.isVeg ?? true,
    isAvailable: initial?.is_available ?? initial?.isAvailable ?? true,
  })
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const toggle = (key) => () => setForm((f) => ({ ...f, [key]: !f[key] }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price'
    if (!form.prepMinutes || isNaN(Number(form.prepMinutes)) || Number(form.prepMinutes) <= 0) e.prepMinutes = 'Enter valid prep time'
    if (form.photoUrl && !/^https?:\/\/.+/.test(form.photoUrl)) e.photoUrl = 'Must be a valid URL starting with http(s)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      ...form,
      price: Number(form.price),
      prepMinutes: Number(form.prepMinutes),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-[24px] border border-emerald-400/20 bg-[linear-gradient(145deg,rgba(8,24,26,0.98),rgba(4,14,14,0.96))] p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="font-display text-lg tracking-[-0.04em] text-slate-50">
          {initial ? 'Edit item' : 'Add new item'}
        </p>
        <button onClick={onCancel} className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white transition">
          <CloseRoundedIcon fontSize="inherit" className="text-[1rem]" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Dish name" error={errors.name}>
            <input className={inputCls} value={form.name} onChange={set('name')} placeholder="e.g. Pizza" />
          </Field>
          <SelectField label="Category" value={form.category} onChange={set('category')} options={CATEGORIES} />
          <Field label="Price (₹)" error={errors.price}>
            <input className={inputCls} type="number" min="1" value={form.price} onChange={set('price')} placeholder="e.g. 299" />
          </Field>
          <Field label="Prep time (minutes)" error={errors.prepMinutes}>
            <input className={inputCls} type="number" min="1" value={form.prepMinutes} onChange={set('prepMinutes')} placeholder="e.g. 15" />
          </Field>
        </div>

        <Field label="Variants / Ingredients (comma separated)">
          <input
            className={inputCls}
            value={form.variants}
            onChange={set('variants')}
            placeholder="e.g. Cheese, Mushroom, Paneer — leave blank if no variants"
          />
          <p className="mt-1.5 text-[0.65rem] text-slate-600">Same dish with different ingredients? Add variants here instead of creating duplicate items.</p>
        </Field>

        <Field label="Description">
          <textarea className={`${inputCls} resize-none`} rows={2} value={form.description} onChange={set('description')} placeholder="Short description guests will see..." />
        </Field>

        <Field label="Photo URL" error={errors.photoUrl}>
          <input className={inputCls} value={form.photoUrl} onChange={set('photoUrl')} placeholder="https://example.com/photo.jpg" />
        </Field>

        {/* Photo preview */}
        {form.photoUrl && !errors.photoUrl && (
          <div className="overflow-hidden rounded-[18px] border border-white/10">
            <img src={form.photoUrl} alt="preview" className="h-36 w-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
          </div>
        )}

        {/* Toggles */}
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={toggle('isVeg')}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${form.isVeg ? 'border-emerald-400/30 bg-emerald-500/[0.10] text-emerald-200' : 'border-white/10 bg-white/[0.04] text-slate-400'}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${form.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {form.isVeg ? 'Veg' : 'Non-Veg'}
          </button>
          <button type="button" onClick={toggle('isAvailable')}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${form.isAvailable ? 'border-blue-400/30 bg-blue-500/[0.10] text-blue-200' : 'border-white/10 bg-white/[0.04] text-slate-400'}`}>
            {form.isAvailable ? 'Available' : 'Unavailable'}
          </button>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition hover:-translate-y-0.5 disabled:opacity-60">
            <CheckRoundedIcon fontSize="inherit" className="text-[1rem]" />
            {saving ? 'Saving…' : initial ? 'Save changes' : 'Add to menu'}
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

function MenuItemCard({ item, onEdit, onDelete, deleting }) {
  const [expanded, setExpanded] = useState(false)
  const photoUrl = item.photo_url || item.photoUrl
  const prepMinutes = item.prep_minutes || item.prepMinutes
  const isVeg = item.is_veg ?? item.isVeg
  const isAvailable = item.is_available ?? item.isAvailable
  const variants = item.variants ? item.variants.split(',').map((v) => v.trim()).filter(Boolean) : []

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-[22px] border border-white/10 bg-white/[0.04] overflow-hidden"
    >
      {/* Photo */}
      {photoUrl ? (
        <div className="relative h-40 w-full overflow-hidden bg-white/[0.03]">
          <img src={photoUrl} alt={item.name} className="h-full w-full object-cover" onError={(e) => { e.target.parentElement.style.display = 'none' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className={`absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded border-2 bg-white ${isVeg ? 'border-emerald-500' : 'border-rose-500'}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-semibold text-slate-300">Unavailable</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-28 w-full items-center justify-center bg-white/[0.02] border-b border-white/[0.06]">
          <ImageRoundedIcon fontSize="inherit" className="text-[2rem] text-slate-600" />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display text-lg tracking-[-0.04em] text-slate-50 truncate">{item.name}</p>
            <p className="mt-0.5 text-xs text-slate-400">{item.category}</p>
          </div>
          <p className="shrink-0 font-display text-xl tracking-[-0.04em] text-slate-50">₹{item.price}</p>
        </div>

        {item.description && (
          <p className="mt-2 text-xs leading-5 text-slate-400/80 line-clamp-2">{item.description}</p>
        )}

        {/* Variants */}
        {variants.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-[0.6rem] font-semibold uppercase tracking-widest text-slate-500">Variants</p>
            <div className="flex flex-wrap gap-1.5">
              {variants.map((v) => (
                <span key={v} className="rounded-full border border-emerald-400/20 bg-emerald-500/[0.08] px-2.5 py-0.5 text-[0.65rem] font-semibold text-emerald-300">
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
            <ScheduleRoundedIcon fontSize="inherit" className="text-[0.85rem] text-emerald-400" />
            {prepMinutes} min
          </span>
          {!photoUrl && (
            <span className={`inline-flex h-4 w-4 items-center justify-center rounded border-2 bg-white ${isVeg ? 'border-emerald-500' : 'border-rose-500'}`}>
              <span className={`h-2 w-2 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </span>
          )}
          <TonePill tone={isAvailable ? 'emerald' : 'slate'}>{isAvailable ? 'Available' : 'Off'}</TonePill>
          {item.demand && <TonePill tone={item.demand === 'High' ? 'brand' : 'blue'}>{item.demand} demand</TonePill>}
        </div>

        <div className="mt-4 flex gap-2 border-t border-white/[0.06] pt-4">
          <button onClick={() => onEdit(item)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white">
            <EditRoundedIcon fontSize="inherit" className="text-[0.9rem]" />
            Edit
          </button>
          <button onClick={() => onDelete(item.id)} disabled={deleting === item.id}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.07] px-4 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/[0.15] disabled:opacity-50">
            <DeleteRoundedIcon fontSize="inherit" className="text-[0.9rem]" />
            {deleting === item.id ? '…' : 'Delete'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function MenuManager({ toast }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    api.getRestaurantMenu()
      .then((data) => setItems(data.menu ?? []))
      .catch(() => toast?.('Failed to load menu', 'alert'))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (payload) => {
    setSaving(true)
    try {
      const data = await api.addMenuItem(payload)
      setItems((prev) => [...prev, data.item])
      setShowForm(false)
      toast?.(`${data.item.name} added to menu`, 'success')
    } catch (err) {
      toast?.(err.message, 'alert')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (payload) => {
    setSaving(true)
    try {
      const data = await api.updateMenuItem(editItem.id, payload)
      setItems((prev) => prev.map((i) => i.id === editItem.id ? data.item : i))
      setEditItem(null)
      toast?.(`${data.item.name} updated`, 'success')
    } catch (err) {
      toast?.(err.message, 'alert')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await api.deleteMenuItem(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast?.('Item removed from menu', 'success')
    } catch (err) {
      toast?.(err.message, 'alert')
    } finally {
      setDeleting(null)
    }
  }

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))]
  const filtered = filter === 'All' ? items : items.filter((i) => i.category === filter)

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-64 animate-pulse rounded-[22px] border border-white/10 bg-white/[0.04]" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-400">Menu management</p>
          <p className="mt-0.5 font-display text-xl tracking-[-0.04em] text-slate-50">{items.length} items on your menu</p>
        </div>
        {!showForm && !editItem && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition hover:-translate-y-0.5"
          >
            <AddRoundedIcon fontSize="inherit" className="text-[1rem]" />
            Add item
          </button>
        )}
      </div>

      {/* Add / Edit form */}
      <AnimatePresence mode="wait">
        {showForm && (
          <MenuItemForm key="add" onSave={handleAdd} onCancel={() => setShowForm(false)} saving={saving} />
        )}
        {editItem && (
          <MenuItemForm key={editItem.id} initial={editItem} onSave={handleEdit} onCancel={() => setEditItem(null)} saving={saving} />
        )}
      </AnimatePresence>

      {/* Category filter tabs */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${filter === cat ? 'border-emerald-400/30 bg-emerald-500/[0.12] text-emerald-200' : 'border-white/10 bg-white/[0.04] text-slate-400 hover:text-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Items grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title={items.length === 0 ? 'No menu items yet' : `No items in "${filter}"`}
          description={items.length === 0 ? 'Click "Add item" to build your menu. Add photos, prices, prep times and more.' : 'Try a different category filter.'}
        />
      ) : (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filtered.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={(i) => { setEditItem(i); setShowForm(false) }}
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
