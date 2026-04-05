import AdminAnalytics from './AdminAnalytics'
import AdminOverview from './AdminOverview'
import AdminRestaurants from './AdminRestaurants'
import AdminSettings from './AdminSettings'
import AdminSupport from './AdminSupport'
import AdminUsers from './AdminUsers'

export default function AdminDashboard({ dashboard, activeSection, onSectionChange, theme, onRefresh, toast, loading }) {
  if (activeSection === 'restaurants') {
    return <AdminRestaurants dashboard={dashboard} onSectionChange={onSectionChange} onRefresh={onRefresh} toast={toast} />
  }
  if (activeSection === 'analytics') {
    return <AdminAnalytics dashboard={dashboard} onSectionChange={onSectionChange} />
  }
  if (activeSection === 'users') {
    return <AdminUsers onSectionChange={onSectionChange} toast={toast} />
  }
  if (activeSection === 'support') {
    return <AdminSupport dashboard={dashboard} onSectionChange={onSectionChange} />
  }
  if (activeSection === 'settings') {
    return <AdminSettings dashboard={dashboard} onSectionChange={onSectionChange} toast={toast} />
  }
  return <AdminOverview dashboard={dashboard} onSectionChange={onSectionChange} activeSection={activeSection} onRefresh={onRefresh} loading={loading} />
}
