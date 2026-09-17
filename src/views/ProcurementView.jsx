import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck,
  Plus,
  Lock,
  Search,
  Calendar,
  Building2,
  Receipt,
  FileSpreadsheet,
  IndianRupee,
  Edit,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Package,
  Eye,
  Download
} from 'lucide-react'
import { useBillingStore, generateAutoLotName } from '@/store/useBillingStore'
import { useDataStore } from '@/store/useDataStore'
import { useWarehouseStore } from '@/store/useWarehouseStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { BillDetailsModal } from '@/components/billing/BillDetailsModal'
import { formatCurrency, formatDate } from '@/lib/utils'
import { exportToExcel } from '@/lib/exportUtils'

export const ProcurementView = () => {
  const {
    lotPurchases,
    addLotPurchase,
    updateLotPurchase,
    deleteLotPurchase
  } = useBillingStore()

  const { partners, products } = useDataStore()
  const { warehouses } = useWarehouseStore()

  const [isLotModalOpen, setIsLotModalOpen] = useState(false)
  const [editingLot, setEditingLot] = useState(null)
  const [viewLotBill, setViewLotBill] = useState(null)
  const [lotSearchQuery, setLotSearchQuery] = useState('')

  // New Lot Form State
  const [autoLotName, setAutoLotName] = useState(generateAutoLotName())
  const suppliers = partners.filter(p => p.role === 'Suppliers')
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '')
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-SUP-${Math.floor(1000 + Math.random() * 9000)}`)
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || '')
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '')
  const [purchasedQuantity, setPurchasedQuantity] = useState(200)
  const [purchasedPrice, setPurchasedPrice] = useState(15000)

  const handleOpenAddLot = () => {
    setEditingLot(null)
    setAutoLotName(generateAutoLotName())
    setSupplierId(suppliers[0]?.id || '')
    setInvoiceNumber(`INV-SUP-${Math.floor(1000 + Math.random() * 9000)}`)
    setWarehouseId(warehouses[0]?.id || '')
    setSelectedProductId(products[0]?.id || '')
    setPurchasedQuantity(200)
    setPurchasedPrice(15000)
    setIsLotModalOpen(true)
  }

  const handleOpenEditLot = (lot) => {
    setEditingLot(lot)
    setAutoLotName(lot.lotName)
    setSupplierId(lot.supplierId)
    setInvoiceNumber(lot.invoiceNumber)
    setWarehouseId(lot.warehouseId)
    setPurchasedQuantity(lot.totalItems)
    setPurchasedPrice(lot.items?.[0]?.unitPrice || 15000)
    setSelectedProductId(lot.items?.[0]?.productId || products[0]?.id || '')
    setIsLotModalOpen(true)
  }

  const handleSaveLot = (e) => {
    e.preventDefault()
    const targetSupplier = suppliers.find(s => s.id === supplierId) || suppliers[0]
    const targetWh = warehouses.find(w => w.id === warehouseId) || warehouses[0]
    const targetProd = products.find(p => p.id === selectedProductId) || products[0]

    const subtotal = Number(purchasedQuantity) * Number(purchasedPrice)
    const taxAmount = subtotal * 0.18
    const totalAmount = subtotal + taxAmount

    const lotPayload = {
      supplierId: targetSupplier?.id || 'sup-01',
      supplierName: targetSupplier?.name || 'Authorized Supplier',
      invoiceNumber: invoiceNumber,
      warehouseId: targetWh?.id || 'wh-01',
      warehouseName: targetWh?.name || 'Main Logistics Godam',
      totalItems: Number(purchasedQuantity),
      subtotal: subtotal,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      status: 'In-Stock',
      items: [
        {
          productId: targetProd?.id || 'prod-01',
          productName: targetProd?.name || 'General Stock Item',
          quantity: Number(purchasedQuantity),
          unitPrice: Number(purchasedPrice)
        }
      ]
    }

    if (editingLot) {
      updateLotPurchase(editingLot.lotId, lotPayload)
    } else {
      addLotPurchase(lotPayload)
    }

    setIsLotModalOpen(false)
  }

  const handleDeleteLot = (lotId, lotName) => {
    if (confirm(`Are you sure you want to delete inward Lot Purchase "${lotName}"?`)) {
      deleteLotPurchase(lotId)
    }
  }

  const filteredLots = lotPurchases.filter(lot => {
    const q = lotSearchQuery.toLowerCase()
    return (
      lot.lotName?.toLowerCase().includes(q) ||
      lot.supplierName?.toLowerCase().includes(q) ||
      lot.invoiceNumber?.toLowerCase().includes(q) ||
      lot.warehouseName?.toLowerCase().includes(q)
    )
  })

  // Export to Excel Function
  const handleExportExcel = () => {
    const dataToExport = filteredLots.map((lot, idx) => ({
      'SL No': idx + 1,
      'Lot Code (Locked)': lot.lotName,
      'Supplier Vendor': lot.supplierName,
      'Supplier Invoice No': lot.invoiceNumber,
      'Purchase Date': formatDate(lot.purchaseDate),
      'Destination Godam': lot.warehouseName,
      'Total Units Received': lot.totalItems,
      'Taxable Subtotal (₹)': lot.subtotal,
      '18% Input GST (₹)': lot.taxAmount,
      'Gross Lot Amount (₹)': lot.totalAmount,
      'Operational Status': lot.status
    }))

    exportToExcel(dataToExport, 'fillfree_inward_procurement_lots', 'Inward Lots')
  }

  // Aggregate Metrics
  const totalProcurementValue = lotPurchases.reduce((acc, l) => acc + (l.totalAmount || 0), 0)
  const totalLotsReceived = lotPurchases.length
  const totalItemsInwarded = lotPurchases.reduce((acc, l) => acc + (l.totalItems || 0), 0)

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-indigo-600 shadow-md shadow-indigo-500/20">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Inward Lot Procurement
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supplier purchase orders, inward consignment tracking, 18% GST calculation & Goods Receipt Notes (GRN)
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Link to Billing */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Download Excel */}
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="gap-1.5 text-xs h-9 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            title="Download Procurement Lots in Excel Format (.xlsx)"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Download Excel</span>
          </Button>

          <Link
            to="/billing"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Receipt className="h-3.5 w-3.5 text-indigo-500" />
            <span>Sales Invoicing</span>
            <ArrowRight className="h-3 w-3 text-slate-400" />
          </Link>

          <Button onClick={handleOpenAddLot} className="gap-1.5 text-xs h-9">
            <Plus className="h-3.5 w-3.5" />
            Receive Inward Lot
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Procurement Value</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {formatCurrency(totalProcurementValue)}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Inclusive of 18% GST input credits</p>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <IndianRupee className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Inward Lots Logged</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {totalLotsReceived} Lots
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Auto-generated lot codes locked</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Truck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Units Stocked</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {totalItemsInwarded.toLocaleString()} Units
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Allocated across active godams</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Package className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lot Purchases Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-indigo-500" />
              Inward Purchase Lots Registry
            </CardTitle>
            <CardDescription className="text-xs">
              Every inward shipment receives a system locked Lot ID adhering to rule standard LOT-YYYYMM-XXXX
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search Lot, Supplier, Invoice..."
              value={lotSearchQuery}
              onChange={(e) => setLotSearchQuery(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 uppercase text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Lot Identifier</th>
                  <th className="px-5 py-3">Supplier Vendor</th>
                  <th className="px-5 py-3">Invoice & Date</th>
                  <th className="px-5 py-3">Godam Destination</th>
                  <th className="px-5 py-3 text-right">Items / Qty</th>
                  <th className="px-5 py-3 text-right">Subtotal</th>
                  <th className="px-5 py-3 text-right">18% GST</th>
                  <th className="px-5 py-3 text-right">Gross Total</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLots.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-10 text-slate-400">
                      No inward procurement lots found.
                    </td>
                  </tr>
                ) : (
                  filteredLots.map((lot) => (
                    <tr key={lot.lotId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <Lock className="h-3 w-3 text-slate-400 shrink-0" title="System Locked Lot Identifier" />
                        <span>{lot.lotName}</span>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{lot.supplierName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{lot.supplierId}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-mono text-slate-700 dark:text-slate-300">{lot.invoiceNumber}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="h-2.5 w-2.5" />
                          {formatDate(lot.purchaseDate)}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                          <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                          {lot.warehouseName}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-medium">
                        {lot.totalItems?.toLocaleString()} pcs
                      </td>
                      <td className="px-5 py-3 text-right font-mono">
                        {formatCurrency(lot.subtotal)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-amber-600 dark:text-amber-400">
                        +{formatCurrency(lot.taxAmount)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(lot.totalAmount)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                          {lot.status || 'In-Stock'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Real Purchase Bill / GRN */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewLotBill(lot)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            title="View Purchase Bill / GRN"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {/* Download PDF */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewLotBill(lot)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                            title="Download Bill PDF"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditLot(lot)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            title="Edit Lot Details"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLot(lot.lotId, lot.lotName)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Delete Lot"
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

      {/* Receive / Edit Lot Modal */}
      <Modal
        isOpen={isLotModalOpen}
        onClose={() => setIsLotModalOpen(false)}
        title={editingLot ? `Edit Inward Lot: ${editingLot.lotName}` : 'Receive Inward Consignment Lot'}
      >
        <form onSubmit={handleSaveLot} className="space-y-4">
          {/* Locked Lot Name Field */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Lot Identifier (Locked System Generated)
            </label>
            <div className="relative">
              <Input
                value={autoLotName}
                readOnly
                disabled
                className="bg-slate-100 dark:bg-slate-900 cursor-not-allowed font-mono text-indigo-600 dark:text-indigo-400 font-bold pr-8"
              />
              <Lock className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Rule: Auto-generated on inward creation and permanently locked.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Supplier Vendor *
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Supplier Invoice Number *
              </label>
              <Input
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. INV-APEX-9921"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Receiving Godam / Warehouse *
              </label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Stock Catalog Product
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Inward Units Quantity *
              </label>
              <Input
                type="number"
                min="1"
                required
                value={purchasedQuantity}
                onChange={(e) => setPurchasedQuantity(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unit Purchase Price (₹) *
              </label>
              <Input
                type="number"
                min="1"
                required
                value={purchasedPrice}
                onChange={(e) => setPurchasedPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Real-time Calculation Summary Box */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {formatCurrency(Number(purchasedQuantity) * Number(purchasedPrice))}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Standard 18% GST:</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">
                +{formatCurrency(Number(purchasedQuantity) * Number(purchasedPrice) * 0.18)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-800">
              <span>Gross Payable Total:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 text-sm">
                {formatCurrency(Number(purchasedQuantity) * Number(purchasedPrice) * 1.18)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsLotModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingLot ? 'Save Changes' : 'Confirm Inward Stock'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Real Inward Purchase Bill / GRN Modal & PDF Downloader */}
      <BillDetailsModal
        isOpen={!!viewLotBill}
        onClose={() => setViewLotBill(null)}
        bill={viewLotBill}
        type="purchase"
      />
    </div>
  )
}
export default ProcurementView
