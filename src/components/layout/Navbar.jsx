import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Laptop, LogOut, User, ChevronDown, Bell, Search, Sun, Moon, Shield, Menu, Box } from 'lucide-react'
import { useAuthStore, ALL_ROLES } from '@/store/useAuthStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { Badge } from '@/components/ui/Badge'

export const Navbar = ({ onMenuClick }) => {
  const { currentUser, logout, devices } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { getUnreadCount } = useNotificationStore()
  const navigate = useNavigate()

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const unreadCount = getUnreadCount()
  const userRoleObj = ALL_ROLES.find(r => r.id === currentUser.role) || ALL_ROLES[0]

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left: Mobile Hamburger Toggle + Search & Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Brand Name (visible only on mobile where docked sidebar is hidden) */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-sm text-white">
            <Box className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm tracking-wider text-slate-900 dark:text-white">FILLFREE</span>
        </div>

        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKUs, Lots, Warehouses, Invoices..."
            className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-1.5 pl-9 pr-4 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Light & Dark Mode Toggle Switch */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600" />
          )}
        </button>

        {/* Fixed Session Role Badge (No header dropdown as requested) */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
          <Shield className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
          <span className="text-slate-400">Role:</span>
          <Badge className={userRoleObj.badge}>{userRoleObj.name}</Badge>
        </div>

        {/* Active Devices Button */}
        <Link
          to="/profile"
          className="relative flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          title="Active Logged-in Devices"
        >
          <Laptop className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
          <span className="hidden sm:inline font-sans font-medium">{devices.length} Devices</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </Link>

        {/* Connected Notifications Bell Button */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
          title="Notifications Center"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700"
            />
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{currentUser.email}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl z-50 animate-in zoom-in-95">
              <div className="px-2 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser.email}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/profile')
                  setIsUserMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <User className="h-4 w-4 text-slate-400" />
                View Profile & Devices
              </button>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                  setIsUserMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-rose-500 dark:text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="h-4 w-4" />
                Logout Session
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
