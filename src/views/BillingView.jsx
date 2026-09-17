import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Receipt,
  ShoppingBag,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  Ticket,
  Printer,
  FileSpreadsheet,
  IndianRupee,
  Edit,
  Trash2,
  Truck,
  Coins,
  ArrowRight,
  Eye,
  Download,
  FileText
} from 'lucide-react'
import { useBillingStore } from '@/store/useBillingStore'
import { useDataStore } from '@/store/useDataStore'
import { useCommissionStore } from '@/store/useCommissionStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { BillDetailsModal } from '@/components/billing/BillDetailsModal'
import { formatCurrency, formatDate } from '@/lib/utils'
import { exportToExcel } from '@/lib/exportUtils'

export const BillingView = () => {
  const {
    salesOrders,
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder
  } = useBillingStore()

  const { partners, products, coupons } = useDataStore()
  const { customers: referralCustomers, recordReferralPurchase } = useCommissionStore()

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [editingSale, setEditingSale] = useState(null)
  const [viewInvoice, setViewInvoice] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Form State
  const customers = partners.filter(p => p.role !== 'Suppliers')
  const [customerId, setCustomerId] = useState(customers[0]?.id || '')
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '')
  const [saleQty, setSaleQty] = useState(5)
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('Paid')
  const [paymentMethod, setPaymentMethod] = useState('Bank Wire / UPI')

  const selectedSaleProd = products.find(p => p.id === selectedProdId) || products[0]

  const handleOpenAddSale = () => {
    setEditingSale(null)
    setCustomerId(customers[0]?.id || '')
    setSelectedProdId(products[0]?.id || '')
    setSaleQty(5)
    setAppliedCoupon('')
    setPaymentStatus('Paid')
    setPaymentMethod('Bank Wire / UPI')
    setIsSaleModalOpen(true)
  }

  const handleOpenEditSale = (sale) => {
    setEditingSale(sale)
    setCustomerId(sale.customerId)
    setSelectedProdId(sale.items?.[0]?.productId || products[0]?.id)
    setSaleQty(sale.items?.[0]?.quantity || 5)
    setAppliedCoupon(sale.couponCode === 'NONE' ? '' : sale.couponCode)
    setPaymentStatus(sale.paymentStatus)
    setPaymentMethod(sale.paymentMethod || 'Bank Wire / UPI')
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
        paymentStatus,
        paymentMethod,
        items: [
          {
            productId: selectedSaleProd.id,
            productName: selectedSaleProd.name,
            quantity: Number(saleQty),
            unitPrice: selectedSaleProd.price,
            lineTotal: subtotal
          }
        ]
      })
    } else {
      const generatedOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`

      // Automatically trigger commission calculation if target customer is in referral downline
      const matchingRefCustomer = referralCustomers.find(
        c => c.id === targetCustomer.id || c.name?.toLowerCase() === targetCustomer.businessName?.toLowerCase()
      )
      if (matchingRefCustomer) {
        recordReferralPurchase({
          buyerId: matchingRefCustomer.id,
          orderId: generatedOrderId,
          orderAmount: subtotal
        })
      }

      createSalesOrder({
        orderId: generatedOrderId,
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
        paymentMethod,
        items: [
          {
            productId: selectedSaleProd.id,
            productName: selectedSaleProd.name,
            quantity: Number(saleQty),
            unitPrice: selectedSaleProd.price,
            lineTotal: subtotal
          }
        ]
      })
    }

    setIsSaleModalOpen(false)
  }

  const handleDeleteSale = (orderId) => {
    if (confirm(`Are you sure you want to delete sales invoice ${orderId}?`)) {
      deleteSalesOrder(orderId)
    }
  }

  // Filtered Orders
  const filteredSales = salesOrders.filter(sale => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      sale.orderId?.toLowerCase().includes(q) ||
      sale.customerName?.toLowerCase().includes(q) ||
      sale.lotName?.toLowerCase().includes(q) ||
      sale.couponCode?.toLowerCase().includes(q)
    const matchesStatus = statusFilter === 'All' || sale.paymentStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  // Export to Excel Function
  const handleExportExcel = () => {
    const dataToExport = filteredSales.map((s, idx) => ({
      'SL No': idx + 1,
      'Invoice / Order ID': s.orderId,
      'Invoice Date': formatDate(s.saleDate),
      'Customer / Partner': s.customerName,
      'Customer Tier': (s.customerType || '').replace('_', ' ').toUpperCase(),
      'Source Lot Code': s.lotName || 'LOT-MAIN',
      'Fulfillment Godam': s.warehouseName || 'Dankuni Logistics Godam',
      'Taxable Subtotal (₹)': s.subtotal,
      'Output GST 18% (₹)': s.taxAmount,
      'Coupon Applied': s.couponCode || 'NONE',
      'Discount Deducted (₹)': s.discountAmount || 0,
      'Grand Invoice Total (₹)': s.finalTotal,
      'Payment Status': s.paymentStatus,
      'Payment Settlement Mode': s.paymentMethod || 'Bank Wire / UPI'
    }))

    exportToExcel(dataToExport, 'fillfree_sales_tax_invoices', 'Sales Invoices')
  }

  // Metrics
  const totalBilledRevenue = salesOrders.reduce((acc, s) => acc + (s.finalTotal || 0), 0)
  const totalGstCollected = salesOrders.reduce((acc, s) => acc + (s.taxAmount || 0), 0)
  const paidOrdersCount = salesOrders.filter(s => s.paymentStatus === 'Paid').length

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-md shadow-indigo-500/20">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Sales Orders & Billing
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customer invoicing, 18% GST tax calculation, coupon discount redemption & printable PDF bills
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Download in Excel Format */}
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="gap-1.5 text-xs h-9 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            title="Download Invoices Ledger in Excel Format (.xlsx)"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Download Excel</span>
          </Button>

          {/* Quick link to Procurement */}
          <Link
            to="/procurement"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Truck className="h-3.5 w-3.5 text-amber-500" />
            <span>Inward Lot Procurement</span>
            <ArrowRight className="h-3 w-3 text-slate-400" />
          </Link>

          <Button onClick={handleOpenAddSale} className="gap-1.5 text-xs h-9">
            <Plus className="h-3.5 w-3.5" />
            Create Sales Order
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Billed Revenue</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {formatCurrency(totalBilledRevenue)}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">From {salesOrders.length} customer sales orders</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Output GST Collected (18%)</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {formatCurrency(totalGstCollected)}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Government tax ledger liability</p>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Receipt className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Payment Clearance</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {paidOrdersCount} / {salesOrders.length} Paid
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Settled via wire transfer or UPI</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Coins className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-indigo-500" />
              Customer Tax Invoices & Dispatches
            </CardTitle>
            <CardDescription className="text-xs">
              Every outward order records downline referral commissions and generates authentic printable PDF tax bills.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </select>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search Order, Customer, Lot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 uppercase text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Order ID & Date</th>
                  <th className="px-5 py-3">Customer / Partner</th>
                  <th className="px-5 py-3">Source Lot</th>
                  <th className="px-5 py-3 text-right">Subtotal</th>
                  <th className="px-5 py-3 text-right">18% GST</th>
                  <th className="px-5 py-3 text-right">Discount</th>
                  <th className="px-5 py-3 text-right">Invoice Total</th>
                  <th className="px-5 py-3 text-center">Payment Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-slate-400">
                      No sales orders found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr key={sale.orderId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-5 py-3 font-mono">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{sale.orderId}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(sale.saleDate)}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{sale.customerName}</p>
                        <span className="text-[10px] text-slate-400 uppercase">
                          Role: {sale.customerType?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-slate-500">
                        {sale.lotName || 'LOT-MAIN'}
                      </td>
                      <td className="px-5 py-3 text-right font-mono">
                        {formatCurrency(sale.subtotal)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-amber-600 dark:text-amber-400">
                        +{formatCurrency(sale.taxAmount)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        {sale.discountAmount > 0 ? (
                          <span>-{formatCurrency(sale.discountAmount)}</span>
                        ) : (
                          <span className="text-slate-400">₹0</span>
                        )}
                        {sale.couponCode && sale.couponCode !== 'NONE' && (
                          <span className="block text-[9px] text-slate-400">({sale.couponCode})</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(sale.finalTotal)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Badge
                          className={
                            sale.paymentStatus === 'Paid'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : sale.paymentStatus === 'Partial'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }
                        >
                          {sale.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Real Tax Invoice Bill */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewInvoice(sale)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            title="View Authentic Tax Bill"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {/* Quick Download PDF */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewInvoice(sale)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                            title="Download Bill PDF"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditSale(sale)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            title="Edit Sales Order"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSale(sale.orderId)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Delete Order"
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

      {/* Create / Edit Sales Modal */}
      <Modal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        title={editingSale ? `Edit Sales Order: ${editingSale.orderId}` : 'Generate Customer Sales Invoice'}
      >
        <form onSubmit={handleSaveSale} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Customer / Trade Partner *
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.businessName} — ({c.role.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Catalog Product Item *
            </label>
            <select
              value={selectedProdId}
              onChange={(e) => setSelectedProdId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — {formatCurrency(p.price)} (Avail: {p.goodQty} pcs)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Dispatch Units Quantity *
              </label>
              <Input
                type="number"
                min="1"
                required
                value={saleQty}
                onChange={(e) => setSaleQty(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Promotional Coupon
              </label>
              <select
                value={appliedCoupon}
                onChange={(e) => setAppliedCoupon(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="">No Promotional Coupon</option>
                {coupons.map(c => (
                  <option key={c.id} value={c.code}>
                    {c.code} ({c.discountType === 'percentage' ? `${c.value}% OFF` : `₹${c.value} FLAT`})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="Paid">Paid (Immediate Clearance)</option>
                <option value="Pending">Pending (Credit Term)</option>
                <option value="Partial">Partial Settlement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="Bank Wire / UPI">Bank Wire / UPI</option>
                <option value="RTGS Transfer">RTGS Transfer</option>
                <option value="Cheque Clearance">Cheque Clearance</option>
                <option value="Net 30 Credit Line">Net 30 Credit Line</option>
              </select>
            </div>
          </div>

          {/* Real-time Order Summary */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Item Subtotal ({saleQty} × {formatCurrency(selectedSaleProd?.price || 0)}):</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {formatCurrency(Number(saleQty) * (selectedSaleProd?.price || 0))}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Output GST (18%):</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">
                +{formatCurrency(Number(saleQty) * (selectedSaleProd?.price || 0) * 0.18)}
              </span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Coupon Discount ({appliedCoupon}):</span>
                <span className="font-mono">- Applied at billing</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-800">
              <span>Estimated Payable Total:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 text-sm">
                {formatCurrency(Number(saleQty) * (selectedSaleProd?.price || 0) * 1.18)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsSaleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingSale ? 'Save Changes' : 'Issue Tax Invoice'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Real Tax Invoice Bill Modal & PDF Downloader */}
      <BillDetailsModal
        isOpen={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        bill={viewInvoice}
        type="sale"
      />
    </div>
  )
}
export default BillingView
