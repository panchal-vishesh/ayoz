import { useEffect, useState, useCallback, useRef } from 'react'
import { api, getToken, clearToken } from '../api/client'

const SESSION_USER_KEY = 'ayoz_session_user'

// Connection states
export const CONNECTION_STATE = {
  CONNECTED:    'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
  RESTORED:     'restored',
}

// Exponential backoff intervals (ms): 2s, 4s, 8s, 15s, 30s, 60s max
const BACKOFF = [2000, 4000, 8000, 15000, 30000, 60000]

export function useAuthSession() {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(SESSION_USER_KEY)
      return cached ? JSON.parse(cached) : null
    } catch { return null }
  })
  const [initializing, setInitializing]       = useState(true)
  const [connectionState, setConnectionState] = useState(CONNECTION_STATE.CONNECTED)
  const [retryCount, setRetryCount]           = useState(0)
  const [nextRetryIn, setNextRetryIn]         = useState(0)

  const retryTimerRef    = useRef(null)
  const countdownRef     = useRef(null)
  const retryCountRef    = useRef(0)
  const isReconnecting   = useRef(false)

  const clearTimers = useCallback(() => {
    if (retryTimerRef.current)  clearTimeout(retryTimerRef.current)
    if (countdownRef.current)   clearInterval(countdownRef.current)
  }, [])

  const startCountdown = useCallback((ms) => {
    let remaining = Math.ceil(ms / 1000)
    setNextRetryIn(remaining)
    if (countdownRef.current) clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      remaining -= 1
      setNextRetryIn(remaining)
      if (remaining <= 0) clearInterval(countdownRef.current)
    }, 1000)
  }, [])

  const scheduleRetry = useCallback((attempt) => {
    const delay = BACKOFF[Math.min(attempt, BACKOFF.length - 1)]
    setConnectionState(CONNECTION_STATE.RECONNECTING)
    startCountdown(delay)
    retryTimerRef.current = setTimeout(() => attemptReconnect(), delay)
  }, [startCountdown])

  const attemptReconnect = useCallback(async () => {
    if (isReconnecting.current) return
    isReconnecting.current = true
    setConnectionState(CONNECTION_STATE.RECONNECTING)
    setNextRetryIn(0)

    try {
      const data = await api.getMe()
      // ✅ Server is back!
      clearTimers()
      isReconnecting.current = false
      retryCountRef.current  = 0
      setRetryCount(0)
      setUser(data.user)
      setConnectionState(CONNECTION_STATE.RESTORED)
      try { localStorage.setItem(SESSION_USER_KEY, JSON.stringify(data.user)) } catch {}

      // Show "restored" state briefly then go back to connected
      setTimeout(() => setConnectionState(CONNECTION_STATE.CONNECTED), 3000)

    } catch (err) {
      isReconnecting.current = false

      if (err?.status === 0 || err?.status === undefined) {
        // Still down - schedule next retry with backoff
        retryCountRef.current += 1
        setRetryCount(retryCountRef.current)
        scheduleRetry(retryCountRef.current)
      } else {
        // Server is up but session expired - clear user
        clearTimers()
        setUser(null)
        setConnectionState(CONNECTION_STATE.CONNECTED)
        try { localStorage.removeItem(SESSION_USER_KEY) } catch {}
      }
    }
  }, [clearTimers, scheduleRetry])

  const checkSession = useCallback(async (isInitial = false) => {
    try {
      // If no token, user is not logged in
      if (!getToken()) {
        setUser(null)
        setConnectionState(CONNECTION_STATE.CONNECTED)
        if (isInitial) setInitializing(false)
        return
      }
      // If we have cached user and token, trust it without a network call on initial load
      if (isInitial) {
        const cached = localStorage.getItem(SESSION_USER_KEY)
        if (cached) {
          setUser(JSON.parse(cached))
          setConnectionState(CONNECTION_STATE.CONNECTED)
          setInitializing(false)
          return
        }
      }
      const data = await api.getMe()
      setUser(data.user)
      setConnectionState(CONNECTION_STATE.CONNECTED)
      try { localStorage.setItem(SESSION_USER_KEY, JSON.stringify(data.user)) } catch {}
    } catch (err) {
      if (err?.status === 0 || err?.status === undefined) {
        // On initial load, wait 60s silently (backend cold start) before showing banner
        if (isInitial) {
          retryTimerRef.current = setTimeout(() => {
            setConnectionState(CONNECTION_STATE.DISCONNECTED)
            scheduleRetry(0)
          }, 60000)
        } else {
          setConnectionState(CONNECTION_STATE.DISCONNECTED)
          scheduleRetry(0)
        }
      } else if (err?.status === 401) {
        // Only clear user on 401 if there's no cached user (don't wipe a just-logged-in user)
        const cached = localStorage.getItem(SESSION_USER_KEY)
        if (!cached) {
          setUser(null)
          setConnectionState(CONNECTION_STATE.CONNECTED)
        }
      } else {
        setUser(null)
        setConnectionState(CONNECTION_STATE.CONNECTED)
        try { localStorage.removeItem(SESSION_USER_KEY) } catch {}
      }
    } finally {
      if (isInitial) setInitializing(false)
    }
  }, [scheduleRetry])

  // Initial session check
  useEffect(() => {
    checkSession(true)
    return () => clearTimers()
  }, [checkSession, clearTimers])

  const login = async (payload) => {
    const data = await api.login(payload)
    setUser(data.user)
    setConnectionState(CONNECTION_STATE.CONNECTED)
    try { localStorage.setItem(SESSION_USER_KEY, JSON.stringify(data.user)) } catch {}
    return data
  }

  const signup = async (payload) => {
    const data = await api.signup(payload)
    setUser(data.user)
    try { localStorage.setItem(SESSION_USER_KEY, JSON.stringify(data.user)) } catch {}
    return data
  }

  const logout = async () => {
    clearTimers()
    clearToken()
    setUser(null)
  }

  const manualRetry = useCallback(() => {
    clearTimers()
    retryCountRef.current = 0
    setRetryCount(0)
    setNextRetryIn(0)
    attemptReconnect()
  }, [clearTimers, attemptReconnect])

  return {
    user,
    initializing,
    connectionState,
    retryCount,
    nextRetryIn,
    serverDown: connectionState === CONNECTION_STATE.DISCONNECTED || connectionState === CONNECTION_STATE.RECONNECTING,
    login,
    signup,
    logout,
    manualRetry,
  }
}
