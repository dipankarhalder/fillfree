import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

export const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex antialiased transition-colors">
      {/* 1. Desktop Docked Sidebar (Hidden on Mobile/Tablet < lg) */}
      <div className="hidden lg:flex shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* 2. Mobile Responsive Off-Canvas Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 3. Mobile Responsive Sliding Off-Canvas Drawer (lg:hidden) */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* 4. Right Fluid Content View */}
      <div className="flex flex-1 flex-col min-w-0 min-h-screen">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 px-3.5 sm:px-6 py-5 w-full max-w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
export default AppLayout
