import React, { useState } from 'react'
import {
  AlertTriangle,
  Flame,
  CheckCircle2,
  Plus,
  IndianRupee,
  FileText,
  Calendar,
  Building2,
  Tag,
  Clock,
  Filter,
  Edit,
  Trash2,
  Calculator,
  TrendingUp,
  PackageCheck,
  Package,
  XCircle
} from 'lucide-react'
import { useStockStore } from '@/store/useStockStore'
import { useDataStore } from '@/store/useDataStore'
import { useWarehouseStore } from '@/store/useWarehouseStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatCurrency, formatDate } from '@/lib/utils'

export const StockLossView = () => {
  const { lossRecords, tagStockDamageOrExpiry, updateLossRecord, deleteLossRecord, getLossAnalytics } = useStockStore()
  const { products } = useDataStore()
  const { warehouses } = useWarehouseStore()

  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [filterType, setFilterType] = useState('All')

  // Form state
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '')
  const [lossType, setLossType] = useState('Damaged')
  const [quantity, setQuantity] = useState(3)
  const [reason, setReason] = useState('')
  const [reportedBy, setReportedBy] = useState('Warehouse Inspector')

  const lossAnalytics = getLossAnalytics()
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0]

  // Dynamic live calculations from product catalog
  const totalReceivedStock = products.reduce((sum, p) => sum + (p.totalStockReceived || p.quantity), 0)
  const totalGoodStock = products.reduce((sum, p) => sum + (p.goodQty !== undefined ? p.goodQty : p.quantity), 0)
  const totalDamagedStock = products.reduce((sum, p) => sum + (p.damagedCount || 0), 0)
  const totalExpiredStock = products.reduce((sum, p) => sum + (p.expiredCount || 0), 0)

  const handleOpenAdd = () => {
    setEditingRecord(null)
    setSelectedProductId(products[0]?.id || '')
    setLossType('Damaged')
    setQuantity(3)
    setReason('')
    setReportedBy('Warehouse Inspector')
    setIsTagModalOpen(true)
  }

  const handleOpenEdit = (record) => {
    setEditingRecord(record)
    setSelectedProductId(record.productId || products[0]?.id)
    setLossType(record.type)
    setQuantity(record.quantity)
    setReason(record.reason)
    setReportedBy(record.reportedBy)
    setIsTagModalOpen(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!selectedProduct) return

    if (editingRecord) {
      updateLossRecord(editingRecord.id, {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        sku: selectedProduct.sku,
        type: lossType,
        quantity: Number(quantity),
        unitCost: selectedProduct.price,
        reason,
        reportedBy
      })
    } else {
      tagStockDamageOrExpiry({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        sku: selectedProduct.sku,
        type: lossType,
        quantity: Number(quantity),
        unitCost: selectedProduct.price,
        warehouseId: selectedProduct.warehouseId,
        warehouseName: selectedProduct.warehouseName,
        roomName: selectedProduct.roomName,
        rowName: selectedProduct.rowName,
        shelfName: selectedProduct.shelfName,
        reason,
        reportedBy
      })
    }

    setIsTagModalOpen(false)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to resolve and delete this stock loss record?')) {
      deleteLossRecord(id)
    }
  }

  const filteredRecords = lossRecords.filter(r => {
    if (filterType === 'All') return true
    return r.type === filterType
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Stock & Damage/Expiry Management</h1>
            <Badge variant="destructive">Loss Billing Ledger</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time tracking of damaged and expired products with weekly, monthly, and yearly revenue impact calculations.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="destructive">
          <Plus className="h-4 w-4 mr-1.5" />
          Tag Damaged or Expired Stock
        </Button>
      </div>

      {/* Dynamic Live Inventory Stock Reconciliation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Stock Received</p>
            <Package className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">{totalReceivedStock.toLocaleString()} units</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">All catalog inventory</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Good & Saleable Stock</p>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">{totalGoodStock.toLocaleString()} units</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Ready for sale</p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Damaged Stock</p>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2 font-mono">{totalDamagedStock.toLocaleString()} units</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Damaged during transit/handling</p>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">Expired Stock</p>
            <XCircle className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2 font-mono">{totalExpiredStock.toLocaleString()} units</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Exceeded shelf-life limit</p>
        </div>
      </div>

      {/* Financial Revenue & Loss Impact Overview (Weekly, Monthly, Yearly) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
            <Badge variant="cyan">Weekly (7 Days)</Badge>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Weekly Revenue & Loss
            </CardTitle>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Net: {formatCurrency(lossAnalytics.weekly.netRevenue)}
            </div>
            <CardDescription>
              Gross Revenue: {formatCurrency(lossAnalytics.weekly.grossSalesRevenue)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-amber-600 dark:text-amber-400">Damaged ({lossAnalytics.weekly.damagedQty} units):</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">-{formatCurrency(lossAnalytics.weekly.damagedLoss)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-600 dark:text-purple-400">Expired ({lossAnalytics.weekly.expiredQty} units):</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">-{formatCurrency(lossAnalytics.weekly.expiredLoss)}</span>
            </div>
            <ProgressBar value={lossAnalytics.weekly.totalLoss} max={lossAnalytics.weekly.grossSalesRevenue || 1} color="rose" />
          </CardContent>
        </Card>

        {/* Monthly */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
            <Badge variant="warning">Monthly (30 Days)</Badge>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Monthly Revenue & Loss
            </CardTitle>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              Net: {formatCurrency(lossAnalytics.monthly.netRevenue)}
            </div>
            <CardDescription>
              Gross Revenue: {formatCurrency(lossAnalytics.monthly.grossSalesRevenue)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-amber-600 dark:text-amber-400">Damaged ({lossAnalytics.monthly.damagedQty} units):</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">-{formatCurrency(lossAnalytics.monthly.damagedLoss)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-600 dark:text-purple-400">Expired ({lossAnalytics.monthly.expiredQty} units):</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">-{formatCurrency(lossAnalytics.monthly.expiredLoss)}</span>
            </div>
            <ProgressBar value={lossAnalytics.monthly.totalLoss} max={lossAnalytics.monthly.grossSalesRevenue || 1} color="amber" />
          </CardContent>
        </Card>

        {/* Yearly */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
            <Badge variant="destructive">Yearly (2026)</Badge>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Yearly Revenue & Loss
            </CardTitle>
            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
              Net: {formatCurrency(lossAnalytics.yearly.netRevenue)}
            </div>
            <CardDescription>
              Gross Revenue: {formatCurrency(lossAnalytics.yearly.grossSalesRevenue)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-amber-600 dark:text-amber-400">Damaged ({lossAnalytics.yearly.damagedQty} units):</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">-{formatCurrency(lossAnalytics.yearly.damagedLoss)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-600 dark:text-purple-400">Expired ({lossAnalytics.yearly.expiredQty} units):</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">-{formatCurrency(lossAnalytics.yearly.expiredLoss)}</span>
            </div>
            <ProgressBar value={lossAnalytics.yearly.totalLoss} max={lossAnalytics.yearly.grossSalesRevenue || 1} color="rose" />
          </CardContent>
        </Card>
      </div>

      {/* Loss Ledger Table */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Separate Loss Billing & Audit Ledger</CardTitle>
            <CardDescription>Itemized audit trail of all tagged damages and expirations</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </span>
            {['All', 'Damaged', 'Expired'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-950 uppercase text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Incident ID & Date</th>
                  <th className="px-4 py-3">Product & SKU</th>
                  <th className="px-4 py-3">Tag Type</th>
                  <th className="px-4 py-3">Qty & Unit Price</th>
                  <th className="px-4 py-3">Total Financial Loss</th>
                  <th className="px-4 py-3">Warehouse & Location</th>
                  <th className="px-4 py-3">Audit Reason</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{r.id}</span>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {formatDate(r.date)}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        <div>{r.productName}</div>
                        <span className="font-mono text-[10px] text-slate-400">{r.sku}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={r.type === 'Damaged' ? 'warning' : 'purple'}>
                          {r.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{r.quantity} units</span>
                        <div className="text-[10px] text-slate-400">@ {formatCurrency(r.unitCost)} / unit</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-rose-600 dark:text-rose-400 font-mono text-sm">
                        {formatCurrency(r.totalLoss)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-900 dark:text-slate-200 font-semibold">{r.warehouseName}</div>
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-300 font-mono">
                          {r.roomName} • {r.rowName} ({r.shelfName})
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-xs">
                        <p className="line-clamp-2">{r.reason}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">By: {r.reportedBy}</span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Loss Record"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Resolve & Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                      No stock damage or expiry records found for filter: {filterType}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Loss Modal */}
      <Modal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        title={editingRecord ? 'Edit Stock Loss Incident' : 'Tag Stock as Damaged or Expired'}
        description="Register stock loss to calculate financial impact and update separate loss billing."
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Product Item
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — Stock: {p.quantity} units — Warehouse: {p.warehouseName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Tag Category
              </label>
              <select
                value={lossType}
                onChange={(e) => setLossType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Damaged">Damaged Goods</option>
                <option value="Expired">Expired Goods</option>
              </select>
            </div>

            <Input
              label="Affected Quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          {selectedProduct && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs space-y-1">
              <p className="text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px]">Financial Loss Impact Calculation</p>
              <div className="flex justify-between font-mono">
                <span className="text-slate-700 dark:text-slate-300">{quantity} units x {formatCurrency(selectedProduct.price)}</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{formatCurrency(quantity * selectedProduct.price)}</span>
              </div>
            </div>
          )}

          <Input
            label="Audit / Incident Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Water damage during transport / Exceeded shelf life threshold"
            required
          />

          <Input
            label="Reported By (Inspector Name)"
            value={reportedBy}
            onChange={(e) => setReportedBy(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsTagModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              {editingRecord ? 'Update Loss Record' : 'Register Loss Incident'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
