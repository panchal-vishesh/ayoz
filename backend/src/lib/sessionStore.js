import { Store } from 'express-session'
import { randomUUID } from 'node:crypto'
import { getSupabaseServiceClient } from '../db/supabase.js'

export class SupabaseSessionStore extends Store {
  constructor(options = {}) {
    super(options)
    this.ttl = options.ttl || 86400
    this.supabase = getSupabaseServiceClient()
    this.prefix = options.prefix || 'sess:'
    this._cleanupInterval = options.cleanupInterval || 15 * 60 * 1000 // 15 mins

    // Periodically clean up expired sessions
    this._startCleanup()
  }

  _startCleanup() {
    this._cleanup = setInterval(async () => {
      try {
        await this.supabase
          .from('sessions')
          .delete()
          .lt('expire', new Date().toISOString())
      } catch {}
    }, this._cleanupInterval)

    // Don't block process exit
    if (this._cleanup.unref) this._cleanup.unref()
  }

  // ── get ───────────────────────────────────────────────────────────────────
  get(sid, callback) {
    this.supabase
      .from('sessions')
      .select('sess, expire')
      .eq('sid', sid)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) return callback(error)
        if (!data) return callback(null, null)

        // Expired?
        if (new Date(data.expire) < new Date()) {
          this.destroy(sid, () => {})
          return callback(null, null)
        }

        callback(null, typeof data.sess === 'string' ? JSON.parse(data.sess) : data.sess)
      })
      .catch(callback)
  }

  // ── set ───────────────────────────────────────────────────────────────────
  set(sid, sess, callback) {
    const ttl = this._getTTL(sess)
    const expire = new Date(Date.now() + ttl * 1000).toISOString()

    this.supabase
      .from('sessions')
      .upsert({ sid, sess, expire }, { onConflict: 'sid' })
      .then(({ error }) => callback(error || null))
      .catch(callback)
  }

  // ── destroy ───────────────────────────────────────────────────────────────
  destroy(sid, callback) {
    this.supabase
      .from('sessions')
      .delete()
      .eq('sid', sid)
      .then(({ error }) => callback(error || null))
      .catch(callback)
  }

  // ── touch ─────────────────────────────────────────────────────────────────
  touch(sid, sess, callback) {
    const ttl = this._getTTL(sess)
    const expire = new Date(Date.now() + ttl * 1000).toISOString()

    this.supabase
      .from('sessions')
      .update({ expire, sess })
      .eq('sid', sid)
      .then(({ error }) => callback(error || null))
      .catch(callback)
  }

  // ── all ───────────────────────────────────────────────────────────────────
  all(callback) {
    this.supabase
      .from('sessions')
      .select('sid, sess')
      .gt('expire', new Date().toISOString())
      .then(({ data, error }) => {
        if (error) return callback(error)
        const sessions = (data || []).reduce((acc, row) => {
          acc[row.sid] = typeof row.sess === 'string' ? JSON.parse(row.sess) : row.sess
          return acc
        }, {})
        callback(null, sessions)
      })
      .catch(callback)
  }

  // ── length ────────────────────────────────────────────────────────────────
  length(callback) {
    this.supabase
      .from('sessions')
      .select('sid', { count: 'exact', head: true })
      .gt('expire', new Date().toISOString())
      .then(({ count, error }) => callback(error || null, count || 0))
      .catch(callback)
  }

  // ── clear ─────────────────────────────────────────────────────────────────
  clear(callback) {
    this.supabase
      .from('sessions')
      .delete()
      .neq('sid', '')
      .then(({ error }) => callback(error || null))
      .catch(callback)
  }

  // ── helpers ───────────────────────────────────────────────────────────────
  _getTTL(sess) {
    if (sess?.cookie?.expires) {
      return Math.ceil((new Date(sess.cookie.expires) - Date.now()) / 1000)
    }
    if (sess?.cookie?.maxAge) {
      return Math.ceil(sess.cookie.maxAge / 1000)
    }
    return this.ttl
  }
}
