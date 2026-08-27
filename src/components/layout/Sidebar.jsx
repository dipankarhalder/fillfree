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
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

export const NAVIGATION_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/categories', label: 'Categories', icon: FolderTree },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/warehouses', label: 'Warehouses', icon: Building2 },
  { path: '/stock-loss', label: 'Stock Loss', icon: AlertTriangle },
  { path: '/partners', label: 'Partners', icon: Users2 },
  { path: '/personnel', label: 'Personnel', icon: UserCheck },
  { path: '/billing', label: 'Billing', icon: Receipt },
  { path: '/coupons', label: 'Coupons', icon: Ticket },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/profile', label: 'Profile', icon: UserCircle2 },
]

export const Sidebar = () => {
  const { activeRole } = useAuthStore()

  return (
    <aside className="w-52 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between h-screen sticky top-0 left-0 select-none transition-colors z-40">
      <div>
        {/* Full Top-to-Bottom Logo Header */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 dark:border-slate-900">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20 shrink-0">
            <Box className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="truncate">
            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-wider font-sans leading-none">FILLFREE</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">Logistics ERP</p>
          </div>
        </div>

        {/* Navigation Menu with comfortable spacing & larger text size */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-9rem)]">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Core Modules
          </p>
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-indigo-600/10 dark:bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/30 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200")} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", isActive && "opacity-100 text-indigo-500")} />
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Role Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-900 m-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <div className="truncate">
            <p className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500">Session Role</p>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{activeRole}</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-1" />
        </div>
      </div>
    </aside>
  )
}
