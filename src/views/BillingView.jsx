import React, { useState } from 'react'
import {
  Receipt,
  Layers,
  ShoppingBag,
  Plus,
  Lock,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  Ticket,
  Printer,
  FileSpreadsheet,
  IndianRupee,
  Edit,
  Trash2
} from 'lucide-react'
import { useBillingStore, generateAutoLotName } from '@/store/useBillingStore'
import { useDataStore } from '@/store/useDataStore'
import { useWarehouseStore } from '@/store/useWarehouseStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency, formatDate } from '@/lib/utils'

export const BillingView = () => {
  const {
    lotPurchases,
    salesOrders,
    addLotPurchase,
    updateLotPurchase,
    deleteLotPurchase,
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder
  } = useBillingStore()

  const { partners, products, coupons } = useDataStore()
  const { warehouses } = useWarehouseStore()

  const [activeTab, setActiveTab] = useState('lot-purchases')
  const [isLotModalOpen, setIsLotModalOpen] = useState(false)
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [editingLot, setEditingLot] = useState(null)
  const [editingSale, setEditingSale] = useState(null)

  // New Lot Form State
  const [autoLotName, setAutoLotName] = useState(generateAutoLotName())
  const [supplierId, setSupplierId] = useState(partners.find(p => p.role === 'Suppliers')?.id || '')
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-SUP-${Math.floor(1000 + Math.random() * 9000)}`)
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || '')
  const [purchasedQuantity, setPurchasedQuantity] = useState(200)
  const [purchasedPrice, setPurchasedPrice] = useState(15000)

  // New Sale Form State
  const [customerId, setCustomerId] = useState(partners[0]?.id || '')
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '')
  const [saleQty, setSaleQty] = useState(5)
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('Paid')

  const suppliers = partners.filter(p => p.role === 'Suppliers')
  const customers = partners.filter(p => p.role !== 'Suppliers')
  const selectedSaleProd = products.find(p => p.id === selectedProdId) || products[0]

  const handleOpenAddLot = () => {
    setEditingLot(null)
    setAutoLotName(generateAutoLotName())
    setSupplierId(suppliers[0]?.id || '')
    setInvoiceNumber(`INV-SUP-${Math.floor(1000 + Math.random() * 9000)}`)
    setWarehouseId(warehouses[0]?.id || '')
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
    setPurchasedPrice(lot.items[0]?.unitPrice || 15000)
    setIsLotModalOpen(true)
  }

  const handleSaveLot = (e) => {
    e.preventDefault()
    const targetSupplier = suppliers.find(s => s.id === supplierId) || suppliers[0]
    const targetWh = warehouses.find(w => w.id === warehouseId) || warehouses[0]

    const subtotal = Number(purchasedQuantity) * Number(purchasedPrice)
    const taxAmount = subtotal * 0.18

    if (editingLot) {
      updateLotPurchase(editingLot.lotId, {
        supplierId: targetSupplier.id,
        supplierName: targetSupplier.businessName,
        invoiceNumber,
        warehouseId: targetWh.id,
        warehouseName: targetWh.name,
        totalItems: Number(purchasedQuantity),
        subtotal,
        taxAmount,
        totalAmount: subtotal + taxAmount
      })
    } else {
      addLotPurchase({
        supplierId: targetSupplier.id,
        supplierName: targetSupplier.businessName,
        invoiceNumber,
        warehouseId: targetWh.id,
        warehouseName: targetWh.name,
        totalItems: Number(purchasedQuantity),
        subtotal,
        taxAmount,
        totalAmount: subtotal + taxAmount,
        items: [
          { productName: 'Bulk Micro-Components & Displays', quantity: Number(purchasedQuantity), unitPrice: Number(purchasedPrice) }
        ]
      })
    }

    setIsLotModalOpen(false)
  }

  const handleDeleteLot = (id) => {
    if (confirm('Are you sure you want to delete this purchase lot record?')) {
      deleteLotPurchase(id)
    }
  }

  const handleOpenAddSale = () => {
    setEditingSale(null)
    setCustomerId(customers[0]?.id || '')
    setSelectedProdId(products[0]?.id || '')
    setSaleQty(5)
    setAppliedCoupon('')
    setPaymentStatus('Paid')
    setIsSaleModalOpen(true)
  }

  const handleOpenEditSale = (sale) => {
    setEditingSale(sale)
    setCustomerId(sale.customerId)
    setSelectedProdId(sale.items[0]?.productId || products[0]?.id)
    setSaleQty(sale.items[0]?.quantity || 5)
    setAppliedCoupon(sale.couponCode === 'NONE' ? '' : sale.couponCode)
    setPaymentStatus(sale.paymentStatus)
    setIsSaleModalOpen(true)
  }

  const handleSaveSale = (e) => {
    e.preventDefault()
    if (!selectedSaleProd) return

    const targetCustomer = customers.find(c => c.id === customerId) || customers[0]
    const subtotal = Number(saleQty) * selectedSaleProd.price
    const taxAmount = subtotal * 0.18
    let discountAmount = 0

    if (appliedCoupon) {
      const coup = coupons.find(c => c.code === appliedCoupon)
      if (coup) {
        if (coup.discountType === 'percentage') {
          discountAmount = Math.min(coup.maxDiscountAmount, (subtotal * coup.value) / 100)
        } else {
          discountAmount = coup.value
        }
      }
    }

    const finalTotal = subtotal + taxAmount - discountAmount

    if (editingSale) {
      updateSalesOrder(editingSale.orderId, {
        customerId: targetCustomer.id,
        customerName: targetCustomer.businessName,
        customerType: targetCustomer.role,
        subtotal,
        taxAmount,
        couponCode: appliedCoupon || 'NONE',
        discountAmount,
        finalTotal,
        paymentStatus
      })
    } else {
      createSalesOrder({
        customerId: targetCustomer.id,
        customerName: targetCustomer.businessName,
        customerType: targetCustomer.role,
        warehouseId: selectedSaleProd.warehouseId,
        warehouseName: selectedSaleProd.warehouseName,
        lotId: selectedSaleProd.lotCode,
        lotName: selectedSaleProd.lotCode,
        subtotal,
        taxRate: 18,
        taxAmount,
        couponCode: appliedCoupon || 'NONE',
        discountAmount,
        finalTotal,
        paymentStatus,
        paymentMethod: 'Bank Wire / UPI',
        items: [
          { productId: selectedSaleProd.id, productName: selectedSaleProd.name, quantity: Number(saleQty), unitPrice: selectedSaleProd.price, lineTotal: subtotal }
        ]
      })
    }

    setIsSaleModalOpen(false)
  }

  const handleDeleteSale = (id) => {
    if (confirm('Are you sure you want to delete this sales invoice?')) {
      deleteSalesOrder(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Billing & Tax Management</h1>
            <Badge variant="default">Full Billing CRUD Enabled</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, Read, Edit, and Delete supplier purchase lots and customer order sales invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'lot-purchases' ? (
            <Button onClick={handleOpenAddLot} variant="default">
              <Plus className="h-4 w-4 mr-1.5" />
              Create Supplier Purchase Lot
            </Button>
          ) : (
            <Button onClick={handleOpenAddSale} variant="emerald">
              <Plus className="h-4 w-4 mr-1.5" />
              New Order Sale Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'lot-purchases', label: '1. Lot Purchase Details (Supplier Lots)', icon: Layers, badge: lotPurchases.length },
          { id: 'product-sales', label: '2. Sale the Products (Order & Customer Billing)', icon: ShoppingBag, badge: salesOrders.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: Lot Purchase Details */}
      {activeTab === 'lot-purchases' && (
        <div className="space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
            <CardHeader>
              <CardTitle>Lot-Wise Supplier Purchases & Tax Audit</CardTitle>
              <CardDescription>
                Auto-generated Lot Names (non-editable by user) for accurate billing tracking across stock lots.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-950 uppercase text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Immutable Lot Code & Date</th>
                      <th className="px-4 py-3">Supplier Name</th>
                      <th className="px-4 py-3">Invoice Ref</th>
                      <th className="px-4 py-3">Destination Warehouse</th>
                      <th className="px-4 py-3">Total Quantity</th>
                      <th className="px-4 py-3">Subtotal</th>
                      <th className="px-4 py-3">GST Tax (18%)</th>
                      <th className="px-4 py-3">Total Lot Billing</th>
                      <th className="px-4 py-3">Lot Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
                    {lotPurchases.map((lot) => (
                      <tr key={lot.lotId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                            <Lock className="h-3 w-3 text-slate-400" />
                            {lot.lotName}
                          </span>
                          <span className="text-[10px] text-slate-400">{formatDate(lot.purchaseDate)}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{lot.supplierName}</td>
                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">{lot.invoiceNumber}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{lot.warehouseName}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white font-mono">{lot.totalItems} units</td>
                        <td className="px-4 py-3 font-mono">{formatCurrency(lot.subtotal)}</td>
                        <td className="px-4 py-3 font-mono text-amber-600 dark:text-amber-400">{formatCurrency(lot.taxAmount)}</td>
                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                          {formatCurrency(lot.totalAmount)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="success">{lot.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditLot(lot)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Lot Purchase"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLot(lot.lotId)}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10"
                            title="Delete Lot Purchase"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: Sale the Products */}
      {activeTab === 'product-sales' && (
        <div className="space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
            <CardHeader>
              <CardTitle>Sales Order Billing & Customer Invoicing</CardTitle>
              <CardDescription>
                Track customer orders Order ID-wise + Customer ID, applied coupon discounts, and tax breakdowns.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-950 uppercase text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Order ID & Date</th>
                      <th className="px-4 py-3">Customer / Partner</th>
                      <th className="px-4 py-3">Source Lot</th>
                      <th className="px-4 py-3">Subtotal</th>
                      <th className="px-4 py-3">Tax (18%)</th>
                      <th className="px-4 py-3">Applied Coupon</th>
                      <th className="px-4 py-3">Final Invoice Total</th>
                      <th className="px-4 py-3">Payment Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
                    {salesOrders.map((sale) => (
                      <tr key={sale.orderId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{sale.orderId}</span>
                          <div className="text-[10px] text-slate-400">{formatDate(sale.saleDate)}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          <div>{sale.customerName}</div>
                          <span className="text-[10px] text-slate-400 uppercase">Type: {sale.customerType}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="purple" className="font-mono">{sale.lotName}</Badge>
                        </td>
                        <td className="px-4 py-3 font-mono">{formatCurrency(sale.subtotal)}</td>
                        <td className="px-4 py-3 font-mono text-amber-600 dark:text-amber-400">{formatCurrency(sale.taxAmount)}</td>
                        <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400">
                          {sale.couponCode !== 'NONE' ? (
                            <span>-{formatCurrency(sale.discountAmount)} ({sale.couponCode})</span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 text-[10px]">No Coupon</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                          {formatCurrency(sale.finalTotal)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={sale.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                            {sale.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditSale(sale)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Order Sale"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSale(sale.orderId)}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10"
                            title="Delete Sales Order"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lot Purchase Modal */}
      <Modal
        isOpen={isLotModalOpen}
        onClose={() => setIsLotModalOpen(false)}
        title={editingLot ? 'Edit Purchase Lot Record' : 'Create New Supplier Purchase Lot'}
        description="Register or update an inventory purchase lot. Lot Code remains auto-generated and immutable."
      >
        <form onSubmit={handleSaveLot} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Auto-Generated Lot Code (Non-Editable)</span>
              <span className="text-[10px] text-amber-500 flex items-center gap-1">
                <Lock className="h-3 w-3" /> Locked Rule #6
              </span>
            </label>
            <input
              type="text"
              value={autoLotName}
              readOnly
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 px-3.5 py-2 font-mono text-sm text-indigo-600 dark:text-indigo-400 font-bold cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Supplier
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.businessName} ({s.locationDetails?.city})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Supplier Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Target Warehouse
              </label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Lot Items Quantity"
              type="number"
              value={purchasedQuantity}
              onChange={(e) => setPurchasedQuantity(e.target.value)}
              required
            />
            <Input
              label="Unit Cost Price (₹)"
              type="number"
              value={purchasedPrice}
              onChange={(e) => setPurchasedPrice(e.target.value)}
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsLotModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {editingLot ? 'Update Purchase Lot' : 'Register Purchase Lot'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Sales Order Modal */}
      <Modal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        title={editingSale ? 'Edit Sales Order Invoice' : 'Create Order Sale Invoice'}
        description="Issue or update a customer order sale invoice."
      >
        <form onSubmit={handleSaveSale} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Customer / Partner
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.businessName} ({c.role.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Product Item
            </label>
            <select
              value={selectedProdId}
              onChange={(e) => setSelectedProdId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — Price: {formatCurrency(p.price)} — Lot: {p.lotCode}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Sale Quantity"
              type="number"
              min="1"
              value={saleQty}
              onChange={(e) => setSaleQty(e.target.value)}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Discount Coupon
              </label>
              <select
                value={appliedCoupon}
                onChange={(e) => setAppliedCoupon(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">No Coupon</option>
                {coupons.map(c => (
                  <option key={c.id} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsSaleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="emerald">
              {editingSale ? 'Update Invoice' : 'Generate Sales Invoice'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
