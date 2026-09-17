import React, { useState } from 'react'
import {
  FileText,
  Printer,
  Download,
  X,
  Building2,
  CheckCircle2,
  Lock,
  Calendar,
  ShieldCheck,
  IndianRupee,
  Receipt
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { exportElementToPDF, numberToIndianWords } from '@/lib/exportUtils'

export const BillDetailsModal = ({ isOpen, onClose, bill, type = 'sale' }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  if (!isOpen || !bill) return null

  const isSale = type === 'sale'
  const billNumber = isSale ? bill.orderId : bill.lotName || bill.invoiceNumber
  const billDate = isSale ? bill.saleDate : bill.purchaseDate

  const subtotal = bill.subtotal || 0
  const taxAmount = bill.taxAmount || subtotal * 0.18
  const discountAmount = bill.discountAmount || 0
  const finalTotal = isSale
    ? (bill.finalTotal || subtotal + taxAmount - discountAmount)
    : (bill.totalAmount || subtotal + taxAmount)

  const items = bill.items && bill.items.length > 0
    ? bill.items
    : [
        {
          productName: isSale ? 'Electronics & Hardware Goods' : 'Consolidated Inward Lot Stock',
          quantity: bill.totalItems || 1,
          unitPrice: isSale ? subtotal / (bill.totalItems || 1) : subtotal / (bill.totalItems || 1),
          lineTotal: subtotal
        }
      ]

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    const success = await exportElementToPDF('printable-bill-document', `Bill_${billNumber}`)
    setIsGeneratingPDF(false)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl my-6 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Control Bar (Non-Printable) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isSale ? 'Customer Tax Invoice Details' : 'Inward Purchase Bill / GRN'}
              </h3>
              <p className="text-[11px] font-mono text-slate-500">{billNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs h-8"
              title="Print Bill via Browser"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="gap-1.5 text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-100/70 dark:bg-slate-950/60 flex justify-center">
          {/* Authentic Paper Bill Sheet (White High-Contrast Canvas for Crisp Export) */}
          <div
            id="printable-bill-document"
            className="w-full max-w-2xl bg-white text-slate-900 p-6 sm:p-8 rounded-xl shadow-md border border-slate-200 text-xs font-sans leading-relaxed select-text"
            style={{ minHeight: '800px', backgroundColor: '#ffffff', color: '#0f172a' }}
          >
            {/* Header / Brand Banner */}
            <div className="border-b-2 border-slate-900 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded bg-indigo-700 flex items-center justify-center text-white font-black text-sm">
                      FF
                    </div>
                    <h1 className="text-xl font-extrabold tracking-wider text-slate-900 font-mono">
                      FILLFREE LOGISTICS PVT LTD
                    </h1>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1 font-medium">
                    Central Distribution & Multimodal Godam Logistics
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Plot 12, Sector V, Salt Lake Electronic Complex, Kolkata 700091, WB, India
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    GSTIN: <span className="font-bold text-slate-800">19AAACF4420K1ZX</span> | State: West Bengal (19) | CIN: U63090WB2024PTC271928
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-slate-900 text-white font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
                    {isSale ? 'TAX INVOICE' : 'GOODS RECEIPT NOTE / BILL'}
                  </span>
                  <p className="text-[10px] text-slate-500 font-semibold">Original for Recipient</p>
                  <p className="font-mono font-bold text-sm text-indigo-700 mt-1">{billNumber}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">Date: {formatDate(billDate)}</p>
                </div>
              </div>
            </div>

            {/* Bill Meta Data & Supply Coordinates */}
            <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-200">
              {/* Buyer / Vendor Info */}
              <div className="border-r border-slate-200 pr-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSale ? 'Billed To (Customer / Consignee)' : 'Purchased From (Supplier Vendor)'}
                </p>
                <h4 className="font-bold text-sm text-slate-900">
                  {isSale ? bill.customerName : bill.supplierName}
                </h4>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  ID: <span className="font-mono font-medium">{isSale ? bill.customerId : bill.supplierId}</span>
                </p>
                <p className="text-[10px] text-slate-600">
                  Category: <span className="capitalize font-medium">{isSale ? (bill.customerType || 'Customer').replace('_', ' ') : 'Verified Supplier'}</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  GSTIN / PAN: <span className="font-mono font-semibold">19AABCT{Math.floor(1000 + Math.random() * 8999)}P1Z5</span>
                </p>
                <p className="text-[10px] text-slate-500">
                  Place of Supply: <span className="font-medium">West Bengal, India</span>
                </p>
              </div>

              {/* Godam & Logistics Dispatch Details */}
              <div className="pl-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Dispatch & Storage Coordinates
                </p>
                <h4 className="font-semibold text-xs text-slate-900 flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-slate-500" />
                  {bill.warehouseName || 'Central Logistics Godam'}
                </h4>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Lot Source: <span className="font-mono font-bold text-slate-800">{bill.lotName || bill.lotId || 'LOT-MAIN'}</span>
                </p>
                <p className="text-[10px] text-slate-600">
                  Payment Status:{' '}
                  <span className={`font-bold ${bill.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {bill.paymentStatus || (isSale ? 'Paid' : 'In-Stock Settled')}
                  </span>
                </p>
                <p className="text-[10px] text-slate-600">
                  Settlement Mode: <span className="font-medium">{bill.paymentMethod || 'Bank Wire / RTGS'}</span>
                </p>
                <p className="text-[10px] text-slate-500">
                  Reverse Charge Applicable: <span className="font-semibold">NO</span>
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-3">
              <table className="w-full text-left text-[11px] border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[9px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 w-8 text-center border-r border-slate-200">#</th>
                    <th className="px-3 py-2 border-r border-slate-200">Item Description</th>
                    <th className="px-3 py-2 text-center border-r border-slate-200">HSN Code</th>
                    <th className="px-3 py-2 text-right border-r border-slate-200">Qty</th>
                    <th className="px-3 py-2 text-right border-r border-slate-200">Rate (₹)</th>
                    <th className="px-3 py-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 text-center font-mono text-slate-500 border-r border-slate-200">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-slate-900 border-r border-slate-200">
                        <div>{item.productName || 'General Stock SKU'}</div>
                        <span className="text-[9px] text-slate-500 font-mono font-normal">
                          Lot Batch: {bill.lotName || 'LOT-202608-8801'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-slate-600 border-r border-slate-200">
                        8471
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-800 border-r border-slate-200">
                        {item.quantity?.toLocaleString()} pcs
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-slate-700 border-r border-slate-200">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(item.lineTotal || (item.quantity * item.unitPrice))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations & GST Breakdown */}
            <div className="grid grid-cols-2 gap-4 py-2 border-t border-slate-200">
              {/* Left Column: Bank Coordinates & Amount in Words */}
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-2.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Settlement Bank Coordinates
                  </p>
                  <p className="text-[10px] text-slate-700">Bank: <span className="font-semibold">HDFC Bank Ltd</span></p>
                  <p className="text-[10px] text-slate-700">A/C Name: <span className="font-semibold">FillFree Logistics Pvt Ltd</span></p>
                  <p className="text-[10px] text-slate-700 font-mono">A/C No: <span className="font-bold">50200088192837</span></p>
                  <p className="text-[10px] text-slate-700 font-mono">IFSC Code: <span className="font-bold">HDFC0001248</span></p>
                  <p className="text-[10px] text-slate-700 font-mono">UPI ID: <span className="font-bold text-indigo-700">fillfree@hdfcbank</span></p>
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Invoice Amount in Words:</p>
                  <p className="text-[11px] font-bold text-slate-900 italic mt-0.5">
                    {numberToIndianWords(finalTotal)}
                  </p>
                </div>
              </div>

              {/* Right Column: Financial Totals */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Taxable Subtotal:</span>
                  <span className="font-mono font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Central GST (CGST @ 9%):</span>
                  <span className="font-mono font-semibold">+{formatCurrency(taxAmount / 2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>State GST (SGST @ 9%):</span>
                  <span className="font-mono font-semibold">+{formatCurrency(taxAmount / 2)}</span>
                </div>

                {isSale && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Coupon ({bill.couponCode || 'PROMO'}):</span>
                    <span className="font-mono font-bold">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span>Round Off:</span>
                  <span className="font-mono">₹0.00</span>
                </div>

                <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t-2 border-slate-900">
                  <span>Grand Payable Total:</span>
                  <span className="font-mono text-indigo-700 text-base">{formatCurrency(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Declaration & Official Signatory Stamp */}
            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 items-end">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Declaration & Terms</p>
                <p className="text-[9px] text-slate-500 leading-tight">
                  1. Goods once dispatched/received adhere strictly to standard warehouse quality check parameters.
                </p>
                <p className="text-[9px] text-slate-500 leading-tight mt-0.5">
                  2. Interest @ 18% p.a. will be levied on credit settlements pending beyond due maturity date.
                </p>
                <p className="text-[9px] text-slate-500 leading-tight mt-0.5">
                  3. This is a computer-generated tax document governed under the Kolkata judicial territory.
                </p>
              </div>

              <div className="text-right flex flex-col items-end">
                {/* Official Circular Digital Stamp */}
                <div className="w-28 h-28 rounded-full border-2 border-dashed border-indigo-700/60 p-1 flex flex-col items-center justify-center text-center text-indigo-700 transform -rotate-6 select-none my-1 opacity-90">
                  <span className="text-[7px] font-bold uppercase tracking-wider leading-none">FILLFREE LOGISTICS</span>
                  <span className="text-[9px] font-black tracking-widest my-0.5">★ VERIFIED ★</span>
                  <span className="text-[7px] font-semibold leading-none">TAX INVOICE SEAL</span>
                  <span className="text-[6px] text-slate-600 mt-0.5">KOLKATA HUB</span>
                </div>

                <p className="text-[10px] font-bold text-slate-800 mt-1">For FILLFREE LOGISTICS PVT LTD</p>
                <p className="text-[9px] text-slate-500">Authorized Accounts Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillDetailsModal
