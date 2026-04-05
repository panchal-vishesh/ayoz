import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import {
  DashboardPanel, GuidanceItems, MetricsGrid, MiniMetric,
  TonePill, WorkspaceHero,
} from '../shared'
import { MenuShareChart, ServiceFlowChart } from '../shared/charts'
import MenuManager from './MenuManager'
import StaffManager from './StaffManager'
import RestaurantSettings from './RestaurantSettings'
import {
  ChecklistList, EarningsPanel, FloorZonesList, GuestSignalsList,
  InventoryAlertsList, MenuPerformanceList, RefreshBar, ServiceBoardGrid,
} from './components/DashboardWidgets'

export default function RestaurantDashboard({ dashboard, activeSection, onSectionChange, theme, onRefresh, toast }) {
  const restaurant = dashboard.restaurant
  const lastRefreshed = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  if (activeSection === 'settings') {
    return <RestaurantSettings dashboard={dashboard} theme={theme} onSectionChange={onSectionChange} toast={toast} onRefresh={onRefresh} />
  }

  if (activeSection === 'orders') {
    return (
      <div className="space-y-4">
        <WorkspaceHero theme={theme} icon={RestaurantMenuRoundedIcon} eyebrow="Restaurant workspace" title="Live order board"
          description="Follow arrivals, table readiness, and current tickets in a layout built for active service."
          badges={[restaurant?.name ?? 'Restaurant', `${dashboard.guestSignals?.length ?? 0} live guest signals`, restaurant?.operatingHours ?? 'Service hours set']}
          actions={[
            { key: 'overview', label: 'Overview', onClick: () => onSectionChange('overview'), variant: theme.button, icon: DashboardRoundedIcon },
            { key: 'menu', label: 'Menu insights', onClick: () => onSectionChange('menu'), variant: theme.ghost, icon: StorefrontRoundedIcon },
          ]}
        />
        <RefreshBar onRefresh={onRefresh} lastRefreshed={lastRefreshed} />
        <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <DashboardPanel theme={theme} eyebrow="Orders" title="Guest signals">
            <GuestSignalsList items={dashboard.guestSignals} />
          </DashboardPanel>
          <DashboardPanel theme={theme} eyebrow="Service board" title="Kitchen flow">
            <ServiceFlowChart items={dashboard.serviceBoard} />
            <div className="mt-4"><ServiceBoardGrid items={dashboard.serviceBoard} /></div>
          </DashboardPanel>
        </div>
        <DashboardPanel theme={theme} eyebrow="Floor" title="Zone coverage">
          <FloorZonesList items={dashboard.floorZones} />
        </DashboardPanel>
      </div>
    )
  }

  if (activeSection === 'staff') {
    return (
      <div className="space-y-4">
        <WorkspaceHero theme={theme} icon={GroupsRoundedIcon} eyebrow="Restaurant workspace" title="Staff and shift readiness"
          description="Manage your team roster, add new members, track shift quality, and keep tonight's service smooth."
          badges={[`Team roster`, restaurant?.city ?? 'Restaurant city', 'Shift checklist ready']}
          actions={[
            { key: 'overview', label: 'Overview', onClick: () => onSectionChange('overview'), variant: theme.button, icon: DashboardRoundedIcon },
            { key: 'orders', label: 'Live orders', onClick: () => onSectionChange('orders'), variant: theme.ghost, icon: RestaurantMenuRoundedIcon },
          ]}
        />
        <RefreshBar onRefresh={onRefresh} lastRefreshed={lastRefreshed} />
        <DashboardPanel theme={theme} eyebrow="Team" title="Staff roster">
          <StaffManager toast={toast} />
        </DashboardPanel>
        <DashboardPanel theme={theme} eyebrow="Checklist" title="Shift checklist"
          action={<TonePill tone="emerald"><AssignmentTurnedInRoundedIcon fontSize="inherit" className="text-[0.82rem]" />Live list</TonePill>}>
          <ChecklistList items={dashboard.checklist} />
        </DashboardPanel>
        <DashboardPanel theme={theme} eyebrow="Notes" title="Restaurant guidance">
          <GuidanceItems items={dashboard.guidance} />
        </DashboardPanel>
      </div>
    )
  }

  if (activeSection === 'menu') {
    return (
      <div className="space-y-4">
        <WorkspaceHero theme={theme} icon={StorefrontRoundedIcon} eyebrow="Restaurant workspace" title="Menu and stock performance"
          description="Add dishes, upload photos, set prices and prep times. Manage your full menu from here."
          badges={[`${dashboard.menuPerformance?.length ?? 0} menu movers`, `${dashboard.inventoryAlerts?.length ?? 0} stock alerts`, restaurant?.serviceModel ?? 'Service model ready']}
          actions={[
            { key: 'overview', label: 'Overview', onClick: () => onSectionChange('overview'), variant: theme.button, icon: DashboardRoundedIcon },
            { key: 'orders', label: 'Order board', onClick: () => onSectionChange('orders'), variant: theme.ghost, icon: RestaurantMenuRoundedIcon },
          ]}
        />
        <RefreshBar onRefresh={onRefresh} lastRefreshed={lastRefreshed} />
        <DashboardPanel theme={theme} eyebrow="Menu" title="Your menu items">
          <MenuManager toast={toast} />
        </DashboardPanel>
        <div className="grid gap-6 xl:grid-cols-[1.02fr_.98fr]">
          <DashboardPanel theme={theme} eyebrow="Analytics" title="Menu performance">
            <MenuShareChart items={dashboard.menuPerformance} />
            <div className="mt-4"><MenuPerformanceList items={dashboard.menuPerformance} /></div>
          </DashboardPanel>
          <DashboardPanel theme={theme} eyebrow="Inventory" title="Inventory alerts">
            <InventoryAlertsList items={dashboard.inventoryAlerts} />
          </DashboardPanel>
        </div>
        <DashboardPanel theme={theme} eyebrow="Profile" title="Restaurant profile">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniMetric label="Restaurant" value={restaurant?.name ?? 'N/A'} />
            <MiniMetric label="City" value={restaurant?.city ?? 'N/A'} />
            <MiniMetric label="Capacity" value={String(restaurant?.seatingCapacity ?? 0)} />
            <MiniMetric label="Hours" value={restaurant?.operatingHours ?? 'N/A'} />
          </div>
        </DashboardPanel>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <WorkspaceHero theme={theme} icon={StorefrontRoundedIcon} eyebrow="Restaurant workspace"
        title={dashboard.heading ?? 'Restaurant service deck'} description={dashboard.subheading}
        badges={[restaurant?.city ?? 'City not set', restaurant?.serviceModel ?? 'Service model']}
        actions={[
          { key: 'orders', label: 'Open live orders', onClick: () => onSectionChange('orders'), variant: theme.button, icon: RestaurantMenuRoundedIcon },
          { key: 'menu', label: 'Menu insights', onClick: () => onSectionChange('menu'), variant: theme.ghost, icon: StorefrontRoundedIcon },
        ]}
      />
      <RefreshBar onRefresh={onRefresh} lastRefreshed={lastRefreshed} />
      <MetricsGrid items={dashboard.overview} theme={theme} />
      <EarningsPanel overview={dashboard.overview} />
      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardPanel theme={theme} eyebrow="Flow" title="Service board">
          <ServiceFlowChart items={dashboard.serviceBoard} />
          <div className="mt-4"><ServiceBoardGrid items={dashboard.serviceBoard?.slice(0, 4)} /></div>
        </DashboardPanel>
        <DashboardPanel theme={theme} eyebrow="Guests" title="Guest signals">
          <GuestSignalsList items={dashboard.guestSignals?.slice(0, 3)} />
        </DashboardPanel>
      </div>
    </div>
  )
}
