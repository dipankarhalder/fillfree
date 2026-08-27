import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex antialiased transition-colors">
      {/* Sidebar: Full height top to bottom on the far left */}
      <Sidebar />

      {/* Right Content Body: Aligned Top Bar (Navbar) + Main Views */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 py-5 w-full max-w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
