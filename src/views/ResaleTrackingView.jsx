import React, { useState } from 'react'
import {
  TrendingUp,
  MapPin,
  Building2,
  Truck,
  ShoppingBag,
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  Coins,
  ShieldCheck,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Globe,
  Share2,
  Route,
  Store,
  DollarSign
} from 'lucide-react'
import { useResaleStore } from '@/store/useResaleStore'
import { useDataStore } from '@/store/useDataStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { formatCurrency, formatDate } from '@/lib/utils'
import { exportToExcel } from '@/lib/exportUtils'
import { ResaleTraceabilityModal } from '@/components/resale/ResaleTraceabilityModal'
import { ResaleFormModal } from '@/components/resale/ResaleFormModal'

export const ResaleTrackingView = () => {
  const { resales, addResale, updateResale, deleteResale, getTerritoryStats } = useResaleStore()
  const { partners } = useDataStore()

  const [activeTab, setActiveTab] = useState('ledger') // 'ledger' | 'territories'

  // Modals state
  const [selectedResale, setSelectedResale] = useState(null)
  const [isTraceabilityModalOpen, setIsTraceabilityModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingResale, setEditingResale] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [resellerFilter, setResellerFilter] = useState('All')
  const [channelFilter, setChannelFilter] = useState('All')
  const [stateFilter, setStateFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Available unique filter values
  const uniqueStates = ['All', ...new Set(resales.map(r => r.state))]
  const uniqueResellers = ['All', ...new Set(resales.map(r => r.resellerName))]
  const uniqueChannels = ['All', 'Retail Store', 'Sub-Dealer', 'Direct Consumer (B2C)', 'Enterprise / Institutional', 'Contractor / Workshop']

  // Filtered dataset
  const filteredResales = resales.filter((item) => {
    const matchesSearch =
      item.resellerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyerBusinessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.resaleRef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.primaryOrderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumbers?.some(sn => sn.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesReseller = resellerFilter === 'All' || item.resellerName === resellerFilter
    const matchesChannel = channelFilter === 'All' || item.channelType === channelFilter
    const matchesState = stateFilter === 'All' || item.state === stateFilter
    const matchesStatus = statusFilter === 'All' || item.deliveryStatus === statusFilter

    return matchesSearch && matchesReseller && matchesChannel && matchesState && matchesStatus
  })

  // Executive KPI Aggregations
  const totalResaleValue = resales.reduce((acc, r) => acc + (r.totalResaleAmount || 0), 0)
  const totalUnitsResold = resales.reduce((acc, r) => acc + (r.quantity || 0), 0)
  const totalMarginEarned = resales.reduce((acc, r) => acc + (r.totalMarginEarned || 0), 0)
  const avgMarginPercent = resales.length > 0
    ? (resales.reduce((acc, r) => acc + (r.marginPercentage || 0), 0) / resales.length).toFixed(1)
    : 0

  const uniqueCitiesCount = new Set(resales.map(r => r.city)).size
  const uniqueStatesCount = new Set(resales.map(r => r.state)).size
  const territoryStats = getTerritoryStats()

  // Handlers
  const handleOpenTraceability = (resale) => {
    setSelectedResale(resale)
    setIsTraceabilityModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingResale(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (resale) => {
    setEditingResale(resale)
    setIsFormModalOpen(true)
  }

  const handleDelete = (id, ref) => {
    if (confirm(`Are you sure you want to delete downstream resale record "${ref}"?`)) {
      deleteResale(id)
    }
  }

  const handleSaveResale = (payload) => {
    if (editingResale) {
      updateResale(editingResale.id, payload)
    } else {
      addResale(payload)
    }
  }

  // Excel Export Handler
  const handleExportExcel = () => {
    const exportData = filteredResales.map(r => ({
      'Resale Ref': r.resaleRef,
      'Reselling Partner': r.resellerName,
      'Partner Role': r.resellerRole.replace('_', ' '),
      'Originating FillFree Order': r.primaryOrderId,
      'Dispatch Date': r.primaryOrderDate,
      'Inward Lot': r.lotCode,
      'Warehouse': r.warehouseName,
      'Product Name': r.productName,
      'SKU': r.sku,
      'Downstream Buyer': r.buyerName,
      'Buyer Business / Shop': r.buyerBusinessName,
      'Buyer Phone': r.buyerPhone,
      'Buyer GSTIN': r.buyerGstin,
      'Channel Type': r.channelType,
      'Shop / Premise': r.shopPremise,
      'Street Address': r.streetAddress,
      'City': r.city,
      'District': r.district,
      'State': r.state,
      'Pincode': r.pincode,
      'Territory Zone': r.territoryZone,
      'Quantity Resold': r.quantity,
      'Dealer Buy Cost (₹)': r.unitDealerCost,
      'Resale Sell Price (₹)': r.unitResalePrice,
      'Subtotal Resale (₹)': r.subtotalResale,
      '18% GST (₹)': r.taxAmount,
      'Total Resale Amount (₹)': r.totalResaleAmount,
      'Dealer Margin Earned (₹)': r.totalMarginEarned,
      'Dealer Markup (%)': `${r.marginPercentage}%`,
      'Resale Date': r.resaleDate,
      'Consignment Status': r.deliveryStatus,
      'Payment Method': r.paymentMethod,
      'Payment Status': r.paymentStatus,
      'Serial Numbers': r.serialNumbers?.join(', ') || 'N/A',
      'Notes': r.notes || ''
    }))

    exportToExcel(exportData, 'FillFree_Downstream_Resale_Tracking', 'Secondary Resales')
  }

  const getChannelBadgeVariant = (channel) => {
    switch (channel) {
      case 'Retail Store': return 'emerald'
      case 'Sub-Dealer': return 'purple'
      case 'Direct Consumer (B2C)': return 'cyan'
      case 'Enterprise / Institutional': return 'warning'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* TOP HEADER & ACTION BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 text-white">
              <Route className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Downstream Resale Tracking</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold">
                  Channel Secondary Sales
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                End-to-end secondary distribution: Track where, to whom, and at what margins Dealers & Wholesalers resell goods
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 h-9 text-xs border-slate-200 dark:border-slate-800"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Download Excel</span>
          </Button>

          <Button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 h-9 text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Record Resale Entry</span>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXECUTIVE KPI SUMMARY CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Resale Volume */}
        <Card className="relative overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Downstream Resales
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {formatCurrency(totalResaleValue)}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <TrendingUp className="h-3 w-3" />
                Across {resales.length} secondary transactions
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Units Resold Downstream */}
        <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Units Resold Downstream
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalUnitsResold} Units
              </h3>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
                <Store className="h-3 w-3" />
                Dispatched to sub-markets
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Dealer Margin Realized */}
        <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Dealer Margin Realized
              </p>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                +{formatCurrency(totalMarginEarned)}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <Sparkles className="h-3 w-3" />
                Avg +{avgMarginPercent}% markup margin
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Coins className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Geographic Coverage */}
        <Card className="relative overflow-hidden border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Geographic Resale Reach
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {uniqueCitiesCount} Cities
              </h3>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                Across {uniqueStatesCount} Indian States & Zones
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Globe className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* TABS: SECONDARY SALES LEDGER vs TERRITORY HEATMAP */}
      {/* ========================================================================= */}
      <Tabs
        tabs={[
          { id: 'ledger', label: `Secondary Sales Ledger (${resales.length})` },
          { id: 'territories', label: `Territories & Regional Hubs (${territoryStats.length})` }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* ========================================================================= */}
      {/* TAB 1: SECONDARY SALES LEDGER (TABLE VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'ledger' && (
        <Card>
          <CardHeader className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Route className="h-4 w-4 text-indigo-500" />
                  Dealer & Wholesaler Resale Transactions
                </CardTitle>
                <CardDescription className="text-xs">
                  Full lineage trace connecting primary FillFree invoices to downstream retail buyers and destination cities.
                </CardDescription>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Search buyer, city, dealer, serial..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>

            {/* Filter Pills Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              {/* Reseller Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Reseller:</span>
                <select
                  value={resellerFilter}
                  onChange={(e) => setResellerFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  {uniqueResellers.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* State Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400">State:</span>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  {uniqueStates.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Channel Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Channel:</span>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  {uniqueChannels.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Delivered & Verified">Delivered & Verified</option>
                  <option value="In-Transit">In-Transit</option>
                  <option value="Pending Dispatch">Pending Dispatch</option>
                </select>
              </div>

              {(searchQuery || resellerFilter !== 'All' || channelFilter !== 'All' || stateFilter !== 'All' || statusFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setResellerFilter('All')
                    setChannelFilter('All')
                    setStateFilter('All')
                    setStatusFilter('All')
                  }}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline ml-auto font-medium"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 uppercase text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Resale Ref & Date</th>
                    <th className="px-4 py-3">Reselling Partner</th>
                    <th className="px-4 py-3">Originating Primary Sale</th>
                    <th className="px-4 py-3">Product Resold</th>
                    <th className="px-4 py-3">Where Resold (Destination & Buyer)</th>
                    <th className="px-3 py-3 text-center">Channel</th>
                    <th className="px-3 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Resale Price & Margin</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredResales.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-slate-400">
                        No downstream resale transactions match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredResales.map((resale) => (
                      <tr
                        key={resale.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/60 transition-colors"
                      >
                        {/* Ref & Date */}
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {resale.resaleRef}
                          </span>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {resale.resaleDate}
                          </div>
                        </td>

                        {/* Reseller */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {resale.resellerName}
                          </div>
                          <div className="mt-0.5">
                            <Badge variant={resale.resellerRole === 'Dealer' ? 'emerald' : 'purple'} className="text-[10px]">
                              {resale.resellerRole.replace('_', ' ')}
                            </Badge>
                          </div>
                        </td>

                        {/* Primary Order Origin */}
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {resale.primaryOrderId}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                            Lot: {resale.lotCode}
                          </div>
                        </td>

                        {/* Product */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {resale.productName}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            {resale.sku}
                          </div>
                        </td>

                        {/* Where Resold (Destination & Buyer) */}
                        <td className="px-4 py-3 max-w-xs">
                          <div className="font-bold text-slate-900 dark:text-white truncate">
                            {resale.buyerBusinessName || resale.buyerName}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                            <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                            <span className="font-semibold text-rose-600 dark:text-rose-400">{resale.city}</span>, {resale.state}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {resale.streetAddress}
                          </div>
                        </td>

                        {/* Channel */}
                        <td className="px-3 py-3 text-center">
                          <Badge variant={getChannelBadgeVariant(resale.channelType)} className="text-[10px]">
                            {resale.channelType}
                          </Badge>
                        </td>

                        {/* Qty */}
                        <td className="px-3 py-3 text-center font-bold text-slate-800 dark:text-slate-200">
                          {resale.quantity}
                        </td>

                        {/* Resale Price & Margin */}
                        <td className="px-4 py-3 text-right">
                          <div className="font-bold text-slate-900 dark:text-white font-mono">
                            {formatCurrency(resale.totalResaleAmount)}
                          </div>
                          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                            +{formatCurrency(resale.totalMarginEarned)} ({resale.marginPercentage}%)
                          </div>
                        </td>

                        {/* Delivery Status */}
                        <td className="px-3 py-3 text-center">
                          {resale.deliveryStatus === 'Delivered & Verified' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" />
                              Delivered
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <Clock className="h-3 w-3" />
                              {resale.deliveryStatus}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenTraceability(resale)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                              title="Audit Resale Traceability Dossier"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(resale)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                              title="Edit Resale Details"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(resale.id, resale.resaleRef)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                              title="Delete Record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TERRITORIES & REGIONAL HUBS (GEOGRAPHIC BREAKDOWN) */}
      {/* ========================================================================= */}
      {activeTab === 'territories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {territoryStats.map((territory, idx) => (
              <Card
                key={idx}
                className="relative overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {territory.state}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {territory.resalesCount} Resales
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-rose-500" />
                      {territory.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Cities covered: <span className="font-semibold text-slate-700 dark:text-slate-300">{territory.citiesList}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Total Downstream Volume:</span>
                      <span className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">
                        {formatCurrency(territory.totalResaleValue)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Units Delivered:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {territory.totalUnitsResold} Units
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Active Reselling Partners:</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        {territory.dealersList}
                      </p>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Unique Downstream Outlets:</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {territory.uniqueBuyersCount} Registered Buyers & Retailers
                      </p>
                    </div>
                  </CardContent>
                </div>

                <div className="p-3 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStateFilter(territory.state)
                      setActiveTab('ledger')
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold gap-1 h-7"
                  >
                    <span>View Territory Transactions</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TRACEABILITY DOSSIER MODAL */}
      {/* ========================================================================= */}
      <ResaleTraceabilityModal
        isOpen={isTraceabilityModalOpen}
        onClose={() => setIsTraceabilityModalOpen(false)}
        resale={selectedResale}
      />

      {/* ========================================================================= */}
      {/* RESALE CREATE / EDIT FORM MODAL */}
      {/* ========================================================================= */}
      <ResaleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveResale}
        editingResale={editingResale}
      />
    </div>
  )
}
