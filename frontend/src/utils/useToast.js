import { useCallback, useRef, useState } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const toast = useCallback((message, type = 'info', duration = 2800) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    timers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      delete timers.current[id]
    }, duration)
  }, [])

  return { toasts, toast }
}
