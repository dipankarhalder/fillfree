import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  Package,
  FolderTree,
  Users2,
  UserCheck,
  Receipt,
  Ticket,
  UserCircle2,
  Box,
  ChevronRight,
  Bell,
  Coins,
  Truck,
  Settings2,
  X,
  ShieldAlert,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

export const NAVIGATION_CATEGORIES = [
  {
    category: 'Overview & Analytics',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/analytics', label: 'Analytics', icon: BarChart3 }
    ]
  },
  {
    category: 'Inventory & Godam',
    items: [
      { path: '/products', label: 'Products & Stock', icon: Package },
      { path: '/warehouses', label: 'Godams / Warehouses', icon: Building2 },
      { path: '/stock-loss', label: 'Stock Loss & Damage', icon: AlertTriangle }
    ]
  },
  {
    category: 'Procurement & Sales',
    items: [
      { path: '/procurement', label: 'Lot Procurement', icon: Truck },
      { path: '/billing', label: 'Sales Billing', icon: Receipt },
      { path: '/commissions', label: 'Commission Matrix', icon: Coins },
      { path: '/coupons', label: 'Discount Coupons', icon: Ticket }
    ]
  },
  {
    category: 'Partners & CRM',
    items: [
      { path: '/partners', label: 'Trade Partners', icon: Users2 },
      { path: '/personnel', label: 'Staff & Personnel', icon: UserCheck }
    ]
  },
  {
    category: 'Master Configuration',
    badge: 'Super Admin',
    items: [
      { path: '/masters', label: 'Master Console', icon: Settings2, superAdminBadge: true },
      { path: '/categories', label: 'Taxonomy & Subcat', icon: FolderTree }
    ]
  },
  {
    category: 'System & Account',
    items: [
      { path: '/notifications', label: 'Notifications', icon: Bell },
      { path: '/profile', label: 'Profile & Sessions', icon: UserCircle2 }
    ]
  }
]

export const Sidebar = ({ onClose }) => {
  const { activeRole, currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'Super_admin'

  const handleNavClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <aside className="w-64 sm:w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between h-full select-none transition-colors">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20 shrink-0">
              <Box className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="truncate">
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-wider font-sans leading-none">FILLFREE</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">Logistics ERP</p>
            </div>
          </div>

          {/* Close button for Mobile Drawer (hidden on Desktop) */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Categorized Navigation Menu with Smooth Scrolling */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-8.5rem)] scrollbar-thin">
          {NAVIGATION_CATEGORIES.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between px-2.5 py-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.category}
                </span>
                {section.badge && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30 uppercase tracking-tight">
                    {section.badge}
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        cn(
                          "group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-150",
                          isActive
                            ? "bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/30 shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon
                              className={cn(
                                "h-4 w-4 shrink-0 transition-colors",
                                isActive
                                  ? "text-indigo-600 dark:text-indigo-400"
                                  : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {item.superAdminBadge && (
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" title="Super Admin Module" />
                            )}
                            <ChevronRight
                              className={cn(
                                "h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                                isActive && "opacity-100 text-indigo-500"
                              )}
                            />
                          </div>
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Role Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-900 m-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <div className="truncate">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Session
            </p>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
              {currentUser?.name || 'Authorized User'}
            </p>
            <p className="text-[10px] text-slate-400 truncate capitalize">
              Role: {activeRole?.replace('_', ' ')}
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-1" title="Connected" />
        </div>
      </div>
    </aside>
  )
}
export default Sidebar
