import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import 'chart.js/auto'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
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
  Package,
  BarChart3,
  Receipt
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
import { useThemeStore } from '@/store/useThemeStore'
import { formatCurrency, formatDate } from '@/lib/utils'

export const DashboardView = () => {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const { warehouses } = useWarehouseStore()
  const { getLossAnalytics } = useStockStore()
  const { salesOrders } = useBillingStore()
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

  // Chart styling colors based on current theme
  const textColor = isDark ? '#94a3b8' : '#475569'
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(226, 232, 240, 0.7)'
  const tooltipBg = isDark ? '#0f172a' : '#1e293b'
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1'

  // Timeframe chart dataset (Weekly / Monthly / Yearly)
  const timeframeChartData = useMemo(() => {
    let labels = []
    let salesData = []
    let netProfitData = []
    let lossData = []

    if (revenueTimeframe === 'weekly') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      salesData = [18500, 32000, 24000, 48000, 56000, 68000, 42000]
      lossData = [1200, 800, 1500, 2100, 950, 1400, 850]
      netProfitData = salesData.map((s, i) => s - lossData[i] - 3000)
    } else if (revenueTimeframe === 'monthly') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      salesData = [240000, 310000, 420000, 380000]
      lossData = [18000, 24000, 15000, 22000]
      netProfitData = salesData.map((s, i) => s - lossData[i] - 60000)
    } else {
      labels = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)']
      salesData = [1800000, 2450000, 3200000, 4100000]
      lossData = [120000, 160000, 190000, 210000]
      netProfitData = salesData.map((s, i) => s - lossData[i] - 750000)
    }

    return {
      labels,
      datasets: [
        {
          type: 'line',
          label: 'Net Realized Revenue (₹)',
          data: netProfitData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#10b981'
        },
        {
          type: 'bar',
          label: 'Gross Sales Revenue (₹)',
          data: salesData,
          backgroundColor: isDark ? 'rgba(99, 102, 241, 0.85)' : 'rgba(99, 102, 241, 0.85)',
          borderRadius: 6
        },
        {
          type: 'bar',
          label: 'Stock Loss Deductions (₹)',
          data: lossData,
          backgroundColor: isDark ? 'rgba(244, 63, 94, 0.75)' : 'rgba(244, 63, 94, 0.75)',
          borderRadius: 6
        }
      ]
    }
  }, [revenueTimeframe, isDark])

  // Mini Doughnut for stock conditions
  const stockConditionData = useMemo(() => ({
    labels: ['Good / Sellable', 'Damaged Quarantined', 'Expired Goods'],
    datasets: [
      {
        data: [totalGoodStock, totalDamagedStock, totalExpiredStock],
        backgroundColor: ['#10b981', '#f59e0b', '#a855f7'],
        borderColor: isDark ? '#0f172a' : '#ffffff',
        borderWidth: 2
      }
    ]
  }), [totalGoodStock, totalDamagedStock, totalExpiredStock, isDark])

  // Warehouse occupancy mini bar
  const warehouseOccupancyData = useMemo(() => ({
    labels: warehouses.map(w => w.name.split(' ')[0]),
    datasets: [
      {
        label: 'Occupancy %',
        data: warehouses.map(w => Math.round((w.occupiedCapacity / w.totalCapacity) * 100)),
        backgroundColor: warehouses.map(w => {
          const pct = (w.occupiedCapacity / w.totalCapacity) * 100
          return pct > 85 ? '#f43f5e' : pct > 70 ? '#f59e0b' : '#6366f1'
        }),
        borderRadius: 4
      }
    ]
  }), [warehouses])

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { size: 11 },
          boxWidth: 12,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 10 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 10 } }
      }
    }
  }), [textColor, gridColor, tooltipBg, tooltipBorder])

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
          <Button onClick={() => navigate('/analytics')} variant="outline" size="sm" className="gap-1.5 text-xs">
            <BarChart3 className="h-4 w-4 text-indigo-500" />
            Full Analytics BI
          </Button>
          <Button onClick={() => navigate('/billing')} variant="default" size="sm" className="text-xs">
            <Receipt className="h-4 w-4 mr-1.5" />
            New Order Sale
          </Button>
          <Button onClick={() => navigate('/stock-loss')} variant="outline" size="sm" className="text-xs">
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

      {/* Financial Revenue & Loss Analytics Card (Weekly / Monthly / Yearly) WITH INTEGRATED CHART */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Timeframe Revenue & Stock Loss Calculation</CardTitle>
              <Badge variant="cyan">Date Range Breakdown</Badge>
            </div>
            <CardDescription className="mt-1">
              Interactive Chart.js trend visualization of Gross Revenue, Damaged Loss, and Net Realized Margin.
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

        <CardContent className="space-y-6">
          {/* Key Metric Numbers Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Gross Sales Revenue ({revenueTimeframe})
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(timeframeData.grossSalesRevenue)}
              </p>
              <p className="text-[11px] text-slate-500">From Good Sellable Stock</p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Damaged Goods Loss ({timeframeData.damagedQty} units)
              </p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                -{formatCurrency(timeframeData.damagedLoss)}
              </p>
              <ProgressBar value={timeframeData.damagedLoss} max={timeframeData.totalLoss || 1} color="amber" className="mt-2" />
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Expired Goods Loss ({timeframeData.expiredQty} units)
              </p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                -{formatCurrency(timeframeData.expiredLoss)}
              </p>
              <ProgressBar value={timeframeData.expiredLoss} max={timeframeData.totalLoss || 1} color="purple" className="mt-2" />
            </div>

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

          {/* Embedded Dynamic Chart.js Area/Bar Chart */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Performance Velocity Chart ({revenueTimeframe.toUpperCase()})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Chart.js Engine</span>
            </div>
            <div className="h-64 w-full">
              <Line data={timeframeChartData} options={chartOptions} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Inventory Stock Status Doughnut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-500" />
              Stock Quality Reconciliation
            </CardTitle>
            <CardDescription className="text-xs">
              Breakdown of current physical warehouse inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52 w-full">
              <Doughnut
                data={stockConditionData}
                options={{
                  ...chartOptions,
                  cutout: '70%',
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: textColor,
                        font: { size: 10 },
                        boxWidth: 10,
                        usePointStyle: true
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Warehouse Occupancy Bar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-500" />
                Godam Utilization Rate Comparison
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time occupancy percentage by facility
              </CardDescription>
            </div>
            <Button onClick={() => navigate('/warehouses')} variant="ghost" size="sm" className="text-xs">
              View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-52 w-full">
              <Bar
                data={warehouseOccupancyData}
                options={{
                  ...chartOptions,
                  scales: {
                    x: {
                      grid: { color: gridColor },
                      ticks: { color: textColor, font: { size: 10 } }
                    },
                    y: {
                      max: 100,
                      grid: { color: gridColor },
                      ticks: {
                        color: textColor,
                        font: { size: 10 },
                        callback: (v) => `${v}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouses & Facilities List */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warehouses.map((wh) => {
              const occPct = Math.round((wh.occupiedCapacity / wh.totalCapacity) * 100)
              return (
                <div key={wh.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{wh.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{wh.city}, {wh.state}</p>
                    </div>
                    <Badge variant={occPct > 85 ? 'warning' : 'success'}>
                      {occPct}% Full
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Occupancy: {wh.occupiedCapacity.toLocaleString()} units</span>
                      <span>Total: {wh.totalCapacity.toLocaleString()}</span>
                    </div>
                    <ProgressBar
                      value={wh.occupiedCapacity}
                      max={wh.totalCapacity}
                      color={occPct > 85 ? 'rose' : occPct > 70 ? 'amber' : 'emerald'}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardView
