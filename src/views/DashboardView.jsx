import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IndianRupee,
  Building2,
  AlertTriangle,
  PackageCheck,
  TrendingUp,
  ArrowUpRight,
  TrendingDown,
  Clock,
  Layers,
  ArrowRight,
  Calculator,
  CheckCircle2,
  XCircle,
  Package
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useWarehouseStore } from '@/store/useWarehouseStore'
import { useStockStore } from '@/store/useStockStore'
import { useBillingStore } from '@/store/useBillingStore'
import { useDataStore } from '@/store/useDataStore'
import { formatCurrency, formatDate } from '@/lib/utils'

export const DashboardView = () => {
  const navigate = useNavigate()
  const { warehouses } = useWarehouseStore()
  const { getLossAnalytics, lossRecords } = useStockStore()
  const { salesOrders, lotPurchases } = useBillingStore()
  const { products } = useDataStore()

  const [revenueTimeframe, setRevenueTimeframe] = useState('weekly') // 'weekly' | 'monthly' | 'yearly'

  const lossAnalytics = getLossAnalytics()
  const timeframeData = lossAnalytics[revenueTimeframe]

  // Dynamic calculations across all live inventory items
  const totalReceivedStock = products.reduce((sum, p) => sum + (p.totalStockReceived || p.quantity), 0)
  const totalGoodStock = products.reduce((sum, p) => sum + (p.goodQty !== undefined ? p.goodQty : p.quantity), 0)
  const totalDamagedStock = products.reduce((sum, p) => sum + (p.damagedCount || 0), 0)
  const totalExpiredStock = products.reduce((sum, p) => sum + (p.expiredCount || 0), 0)

  const totalSalesRevenue = salesOrders.reduce((sum, s) => sum + s.finalTotal, 0)
  const totalWarehousesCapacity = warehouses.reduce((sum, w) => sum + w.totalCapacity, 0)
  const totalOccupiedCapacity = warehouses.reduce((sum, w) => sum + w.occupiedCapacity, 0)
  const overallOccupancyPct = Math.round((totalOccupiedCapacity / totalWarehousesCapacity) * 100)

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Logistics & Revenue Reconciliation Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time stock reconciliation and financial revenue impact tracking across all warehouses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/billing')} variant="default" size="sm">
            <ReceiptIcon className="h-4 w-4 mr-1.5" />
            New Lot / Sale
          </Button>
          <Button onClick={() => navigate('/stock-loss')} variant="outline" size="sm">
            <AlertTriangle className="h-4 w-4 mr-1.5 text-rose-500" />
            Report Loss
          </Button>
        </div>
      </div>

      {/* Dynamic Live Inventory Stock Reconciliation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Received Stock</p>
            <Package className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-sans">{totalReceivedStock.toLocaleString()} units</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
            <span>Good / Saleable Stock</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-sans">{totalGoodStock.toLocaleString()} units</p>
        </div>

        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-4">
          <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-semibold">
            <span>Damaged Goods</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2 font-sans">{totalDamagedStock.toLocaleString()} units</p>
        </div>

        <div className="rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 p-4">
          <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-300 font-semibold">
            <span>Expired Goods</span>
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2 font-sans">{totalExpiredStock.toLocaleString()} units</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Exceeded shelf-life limit</p>
        </div>
      </div>

      {/* Primary Financial Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Sales Revenue"
          value={formatCurrency(totalSalesRevenue)}
          subtitle="Processed via Good Product Orders"
          icon={IndianRupee}
          trend="+18.4%"
          trendType="up"
          accentColor="emerald"
        />

        <StatCard
          title="Warehouse Storage Utilized"
          value={`${overallOccupancyPct}% Occupied`}
          subtitle={`${(totalOccupiedCapacity/1000).toFixed(1)}k / ${(totalWarehousesCapacity/1000).toFixed(1)}k total units`}
          icon={Building2}
          trend="Optimal Range"
          trendType="up"
          accentColor="indigo"
        />

        <StatCard
          title={`Total Stock Loss (${revenueTimeframe.toUpperCase()})`}
          value={formatCurrency(timeframeData.totalLoss)}
          subtitle={`${timeframeData.damagedQty} damaged + ${timeframeData.expiredQty} expired`}
          icon={AlertTriangle}
          trend="Calculated Loss"
          trendType="down"
          accentColor="rose"
        />

        <StatCard
          title={`Net Effective Revenue (${revenueTimeframe.toUpperCase()})`}
          value={formatCurrency(timeframeData.netRevenue)}
          subtitle="Sales Revenue minus Total Stock Loss"
          icon={TrendingUp}
          trend="Realized Profit"
          trendType="up"
          accentColor="purple"
        />
      </div>

      {/* Financial Revenue & Loss Analytics Card (Weekly / Monthly / Yearly) */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Timeframe Revenue & Stock Loss Calculation</CardTitle>
              <Badge variant="cyan">Date Range Breakdown</Badge>
            </div>
            <CardDescription className="mt-1">
              Select date timeframe to calculate Gross Revenue, Damaged Goods Loss, Expired Goods Loss, and Net Revenue.
            </CardDescription>
          </div>

          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800">
            {[
              { id: 'weekly', label: 'Weekly' },
              { id: 'monthly', label: 'Monthly' },
              { id: 'yearly', label: 'Yearly' }
            ].map((tf) => (
              <button
                key={tf.id}
                onClick={() => setRevenueTimeframe(tf.id)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold uppercase transition-all ${
                  revenueTimeframe === tf.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Gross Revenue */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Gross Sales Revenue ({revenueTimeframe})
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(timeframeData.grossSalesRevenue)}
              </p>
              <p className="text-[11px] text-slate-500">From Good Sellable Stock</p>
            </div>

            {/* Damaged Loss */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Damaged Goods Loss ({timeframeData.damagedQty} units)
              </p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                -{formatCurrency(timeframeData.damagedLoss)}
              </p>
              <ProgressBar value={timeframeData.damagedLoss} max={timeframeData.totalLoss || 1} color="amber" className="mt-2" />
            </div>

            {/* Expired Loss */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Expired Goods Loss ({timeframeData.expiredQty} units)
              </p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                -{formatCurrency(timeframeData.expiredLoss)}
              </p>
              <ProgressBar value={timeframeData.expiredLoss} max={timeframeData.totalLoss || 1} color="purple" className="mt-2" />
            </div>

            {/* Net Effective Revenue */}
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 space-y-1">
              <p className="text-xs text-indigo-600 dark:text-indigo-300 uppercase font-semibold">
                Net Realized Revenue
              </p>
              <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(timeframeData.netRevenue)}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Gross Sales minus Total Stock Loss</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warehouses & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Warehouse Facilities & Occupancy</CardTitle>
              <CardDescription>Capacity breakdown and room/row/shelf locator active status</CardDescription>
            </div>
            <Button onClick={() => navigate('/warehouses')} variant="ghost" size="sm">
              View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {warehouses.map((wh) => {
              const occPct = Math.round((wh.occupiedCapacity / wh.totalCapacity) * 100)
              return (
                <div key={wh.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{wh.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{wh.location}</p>
                    </div>
                    <Badge variant={occPct > 80 ? 'warning' : 'default'}>{occPct}% Full</Badge>
                  </div>

                  <ProgressBar value={wh.occupiedCapacity} max={wh.totalCapacity} color={occPct > 80 ? 'amber' : 'indigo'} />

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span>Manager: <strong className="text-slate-900 dark:text-slate-200">{wh.managerName}</strong></span>
                    <span>Staff: <strong className="text-slate-900 dark:text-slate-200">{wh.staffCount} Members</strong></span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Order Sales Billing</CardTitle>
              <CardDescription>Latest customer transactions and payment statuses</CardDescription>
            </div>
            <Button onClick={() => navigate('/billing')} variant="ghost" size="sm">
              Manage Billing <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {salesOrders.map((sale) => (
              <div key={sale.orderId} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{sale.orderId}</span>
                    <Badge variant={sale.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                      {sale.paymentStatus}
                    </Badge>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-slate-200 mt-1">{sale.customerName}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{formatDate(sale.saleDate)} • Lot: {sale.lotName}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(sale.finalTotal)}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Tax: {formatCurrency(sale.taxAmount)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ReceiptIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
