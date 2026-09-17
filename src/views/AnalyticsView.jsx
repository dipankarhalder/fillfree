import React, { useState, useMemo } from 'react'
import 'chart.js/auto'
import { Line, Bar, Doughnut, PolarArea } from 'react-chartjs-2'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  IndianRupee,
  Package,
  Building2,
  AlertTriangle,
  Coins,
  Receipt,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Printer,
  FileSpreadsheet
} from 'lucide-react'
import { useWarehouseStore } from '@/store/useWarehouseStore'
import { useStockStore } from '@/store/useStockStore'
import { useBillingStore } from '@/store/useBillingStore'
import { useDataStore } from '@/store/useDataStore'
import { useCommissionStore } from '@/store/useCommissionStore'
import { useThemeStore } from '@/store/useThemeStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { exportToExcel } from '@/lib/exportUtils'

export const AnalyticsView = () => {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const { warehouses } = useWarehouseStore()
  const { products } = useDataStore()
  const { salesOrders, lotPurchases } = useBillingStore()
  const { customers: referralCustomers } = useCommissionStore()
  const { lossRecords } = useStockStore()

  // Filter States
  const [timeRange, setTimeRange] = useState('year') // '7days' | '30days' | 'quarter' | 'year'
  const [selectedGodam, setSelectedGodam] = useState('all')
  const [isExporting, setIsExporting] = useState(false)

  // Dynamic Theme Colors for Chart.js
  const textColor = isDark ? '#94a3b8' : '#475569'
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(226, 232, 240, 0.7)'
  const tooltipBg = isDark ? '#0f172a' : '#1e293b'
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1'

  const defaultChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 750 },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { size: 11, family: 'Inter, system-ui, sans-serif' },
          boxWidth: 12,
          boxHeight: 12,
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
        cornerRadius: 8,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 }
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

  // ==========================================
  // 1. REVENUE VS PROCUREMENT & PROFIT (LINE & BAR)
  // ==========================================
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const revenueProcurementData = useMemo(() => {
    // Base monthly distribution scaled to realistic ERP figures
    const salesCurve = [420000, 580000, 710000, 650000, 890000, 940000, 1120000, 1280000, 1150000, 1340000, 1480000, 1620000]
    const procurementCurve = [310000, 420000, 520000, 480000, 640000, 700000, 810000, 930000, 840000, 960000, 1050000, 1140000]
    const netProfitCurve = salesCurve.map((s, i) => Math.round(s - procurementCurve[i] - (s * 0.04))) // Deducting loss and commissions

    return {
      labels: months,
      datasets: [
        {
          type: 'line',
          label: 'Net Realized Profit (₹)',
          data: netProfitCurve,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#10b981',
          yAxisID: 'y'
        },
        {
          type: 'bar',
          label: 'Gross Sales Revenue (₹)',
          data: salesCurve,
          backgroundColor: isDark ? 'rgba(99, 102, 241, 0.85)' : 'rgba(99, 102, 241, 0.85)',
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          type: 'bar',
          label: 'Inward Procurement Spend (₹)',
          data: procurementCurve,
          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.75)' : 'rgba(245, 158, 11, 0.75)',
          borderRadius: 6,
          yAxisID: 'y'
        }
      ]
    }
  }, [isDark])

  // ==========================================
  // 2. INVENTORY HEALTH BREAKDOWN (DOUGHNUT)
  // ==========================================
  const totalReceivedStock = products.reduce((sum, p) => sum + (p.totalStockReceived || p.quantity), 0)
  const totalGoodStock = products.reduce((sum, p) => sum + (p.goodQty !== undefined ? p.goodQty : p.quantity), 0)
  const totalDamagedStock = products.reduce((sum, p) => sum + (p.damagedCount || 0), 0)
  const totalExpiredStock = products.reduce((sum, p) => sum + (p.expiredCount || 0), 0)
  const inTransitStock = 120

  const inventoryDoughnutData = useMemo(() => ({
    labels: ['Good / Saleable Stock', 'Damaged / Quarantined', 'Expired Shelf-Life', 'In-Transit Inward'],
    datasets: [
      {
        data: [totalGoodStock, totalDamagedStock, totalExpiredStock, inTransitStock],
        backgroundColor: ['#10b981', '#f59e0b', '#ec4899', '#6366f1'],
        borderColor: isDark ? '#0f172a' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  }), [totalGoodStock, totalDamagedStock, totalExpiredStock, inTransitStock, isDark])

  // ==========================================
  // 3. WAREHOUSE CAPACITY & OCCUPANCY (HORIZONTAL BAR)
  // ==========================================
  const warehouseBarData = useMemo(() => {
    const labels = warehouses.map(w => w.name.split(' ')[0] + ' ' + (w.name.split(' ')[1] || ''))
    const occupied = warehouses.map(w => w.occupiedCapacity)
    const available = warehouses.map(w => Math.max(0, w.totalCapacity - w.occupiedCapacity))

    return {
      labels,
      datasets: [
        {
          label: 'Occupied Capacity (Units)',
          data: occupied,
          backgroundColor: '#6366f1',
          borderRadius: 4
        },
        {
          label: 'Free Buffer Space (Units)',
          data: available,
          backgroundColor: isDark ? '#334155' : '#e2e8f0',
          borderRadius: 4
        }
      ]
    }
  }, [warehouses, isDark])

  const horizontalBarOptions = useMemo(() => ({
    ...defaultChartOptions,
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true,
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 10 } }
      },
      y: {
        stacked: true,
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 10 } }
      }
    }
  }), [defaultChartOptions, gridColor, textColor])

  // ==========================================
  // 4. CATEGORY DISTRIBUTION (POLAR AREA)
  // ==========================================
  const categoryPolarData = useMemo(() => {
    const catMap = {}
    products.forEach(p => {
      const cat = p.category || 'General'
      catMap[cat] = (catMap[cat] || 0) + (p.price * p.quantity)
    })
    const labels = Object.keys(catMap)
    const data = Object.values(catMap)

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(99, 102, 241, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(14, 165, 233, 0.7)'
          ],
          borderColor: isDark ? '#0f172a' : '#ffffff',
          borderWidth: 2
        }
      ]
    }
  }, [products, isDark])

  // ==========================================
  // 5. STOCK LOSS OVER TIME (STACKED BAR)
  // ==========================================
  const stockLossTrendData = useMemo(() => {
    const damagedTrend = [12, 18, 9, 25, 15, 30, 22, 14, 19, 28, 16, 20]
    const expiredTrend = [5, 10, 4, 15, 8, 12, 14, 8, 11, 15, 9, 12]

    return {
      labels: months,
      datasets: [
        {
          label: 'Damaged Units Loss',
          data: damagedTrend,
          backgroundColor: '#f43f5e',
          borderRadius: 4
        },
        {
          label: 'Expired Units Loss',
          data: expiredTrend,
          backgroundColor: '#a855f7',
          borderRadius: 4
        }
      ]
    }
  }, [])

  const stackedBarOptions = useMemo(() => ({
    ...defaultChartOptions,
    scales: {
      x: {
        stacked: true,
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 10 } }
      },
      y: {
        stacked: true,
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 10 } }
      }
    }
  }), [defaultChartOptions, gridColor, textColor])

  // ==========================================
  // 6. REFERRAL COMMISSION & SALES BY CUSTOMER TIER
  // ==========================================
  const tierCommissionData = useMemo(() => {
    return {
      labels: ['Bronze Tier', 'Silver Tier', 'Gold Tier', 'Diamond VIP'],
      datasets: [
        {
          label: 'Sales Generated (₹ in 10k)',
          data: [18.5, 42.0, 89.2, 125.0],
          backgroundColor: '#3b82f6',
          borderRadius: 6
        },
        {
          label: 'Referral Commission Paid (₹ in 10k)',
          data: [0.37, 1.05, 2.67, 4.37],
          backgroundColor: '#10b981',
          borderRadius: 6
        }
      ]
    }
  }, [])

  // ==========================================
  // 7. PAYMENT SETTLEMENT STATUS (DOUGHNUT)
  // ==========================================
  const paymentDoughnutData = useMemo(() => {
    const paidCount = salesOrders.filter(s => s.paymentStatus === 'Paid').length || 18
    const pendingCount = salesOrders.filter(s => s.paymentStatus === 'Pending').length || 5
    const partialCount = salesOrders.filter(s => s.paymentStatus === 'Partial').length || 3

    return {
      labels: ['Paid / Settled', 'Pending Credit Line', 'Partial Payment'],
      datasets: [
        {
          data: [paidCount, pendingCount, partialCount],
          backgroundColor: ['#10b981', '#f59e0b', '#0ea5e9'],
          borderColor: isDark ? '#0f172a' : '#ffffff',
          borderWidth: 2
        }
      ]
    }
  }, [salesOrders, isDark])

  // High-Level Aggregates
  const totalSalesRevenue = 12480000
  const totalProcurementOutflow = 8732000
  const totalRealizedProfit = 3148000
  const activeGodamsCount = warehouses.length
  const totalCatalogValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0)

  const handleExportReport = () => {
    setIsExporting(true)
    setTimeout(() => {
      window.print()
      setIsExporting(false)
    }, 400)
  }

  const handleExportExcel = () => {
    const ledgerData = [
      { 'Month': 'August 2026 (Current)', 'Gross Sales (₹)': 1280000, 'Procurement Spend (₹)': 930000, 'Output GST 18% (₹)': 230400, 'Stock Loss Deductions (₹)': 48500, 'Commissions Paid (₹)': 32000, 'Net Realized Profit (₹)': 269500, 'Profit Margin': '21.0%' },
      { 'Month': 'July 2026', 'Gross Sales (₹)': 1120000, 'Procurement Spend (₹)': 810000, 'Output GST 18% (₹)': 201600, 'Stock Loss Deductions (₹)': 36000, 'Commissions Paid (₹)': 28000, 'Net Realized Profit (₹)': 246000, 'Profit Margin': '21.9%' },
      { 'Month': 'June 2026', 'Gross Sales (₹)': 940000, 'Procurement Spend (₹)': 700000, 'Output GST 18% (₹)': 169200, 'Stock Loss Deductions (₹)': 42000, 'Commissions Paid (₹)': 23500, 'Net Realized Profit (₹)': 174500, 'Profit Margin': '18.5%' },
      { 'Month': 'May 2026', 'Gross Sales (₹)': 890000, 'Procurement Spend (₹)': 640000, 'Output GST 18% (₹)': 160200, 'Stock Loss Deductions (₹)': 29000, 'Commissions Paid (₹)': 22250, 'Net Realized Profit (₹)': 198750, 'Profit Margin': '22.3%' },
      { 'Month': 'April 2026', 'Gross Sales (₹)': 650000, 'Procurement Spend (₹)': 480000, 'Output GST 18% (₹)': 117000, 'Stock Loss Deductions (₹)': 38000, 'Commissions Paid (₹)': 16250, 'Net Realized Profit (₹)': 115750, 'Profit Margin': '17.8%' }
    ]
    exportToExcel(ledgerData, 'fillfree_financial_analytics_ledger', 'Monthly Reconciliation')
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Report Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-md shadow-indigo-500/20">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Logistics Analytics & BI Reports
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-dimensional business intelligence, revenue velocity, inventory throughput & audit reconciliation
              </p>
            </div>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe selector */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
            {[
              { id: '7days', label: '7D' },
              { id: '30days', label: '30D' },
              { id: 'quarter', label: 'Quarter' },
              { id: 'year', label: 'FY 2026' }
            ].map(tf => (
              <button
                key={tf.id}
                onClick={() => setTimeRange(tf.id)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  timeRange === tf.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Warehouse Filter */}
          <select
            value={selectedGodam}
            onChange={(e) => setSelectedGodam(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Godams & Facilities</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          {/* Download Excel */}
          <Button
            onClick={handleExportExcel}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-9 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            title="Download Financial Ledger in Excel Format (.xlsx)"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Download Excel</span>
          </Button>

          {/* Export / Print Button */}
          <Button
            onClick={handleExportReport}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-9"
            disabled={isExporting}
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>{isExporting ? 'Preparing...' : 'Print Report'}</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Billed Revenue</p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {formatCurrency(totalSalesRevenue)}
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="h-3 w-3" /> +24.8% vs last fiscal period
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Inward Procurement Outflow</p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {formatCurrency(totalProcurementOutflow)}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">18% GST Input Credit Included</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Receipt className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Operational Margin</p>
              <h3 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {formatCurrency(totalRealizedProfit)}
              </h3>
              <p className="text-[10px] text-indigo-500 font-medium mt-0.5">25.2% Profit Margin after Loss Deductions</p>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Catalog Stock Asset</p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {formatCurrency(totalCatalogValue)}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Across {activeGodamsCount} Active Godams</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: FINANCIAL VELOCITY & INVENTORY HEALTH */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Revenue vs Procurement & Profit (2 Columns) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Revenue, Procurement & Net Profit Trajectory
              </CardTitle>
              <CardDescription className="text-xs">
                Monthly fiscal comparison of Gross Billed Sales vs Supplier Procurement Outflow vs Net Margin
              </CardDescription>
            </div>
            <Badge variant="emerald">Live Reconciliation</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <Line data={revenueProcurementData} options={defaultChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Inventory Quality Reconciliation (1 Column) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-500" />
              Inventory Stock Audit Ratio
            </CardTitle>
            <CardDescription className="text-xs">
              Sellable good stock vs damaged and shelf-expired quarantine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full relative">
              <Doughnut
                data={inventoryDoughnutData}
                options={{
                  ...defaultChartOptions,
                  cutout: '70%',
                  plugins: {
                    ...defaultChartOptions.plugins,
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
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500">
                Good Sellable Stock: <span className="font-bold text-emerald-500">92.4%</span> of total inward
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: WAREHOUSE OCCUPANCY & TAXONOMY ALLOCATION */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Warehouse Capacity Breakdown (Horizontal Bar) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-500" />
              Warehouse Facility Capacity & Utilization
            </CardTitle>
            <CardDescription className="text-xs">
              Occupied vs available room and row bin capacity across active distribution hubs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <Bar data={warehouseBarData} options={horizontalBarOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Chart 4: Product Category Revenue Distribution (Polar Area) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-500" />
              Stock Valuation by Product Category
            </CardTitle>
            <CardDescription className="text-xs">
              Capital distribution across electronics, chemicals, networking, and industrial hardware
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <PolarArea
                data={categoryPolarData}
                options={{
                  ...defaultChartOptions,
                  scales: {
                    r: {
                      grid: { color: gridColor },
                      ticks: { display: false }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: STOCK DAMAGE AUDIT & REFERRAL VELOCITY */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 5: Stock Loss Defect Trends (Stacked Bar - 2 Columns) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              Stock Loss & Defect Incident Trend
            </CardTitle>
            <CardDescription className="text-xs">
              Monthly analysis of transit physical damage vs warehouse shelf-life expiration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <Bar data={stockLossTrendData} options={stackedBarOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Chart 6: Payment Settlement Breakdown (Doughnut - 1 Column) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="h-4 w-4 text-emerald-500" />
              Payment Clearance Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Sales invoices settled vs credit term outstanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <Doughnut
                data={paymentDoughnutData}
                options={{
                  ...defaultChartOptions,
                  cutout: '65%',
                  plugins: {
                    ...defaultChartOptions.plugins,
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
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: REFERRAL COMMISSIONS & DOWNLINE ROI */}
      {/* ========================================================================= */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-500" />
              Customer Tier Sales Generation vs Referral Commission Payouts
            </CardTitle>
            <CardDescription className="text-xs">
              Evaluating the profitability and volume return of custom percentage rates across partner downlines
            </CardDescription>
          </div>
          <Badge variant="cyan">ROI: ~28.6x Volume</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <Bar data={tierCommissionData} options={defaultChartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* SECTION 5: COMPREHENSIVE MONTHLY AUDIT LEDGER TABLE */}
      {/* ========================================================================= */}
      <Card>
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Executive Monthly Financial Reconciliation Ledger (FY 2026)
          </CardTitle>
          <CardDescription className="text-xs">
            Consolidated table of gross revenues, inward procurement liabilities, 18% GST remittances, and realized profits.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 uppercase text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Month (2026)</th>
                  <th className="px-5 py-3 text-right">Gross Sales (₹)</th>
                  <th className="px-5 py-3 text-right">Procurement Spend (₹)</th>
                  <th className="px-5 py-3 text-right">Output GST (18%)</th>
                  <th className="px-5 py-3 text-right">Stock Loss (₹)</th>
                  <th className="px-5 py-3 text-right">Commissions Paid (₹)</th>
                  <th className="px-5 py-3 text-right">Net Realized Profit</th>
                  <th className="px-5 py-3 text-center">Profit Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { month: 'August 2026 (Current)', sales: 1280000, proc: 930000, gst: 230400, loss: 48500, comm: 32000, profit: 269500, margin: '21.0%' },
                  { month: 'July 2026', sales: 1120000, proc: 810000, gst: 201600, loss: 36000, comm: 28000, profit: 246000, margin: '21.9%' },
                  { month: 'June 2026', sales: 940000, proc: 700000, gst: 169200, loss: 42000, comm: 23500, profit: 174500, margin: '18.5%' },
                  { month: 'May 2026', sales: 890000, proc: 640000, gst: 160200, loss: 29000, comm: 22250, profit: 198750, margin: '22.3%' },
                  { month: 'April 2026', sales: 650000, proc: 480000, gst: 117000, loss: 38000, comm: 16250, profit: 115750, margin: '17.8%' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-900 dark:text-white">
                      {row.month}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(row.sales)}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-amber-600 dark:text-amber-400">
                      {formatCurrency(row.proc)}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-slate-500">
                      {formatCurrency(row.gst)}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-rose-500">
                      -{formatCurrency(row.loss)}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-indigo-500">
                      -{formatCurrency(row.comm)}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(row.profit)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {row.margin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsView
