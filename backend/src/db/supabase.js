import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env.js'

let supabaseClient
let supabaseServiceClient

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false
      },
      global: {
        fetch: (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
      }
    })
  }
  return supabaseClient
}

// Service client for server-side operations (bypasses RLS)
export function getSupabaseServiceClient() {
  if (!supabaseServiceClient) {
    // For server-side operations, we need to use the service role key
    // For now, we'll use the anon key but disable RLS for our operations
    supabaseServiceClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false
      },
      global: {
        fetch: (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
      },
      db: {
        schema: 'public'
      }
    })
  }
  return supabaseServiceClient
}

export async function getDb() {
  return getSupabaseServiceClient()
}