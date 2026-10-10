import React, { useState } from 'react'
import {
  X,
  Printer,
  Download,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  User,
  CreditCard,
  Building2,
  Radio,
  Layers,
  Zap,
  Tag,
  Hash,
  ArrowRight,
  BadgePercent
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { exportElementToPDF } from '@/lib/exportUtils'

export const RechargeReceiptModal = ({ isOpen, onClose, recharge }) => {
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen || !recharge) return null

  const handleDownloadPDF = async () => {
    setIsExporting(true)
    try {
      await exportElementToPDF(
        'recharge-receipt-document',
        `Recharge_Receipt_${recharge.targetMobileNumber.replace(/[^0-9]/g, '')}_${recharge.id}`
      )
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getOperatorStyle = (op) => {
    switch (op) {
      case 'Jio':
        return {
          bg: 'bg-blue-600',
          badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
        }
      case 'Airtel':
        return {
          bg: 'bg-rose-600',
          badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
        }
      case 'Vi':
        return {
          bg: 'bg-amber-600',
          badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
        }
      case 'BSNL':
        return {
          bg: 'bg-emerald-600',
          badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
        }
      default:
        return {
          bg: 'bg-slate-600',
          badge: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30'
        }
    }
  }

  const opStyle = getOperatorStyle(recharge.operator)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Mobile Recharge Receipt & VAS Audit</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {recharge.id}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Authorized 3rd-party telecom operator acknowledgment and transaction lineage
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
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Receipt'}</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Receipt Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div
            id="recharge-receipt-document"
            className="p-6 sm:p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 print:border-none print:p-2"
          >
            {/* Header: Carrier & Brand Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    FILLFREE CONSUMER APP • TELECOM VAS
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
                    3rd Party Gateway Verified
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                  Electronic Recharge Transaction Receipt
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Transaction Ref: <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">{recharge.id}</span> | Processed At: {new Date(recharge.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col sm:items-end">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Transaction Status</span>
                {recharge.rechargeStatus === 'Success' && (
                  <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4" />
                    Operator Acknowledged (Success)
                  </span>
                )}
                {recharge.rechargeStatus === 'Pending Operator Response' && (
                  <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    <Clock className="h-4 w-4" />
                    Pending Operator Acknowledgment
                  </span>
                )}
                {recharge.rechargeStatus === 'Failed' && (
                  <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    <AlertCircle className="h-4 w-4" />
                    Operator Rejected (Failed)
                  </span>
                )}
                {recharge.rechargeStatus === 'Refunded' && (
                  <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                    <CheckCircle2 className="h-4 w-4" />
                    Amount Refunded
                  </span>
                )}
                <span className="text-[10px] text-slate-400 mt-1">
                  Payment: <strong className="text-slate-700 dark:text-slate-300">{recharge.paymentMode}</strong> ({recharge.paymentStatus})
                </span>
              </div>
            </div>

            {/* Target Mobile Number Banner */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${opStyle.bg}`}>
                  {recharge.operator}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Recharged Target Mobile Number
                  </span>
                  <h3 className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                    {recharge.targetMobileNumber}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${opStyle.badge}`}>
                      {recharge.operator} • {recharge.circle} Circle
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">
                      {recharge.connectionType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Tag */}
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Plan Value Recharged
                </span>
                <div className="text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {formatCurrency(recharge.planAmount)}
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  Validity: <strong className="text-slate-800 dark:text-slate-200">{recharge.planValidity}</strong>
                </span>
              </div>
            </div>

            {/* Error Message if Failed */}
            {recharge.failureReason && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 p-4 flex items-start gap-3 text-xs text-rose-700 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Failure / Exception Notice:</strong>
                  <span>{recharge.failureReason}</span>
                </div>
              </div>
            )}

            {/* Plan Details & Benefits */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Plan Quota & Activated Entitlements
                </h4>
                <Badge variant="outline" className="text-[10px]">
                  {recharge.planCategory}
                </Badge>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium pt-1">
                {recharge.planBenefits}
              </p>
            </div>

            {/* Dual Grid: Initiating App User Profile & 3rd Party Gateway Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: App User Profile */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 bg-slate-50/50 dark:bg-slate-950/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  Initiating App Customer Profile
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">Customer Name:</strong> {recharge.appUserName}
                  </p>
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">Email:</strong> {recharge.appUserEmail}
                  </p>
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">App User ID:</strong>{' '}
                    <span className="font-mono text-slate-800 dark:text-slate-200">{recharge.appUserId}</span>
                  </p>
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">Device Platform:</strong> {recharge.appDevice}
                  </p>
                </div>
              </div>

              {/* Card 2: 3rd Party Processing Coordinates */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 bg-slate-50/50 dark:bg-slate-950/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-emerald-500" />
                  3rd-Party Gateway & Switch Coordinates
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">Gateway Provider:</strong>{' '}
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{recharge.thirdPartyGateway}</span>
                  </p>
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">Operator Ref / RRN:</strong>{' '}
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{recharge.operatorRefId}</span>
                  </p>
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">Gateway Txn ID:</strong>{' '}
                    <span className="font-mono text-slate-800 dark:text-slate-200">{recharge.gatewayTxnId}</span>
                  </p>
                  <p>
                    <strong className="text-slate-700 dark:text-slate-300">Payment Channel:</strong> {recharge.paymentMode}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Financial Ledger Audit */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-white dark:bg-slate-900">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BadgePercent className="h-3.5 w-3.5 text-indigo-500" />
                Administrative Platform Margin Audit
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Gross User Paid</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(recharge.planAmount)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Platform Commission (2.5%)</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">+{formatCurrency(recharge.platformCommission)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">User Cashback Discount</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">-{formatCurrency(recharge.userCashback)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Net Retained Profit</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">+{formatCurrency(recharge.netPlatformProfit)}</span>
                </div>
              </div>
            </div>

            {/* Footer Sign-off */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full border-2 border-dashed border-emerald-500/50 flex items-center justify-center text-emerald-600 font-bold text-[9px] uppercase">
                  VERIFIED
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">FillFree VAS Switch Gateway Engine</p>
                  <p className="text-[10px]">Cryptographically authenticated telecom transaction</p>
                </div>
              </div>

              <div className="text-right text-[11px]">
                <p>Support Helpline: <strong>1800-FILLFREE-VAS</strong></p>
                <p className="text-[10px]">FillFree Logistics & Digital Pvt Ltd • Kolkata, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Window
          </Button>
        </div>
      </div>
    </div>
  )
}
