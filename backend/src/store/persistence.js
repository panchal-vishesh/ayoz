import { getDb } from '../db/supabase.js'
import { buildInitialStore } from './seed.js'
import { normalizeStore } from './upgrades.js'

const STORE_TABLE = 'app_state'
const STORE_KEY = 'main'

async function loadPersistedStore() {
  const supabase = await getDb()
  const { data, error } = await supabase
    .from(STORE_TABLE)
    .select('*')
    .eq('id', STORE_KEY)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    throw error
  }

  return data || null
}

async function savePersistedStore(store) {
  const supabase = await getDb()
  const normalized = normalizeStore(store)
  const nextStore = {
    id: STORE_KEY,
    meta: {
      ...(normalized.meta ?? {}),
      updatedAt: new Date().toISOString(),
    },
    users: normalized.users ?? [],
    restaurants: normalized.restaurants ?? [],
    customerProfiles: normalized.customerProfiles ?? [],
  }

  const { data, error } = await supabase
    .from(STORE_TABLE)
    .upsert(nextStore)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function writeStore(store) {
  return savePersistedStore(store)
}

export async function bootstrapStore() {
  const persistedStore = await loadPersistedStore()

  if (!persistedStore?.users?.length) {
    return writeStore(await buildInitialStore())
  }

  return writeStore(persistedStore)
}

export async function readStore() {
  return bootstrapStore()
}
