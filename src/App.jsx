import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { LoginView } from '@/views/auth/LoginView'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardView } from '@/views/DashboardView'
import { CategoriesView } from '@/views/CategoriesView'
import { ProductsView } from '@/views/ProductsView'
import { WarehousesView } from '@/views/WarehousesView'
import { StockLossView } from '@/views/StockLossView'
import { PartnersView } from '@/views/PartnersView'
import { PersonnelView } from '@/views/PersonnelView'
import { BillingView } from '@/views/BillingView'
import { CouponsView } from '@/views/CouponsView'
import { ProfileView } from '@/views/ProfileView'
import { NotificationsView } from '@/views/NotificationsView'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

export function App() {
  return (
    <Routes>
      {/* Standalone Login Route */}
      <Route path="/login" element={<LoginView />} />

      {/* Protected ERP Portal Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="categories" element={<CategoriesView />} />
        <Route path="products" element={<ProductsView />} />
        <Route path="warehouses" element={<WarehousesView />} />
        <Route path="stock-loss" element={<StockLossView />} />
        <Route path="partners" element={<PartnersView />} />
        <Route path="personnel" element={<PersonnelView />} />
        <Route path="billing" element={<BillingView />} />
        <Route path="coupons" element={<CouponsView />} />
        <Route path="profile" element={<ProfileView />} />
        <Route path="notifications" element={<NotificationsView />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
