import React, { useState } from 'react'
import {
  Smartphone,
  Radio,
  Zap,
  TrendingUp,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Building2,
  Coins,
  BadgePercent
} from 'lucide-react'
import { useRechargeStore } from '@/store/useRechargeStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { exportToExcel } from '@/lib/exportUtils'
import { RechargeReceiptModal } from '@/components/recharge/RechargeReceiptModal'
import { RechargeLogModal } from '@/components/recharge/RechargeLogModal'

export const RechargeTrackingView = () => {
  const {
    recharges,
    addRecharge,
    updateRechargeStatus,
    refundRecharge,
    deleteRecharge,
    getOperatorBreakdown,
    getRechargeStats
  } = useRechargeStore()

  // Modals state
  const [selectedRecharge, setSelectedRecharge] = useState(null)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)

  // Copy mobile number feedback state
  const [copiedId, setCopiedId] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [operatorFilter, setOperatorFilter] = useState('All')
  const [circleFilter, setCircleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [gatewayFilter, setGatewayFilter] = useState('All')

  // Filter lists
  const uniqueCircles = ['All', ...new Set(recharges.map(r => r.circle))]
  const uniqueGateways = ['All', ...new Set(recharges.map(r => r.thirdPartyGateway))]

  // Filtered dataset
  const filteredRecharges = recharges.filter((item) => {
    const matchesSearch =
      item.targetMobileNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.appUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.operatorRefId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.planCategory?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesOperator = operatorFilter === 'All' || item.operator === operatorFilter
    const matchesCircle = circleFilter === 'All' || item.circle === circleFilter
    const matchesStatus = statusFilter === 'All' || item.rechargeStatus === statusFilter
    const matchesGateway = gatewayFilter === 'All' || item.thirdPartyGateway === gatewayFilter

    return matchesSearch && matchesOperator && matchesCircle && matchesStatus && matchesGateway
  })

  // Aggregate stats
  const stats = getRechargeStats()
  const operatorBreakdown = getOperatorBreakdown()

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleOpenReceipt = (rch) => {
    setSelectedRecharge(rch)
    setIsReceiptModalOpen(true)
  }

  const handleRefund = (id, number) => {
    if (confirm(`Initiate instant refund for recharge on ${number}? Gateway webhook will credit amount back to user.`)) {
      refundRecharge(id)
    }
  }

  const handleDelete = (id) => {
    if (confirm(`Are you sure you want to delete recharge audit log "${id}"?`)) {
      deleteRecharge(id)
    }
  }

  const handleExportExcel = () => {
    const exportData = filteredRecharges.map(r => ({
      'Recharge ID': r.id,
      'Target Mobile Number': r.targetMobileNumber,
      'Telecom Operator': r.operator,
      'Circle / Region': r.circle,
      'Connection Type': r.connectionType,
      'Plan Amount (₹)': r.planAmount,
      'Plan Category': r.planCategory,
      'Validity': r.planValidity,
      'Plan Entitlements': r.planBenefits,
      'App Customer Name': r.appUserName,
      'Customer Email': r.appUserEmail,
      'App Device': r.appDevice,
      '3rd Party Gateway': r.thirdPartyGateway,
      'Operator Ref / RRN': r.operatorRefId,
      'Gateway Txn ID': r.gatewayTxnId,
      'Status': r.rechargeStatus,
      'Payment Channel': r.paymentMode,
      'Platform Commission (₹)': r.platformCommission,
      'User Cashback (₹)': r.userCashback,
      'Net Profit (₹)': r.netPlatformProfit,
      'Timestamp': new Date(r.createdAt).toLocaleString(),
      'Failure Reason': r.failureReason || 'N/A'
    }))

    exportToExcel(exportData, 'FillFree_Mobile_Recharge_Logs', 'Recharge Transactions')
  }

  const getOperatorBadgeClass = (op) => {
    switch (op) {
      case 'Jio':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
      case 'Airtel':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
      case 'Vi':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
      case 'BSNL':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      default:
        return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            Success
          </span>
        )
      case 'Pending Operator Response':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Clock className="h-3 w-3" />
            Pending Ack
          </span>
        )
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <AlertCircle className="h-3 w-3" />
            Failed
          </span>
        )
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <RotateCcw className="h-3 w-3" />
            Refunded
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* HEADER & ACTION BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 text-white">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Mobile Recharge Tracking</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                  3rd Party VAS Switch
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit mobile recharge values processed by consumer mobile app users via Bharat BillPay & telecom switches
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
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 h-9 text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Simulate / Log Recharge</span>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXECUTIVE KPI SUMMARY CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross Processed Volume */}
        <Card className="relative overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Gross Recharges Processed
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {formatCurrency(stats.totalVolume)}
              </h3>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 mt-0.5">
                <TrendingUp className="h-3 w-3" />
                Across {stats.totalCount} app recharge orders
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Operator Success Rate */}
        <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Gateway Success Rate
              </p>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.successRate}%
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3" />
                {stats.successCount} of {stats.totalCount} confirmed by carriers
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Unique Mobile Numbers Recharged */}
        <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Unique Mobile Numbers
              </p>
              <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {stats.uniqueMobiles} Lines
              </h3>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
                <Radio className="h-3 w-3" />
                Audited consumer subscriber base
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Smartphone className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Platform Commission Margins */}
        <Card className="relative overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Platform Commission Earned
              </p>
              <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                +{formatCurrency(stats.totalCommission)}
              </h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                <Coins className="h-3 w-3" />
                ~2.5% VAS operator margin
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <BadgePercent className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* CARRIER MARKET SHARE DISTRIBUTION BAR */}
      {/* ========================================================================= */}
      <Card className="p-4 border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2.5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Radio className="h-4 w-4 text-indigo-500" />
              Carrier Distribution & Market Share
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Relative recharge breakdown across telecom operators
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {operatorBreakdown.map(op => (
              <div key={op.operator} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${
                  op.operator === 'Jio' ? 'bg-blue-600' :
                  op.operator === 'Airtel' ? 'bg-rose-600' :
                  op.operator === 'Vi' ? 'bg-amber-600' : 'bg-emerald-600'
                }`} />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{op.operator}:</span>
                <span className="text-slate-500">{op.percentage}% ({op.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
          {operatorBreakdown.map(op => {
            if (Number(op.percentage) === 0) return null
            const colorClass =
              op.operator === 'Jio' ? 'bg-blue-600' :
              op.operator === 'Airtel' ? 'bg-rose-600' :
              op.operator === 'Vi' ? 'bg-amber-600' : 'bg-emerald-600'

            return (
              <div
                key={op.operator}
                style={{ width: `${op.percentage}%` }}
                className={`${colorClass} transition-all duration-300 relative group`}
                title={`${op.operator}: ${op.percentage}% (${op.count} recharges)`}
              />
            )
          })}
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* RECHARGE TRANSACTION LEDGER TABLE */}
      {/* ========================================================================= */}
      <Card>
        <CardHeader className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-indigo-500" />
                Mobile Recharge Audit Ledger
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time records of every mobile number recharged by mobile app consumers and 3rd-party status.
              </CardDescription>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search mobile, user, RRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>

          {/* Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {/* Operator Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Carrier:</span>
              <select
                value={operatorFilter}
                onChange={(e) => setOperatorFilter(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Carriers</option>
                <option value="Jio">Jio</option>
                <option value="Airtel">Airtel</option>
                <option value="Vi">Vi</option>
                <option value="BSNL">BSNL</option>
              </select>
            </div>

            {/* Circle Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Circle:</span>
              <select
                value={circleFilter}
                onChange={(e) => setCircleFilter(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                {uniqueCircles.map(c => (
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
                <option value="Success">Success</option>
                <option value="Pending Operator Response">Pending Ack</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            {/* Gateway Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Gateway:</span>
              <select
                value={gatewayFilter}
                onChange={(e) => setGatewayFilter(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                {uniqueGateways.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {(searchQuery || operatorFilter !== 'All' || circleFilter !== 'All' || statusFilter !== 'All' || gatewayFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setOperatorFilter('All')
                  setCircleFilter('All')
                  setStatusFilter('All')
                  setGatewayFilter('All')
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
                  <th className="px-4 py-3">Txn ID & Date</th>
                  <th className="px-4 py-3">Target Mobile Number</th>
                  <th className="px-4 py-3">Operator & Circle</th>
                  <th className="px-4 py-3 text-right">Plan Value</th>
                  <th className="px-4 py-3">App User Profile</th>
                  <th className="px-4 py-3">3rd-Party Gateway & RRN</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-3 py-3 text-right">Commission</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRecharges.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400">
                      No mobile recharge transactions match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredRecharges.map((rch) => (
                    <tr
                      key={rch.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-900/60 transition-colors"
                    >
                      {/* Ref & Date */}
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {rch.id}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(rch.createdAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      {/* Target Mobile Number */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            {rch.targetMobileNumber}
                          </span>
                          <button
                            onClick={() => handleCopy(rch.id, rch.targetMobileNumber)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="Copy Phone Number"
                          >
                            {copiedId === rch.id ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {rch.connectionType} Connection
                        </span>
                      </td>

                      {/* Operator & Circle */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getOperatorBadgeClass(rch.operator)}`}>
                          {rch.operator}
                        </span>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {rch.circle}
                        </div>
                      </td>

                      {/* Plan Value */}
                      <td className="px-4 py-3 text-right">
                        <div className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                          {formatCurrency(rch.planAmount)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {rch.planValidity}
                        </div>
                      </td>

                      {/* App User */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {rch.appUserName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {rch.appDevice}
                        </div>
                      </td>

                      {/* 3rd Party Gateway & Operator Ref */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {rch.thirdPartyGateway}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500">
                          Ref: {rch.operatorRefId}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 text-center">
                        {getStatusBadge(rch.rechargeStatus)}
                      </td>

                      {/* Commission */}
                      <td className="px-3 py-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(rch.platformCommission)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Receipt */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenReceipt(rch)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            title="View Recharge Receipt & 3rd-Party Audit"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>

                          {/* Refund Button if not already refunded */}
                          {rch.rechargeStatus !== 'Refunded' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRefund(rch.id, rch.targetMobileNumber)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
                              title="Trigger Gateway Refund"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                          )}

                          {/* Delete Action */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(rch.id)}
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

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      <RechargeReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        recharge={selectedRecharge}
      />

      <RechargeLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={addRecharge}
      />
    </div>
  )
}
