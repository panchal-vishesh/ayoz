import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

const SettingsContext = createContext(null)

const DEFAULT_TOGGLES = {
  geoTriggers:       true,
  customerSignup:    true,
  arrivalAlerts:     true,
  autoCredentials:   false,
  maintenanceMode:   false,
  analyticsTracking: true,
}

export function SettingsProvider({ children }) {
  const [toggles, setToggles] = useState(DEFAULT_TOGGLES)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.getAdminSettings()
      .then((data) => {
        if (data?.toggles) setToggles(data.toggles)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <SettingsContext.Provider value={{ toggles, setToggles, loaded }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
