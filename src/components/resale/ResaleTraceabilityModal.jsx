import React, { useState } from 'react'
import {
  X,
  Printer,
  Download,
  Building2,
  Truck,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Hash,
  Coins,
  ArrowRight,
  TrendingUp,
  Tag,
  Clock,
  Layers,
  FileText,
  BadgeCheck,
  Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { exportElementToPDF } from '@/lib/exportUtils'

export const ResaleTraceabilityModal = ({ isOpen, onClose, resale }) => {
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen || !resale) return null

  const handleDownloadPDF = async () => {
    setIsExporting(true)
    try {
      await exportElementToPDF(
        'resale-traceability-document',
        `Resale_Dossier_${resale.resaleRef || resale.id}`
      )
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Action Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Resale Traceability Dossier</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {resale.id}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                End-to-end 3-tier supply chain lineage and downstream buyer destination audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 h-8 text-xs border-slate-200 dark:border-slate-700"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="gap-1.5 h-8 text-xs bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Dossier'}</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Printable Container */}
          <div
            id="resale-traceability-document"
            className="p-6 sm:p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 print:border-none print:p-2"
          >
            {/* Header: Document Title & Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    FILLFREE LOGISTICS ERP
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
                    Audited Supply Chain
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                  Product Secondary Resale Dossier
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Resale Reference: <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">{resale.resaleRef}</span> | Logged On: {resale.resaleDate}
                </p>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Delivery & Verification Status</span>
                <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <BadgeCheck className="h-4 w-4" />
                  {resale.deliveryStatus}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Payment: <strong className="text-slate-700 dark:text-slate-300">{resale.paymentStatus}</strong> via {resale.paymentMethod}
                </span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 3-TIER VISUAL PROGRESSION */}
            {/* ========================================================================= */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-500" />
                3-Tier Supply Chain Traceability Lineage
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* TIER 1: Primary Procurement */}
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-3.5 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400">
                        Tier 1: Factory Inward
                      </span>
                      <Building2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">FillFree Godam Inward Lot</p>
                    <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                      {resale.lotCode}
                    </p>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                      <p>Warehouse: <span className="font-semibold text-slate-800 dark:text-slate-200">{resale.warehouseName}</span></p>
                      <p>Procurement Status: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">QC Passed & Stocked</span></p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-blue-500/20 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Source: FillFree Central</span>
                    <ArrowRight className="h-3 w-3 text-blue-500" />
                  </div>
                </div>

                {/* TIER 2: Primary Dispatch to Dealer/Wholesaler */}
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3.5 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                        Tier 2: Primary Dispatch
                      </span>
                      <Truck className="h-4 w-4 text-indigo-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Sold to Authorized Reseller</p>
                    <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {resale.resellerName}
                    </p>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                      <p>Role: <span className="font-semibold uppercase text-slate-800 dark:text-slate-200">{resale.resellerRole.replace('_', ' ')}</span></p>
                      <p>FillFree Invoice: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{resale.primaryOrderId}</span></p>
                      <p>Dispatch Date: <span>{resale.primaryOrderDate}</span></p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-indigo-500/20 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Purchase Cost: {formatCurrency(resale.unitDealerCost)}/u</span>
                    <ArrowRight className="h-3 w-3 text-indigo-500" />
                  </div>
                </div>

                {/* TIER 3: Secondary Downstream Resale */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        Tier 3: Downstream Resale
                      </span>
                      <ShoppingBag className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Resold to Downstream Buyer</p>
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                      {resale.buyerBusinessName || resale.buyerName}
                    </p>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                      <p>Destination: <span className="font-semibold text-slate-800 dark:text-slate-200">{resale.city}, {resale.state}</span></p>
                      <p>Channel: <span className="font-semibold text-slate-800 dark:text-slate-200">{resale.channelType}</span></p>
                      <p>Resale Date: <span>{resale.resaleDate}</span></p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-emerald-500/20 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Resale Price: {formatCurrency(resale.unitResalePrice)}/u</span>
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* DOWNSTREAM DESTINATION & BUYER PROFILE */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Buyer Coordinates */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5 text-indigo-500" />
                    Downstream Buyer Information
                  </h4>
                  <Badge variant="outline" className="text-[10px]">
                    {resale.channelType}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {resale.buyerBusinessName}
                  </p>
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">Contact Person / Owner:</strong> {resale.buyerName}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span>{resale.buyerPhone}</span>
                  </p>
                  {resale.buyerEmail && (
                    <p className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-slate-400" />
                      <span>{resale.buyerEmail}</span>
                    </p>
                  )}
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">GSTIN / Identification:</strong>{' '}
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{resale.buyerGstin}</span>
                  </p>
                </div>
              </div>

              {/* Geographical Resale Location */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    Resale Destination & Territory
                  </h4>
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded bg-rose-500/10">
                    {resale.territoryZone || `${resale.city} Zone`}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {resale.shopPremise}
                  </p>
                  <p>{resale.streetAddress}</p>
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">City & District:</strong> {resale.city}, {resale.district}
                  </p>
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">State & Pincode:</strong> {resale.state} - {resale.pincode}
                  </p>
                  {resale.coordinates && (
                    <p className="text-[11px] font-mono text-slate-500">
                      GPS Coordinates: {resale.coordinates}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PRODUCT & COMMERCIAL FINANCIALS TABLE */}
            {/* ========================================================================= */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-amber-500" />
                Resold Merchandise & Profitability Breakdown
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">Item & SKU</th>
                      <th className="px-3 py-2.5 text-center">Resold Qty</th>
                      <th className="px-3 py-2.5 text-right">Dealer Buy Price</th>
                      <th className="px-3 py-2.5 text-right">Resale Sell Price</th>
                      <th className="px-3 py-2.5 text-right">Unit Markup</th>
                      <th className="px-3 py-2.5 text-right">Total Resale (Excl. Tax)</th>
                      <th className="px-4 py-2.5 text-right">Total Dealer Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    <tr>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-white">{resale.productName}</div>
                        <div className="font-mono text-[11px] text-slate-500">SKU: {resale.sku} | Cat: {resale.category}</div>
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-sm">
                        {resale.quantity} Units
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-slate-600 dark:text-slate-400">
                        {formatCurrency(resale.unitDealerCost)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(resale.unitResalePrice)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        +{formatCurrency(resale.unitMargin)} (+{resale.marginPercentage}%)
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-semibold">
                        {formatCurrency(resale.subtotalResale)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(resale.totalMarginEarned)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 font-semibold text-xs">
                    <tr>
                      <td colSpan={5} className="px-4 py-2 text-right text-slate-500">
                        18% GST Remitted:
                      </td>
                      <td className="px-3 py-2 text-right font-mono">
                        {formatCurrency(resale.taxAmount)}
                      </td>
                      <td></td>
                    </tr>
                    <tr className="border-t border-slate-200 dark:border-slate-800 text-sm">
                      <td colSpan={5} className="px-4 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                        Total Resale Invoiced Amount:
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-black text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(resale.totalResaleAmount)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(resale.totalMarginEarned)} Net Margin
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SERIAL NUMBERS & WARRANTY TRACKING */}
            {/* ========================================================================= */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Item Serial Traceability & Digital Warranty
                </h4>
                <div className="flex items-center gap-2">
                  {resale.warrantyActivated ? (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      {resale.warrantyPeriodMonths} Months Active Warranty (Valid till {resale.warrantyExpiryDate})
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                      Warranty Pending Registration
                    </span>
                  )}
                </div>
              </div>

              {/* Serial Tokens */}
              <div className="space-y-1.5">
                <p className="text-[11px] text-slate-500">Tracked Units Serial Numbers:</p>
                <div className="flex flex-wrap gap-2">
                  {resale.serialNumbers?.length > 0 ? (
                    resale.serialNumbers.map((sn, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 shadow-xs"
                      >
                        <Hash className="h-3 w-3 text-indigo-500" />
                        {sn}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">Bulk batch tracked (no individual serial registered)</span>
                  )}
                </div>
              </div>

              {resale.notes && (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400">
                  <strong>Special Deployment Notes:</strong> {resale.notes}
                </div>
              )}
            </div>

            {/* Official Audit Verification Seal & Coordinates */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full border-2 border-dashed border-emerald-500/50 flex items-center justify-center text-emerald-600 font-bold text-[9px] uppercase">
                  VERIFIED
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">FillFree Supply Chain Audit Engine</p>
                  <p className="text-[10px]">Cryptographically verified downstream consignment route</p>
                </div>
              </div>

              <div className="text-right text-[11px]">
                <p>Generated by: <strong>Super Admin Console</strong></p>
                <p className="text-[10px]">FillFree ERP v2026.1 • Kolkata, WB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Dossier
          </Button>
        </div>
      </div>
    </div>
  )
}
