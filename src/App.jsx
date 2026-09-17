import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { LoginView } from '@/views/auth/LoginView'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardView } from '@/views/DashboardView'
import { AnalyticsView } from '@/views/AnalyticsView'
import { CategoriesView } from '@/views/CategoriesView'
import { ProductsView } from '@/views/ProductsView'
import { WarehousesView } from '@/views/WarehousesView'
import { StockLossView } from '@/views/StockLossView'
import { PartnersView } from '@/views/PartnersView'
import { PersonnelView } from '@/views/PersonnelView'
import { CommissionsView } from '@/views/CommissionsView'
import { BillingView } from '@/views/BillingView'
import { ProcurementView } from '@/views/ProcurementView'
import { MastersView } from '@/views/MastersView'
import { CouponsView } from '@/views/CouponsView'
import { ProfileView } from '@/views/ProfileView'
import { NotificationsView } from '@/views/NotificationsView'

function useHydratedAuth() {
  const auth = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(() => {
    return (
      auth._hasHydrated ||
      (typeof window !== 'undefined' && useAuthStore.persist?.hasHydrated?.()) ||
      false
    )
  })

  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated?.() || auth._hasHydrated) {
      setIsHydrated(true)
      return
    }

    const unsub = useAuthStore.persist?.onFinishHydration?.(() => {
      setIsHydrated(true)
    })

    // Safety timeout ensuring we never lock the UI
    const timer = setTimeout(() => {
      setIsHydrated(true)
    }, 60)

    return () => {
      unsub?.()
      clearTimeout(timer)
    }
  }, [auth._hasHydrated])

  return { ...auth, isHydrated }
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isHydrated } = useHydratedAuth()

  // Prevent flash-of-redirect on page refresh while Zustand rehydrates from localStorage
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[11px] font-mono tracking-wider text-slate-500">RESUMING FILLFREE SESSION...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export function App() {
  const { isAuthenticated, isHydrated } = useHydratedAuth()

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[11px] font-mono tracking-wider text-slate-500">RESUMING FILLFREE SESSION...</p>
      </div>
    )
  }

  return (
    <Routes>
      {/* Root Route: If unauthenticated, render LoginView directly at '/'. If authenticated, redirect to /dashboard */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginView />
          )
        }
      />

      {/* Protected ERP Portal Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/analytics" element={<AnalyticsView />} />
        <Route path="/procurement" element={<ProcurementView />} />
        <Route path="/billing" element={<BillingView />} />
        <Route path="/masters" element={<MastersView />} />
        <Route path="/categories" element={<CategoriesView />} />
        <Route path="/products" element={<ProductsView />} />
        <Route path="/warehouses" element={<WarehousesView />} />
        <Route path="/stock-loss" element={<StockLossView />} />
        <Route path="/partners" element={<PartnersView />} />
        <Route path="/personnel" element={<PersonnelView />} />
        <Route path="/commissions" element={<CommissionsView />} />
        <Route path="/coupons" element={<CouponsView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/notifications" element={<NotificationsView />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />}
      />
    </Routes>
  )
}

export default App
