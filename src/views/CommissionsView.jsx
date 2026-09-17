import React, { useState } from 'react'
import {
  Users,
  UserPlus,
  Coins,
  Percent,
  IndianRupee,
  Share2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Layers,
  Plus,
  ArrowRight,
  Gift,
  CreditCard,
  Building2,
  ShoppingBag,
  Sparkles,
  Award,
  Check,
  Network,
  HelpCircle,
  Info,
  ChevronRight,
  UserCheck,
  FileSpreadsheet
} from 'lucide-react'
import { useCommissionStore, generateCustomerReferralCode } from '@/store/useCommissionStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatCurrency, formatDate } from '@/lib/utils'
import { exportToExcel } from '@/lib/exportUtils'

// =========================================================================
// COOL SVG REFERRAL TREE COMPONENT FOR CUSTOMER POPUP
// =========================================================================
function CustomerReferralSvgTree({ customer, allCustomers }) {
  if (!customer) return null

  const directChildren = allCustomers.filter(c => c.referredById === customer.id)
  const childCount = directChildren.length

  // Balanced grouping: up to 4 children per row to prevent huge horizontal width
  const rows = []
  if (childCount <= 4) {
    if (childCount > 0) rows.push(directChildren)
  } else {
    const half = Math.ceil(childCount / 2)
    rows.push(directChildren.slice(0, half))
    rows.push(directChildren.slice(half))
  }

  // Fixed tight viewBox: 680px fits comfortably without giant gaps or massive horizontal stretching
  const svgWidth = 680
  const rootX = svgWidth / 2 // 340
  const rootY = 14
  const rootWidth = 180
  const rootHeight = 48
  const rootBottomY = rootY + rootHeight // 62

  const cardW = 120
  const cardH = 44
  const cardGap = 12

  // Determine dynamic compact height
  const hasSubDownlines = directChildren.some(c => allCustomers.some(ac => ac.referredById === c.id))
  let svgHeight = 140
  if (childCount === 0) {
    svgHeight = 140
  } else if (rows.length === 1) {
    svgHeight = hasSubDownlines ? 180 : 155
  } else {
    svgHeight = hasSubDownlines ? 250 : 225
  }

  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-3 shadow-inner">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <div className="flex items-center gap-1.5">
          <Network className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Referral Network Diagram
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          {childCount} Direct Downline {childCount === 1 ? 'Customer' : 'Customers'}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto select-none"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="rootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>

          <linearGradient id="childGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="subChildGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>

          {/* Subtle Glow Filter */}
          <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ============================================================= */}
        {/* ROOT NODE (Selected Customer) - Compact & Centered            */}
        {/* ============================================================= */}
        <g transform={`translate(${rootX - rootWidth / 2}, ${rootY})`}>
          <rect
            x="0"
            y="0"
            width={rootWidth}
            height={rootHeight}
            rx="10"
            fill="#1e1b4b"
            stroke="#818cf8"
            strokeWidth="1.5"
            filter="url(#subtleGlow)"
          />
          {/* Avatar Icon */}
          <circle cx="22" cy="24" r="13" fill="url(#rootGrad)" />
          <text
            x="22"
            y="28"
            fill="#ffffff"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            {customer.name.charAt(0)}
          </text>
          {/* Info Lines */}
          <text
            x="42"
            y="18"
            fill="#ffffff"
            fontSize="10.5"
            fontWeight="bold"
          >
            {customer.name.length > 16 ? customer.name.slice(0, 15) + '…' : customer.name}
          </text>
          <text
            x="42"
            y="30"
            fill="#a5b4fc"
            fontSize="8.5"
            fontWeight="500"
          >
            {customer.tier} • {customer.commissionRate}% Comm
          </text>
          <text
            x="42"
            y="41"
            fill="#34d399"
            fontSize="8"
            fontWeight="bold"
          >
            Code: {customer.referralCode}
          </text>
        </g>

        {/* Connector Pin */}
        <circle cx={rootX} cy={rootBottomY} r="3" fill="#a5b4fc" />

        {/* ============================================================= */}
        {/* IF 0 DIRECT REFERRALS (Compact Empty State)                   */}
        {/* ============================================================= */}
        {childCount === 0 && (
          <g>
            <path
              d={`M ${rootX} ${rootBottomY} L ${rootX} 88`}
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            <g transform={`translate(${rootX - 120}, 88)`}>
              <rect
                x="0"
                y="0"
                width="240"
                height="38"
                rx="8"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <text
                x="120"
                y="17"
                fill="#94a3b8"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                No Downline Referrals Yet
              </text>
              <text
                x="120"
                y="29"
                fill="#818cf8"
                fontSize="8.5"
                textAnchor="middle"
              >
                Share code {customer.referralCode} to start earning
              </text>
            </g>
          </g>
        )}

        {/* ============================================================= */}
        {/* IF HAS REFERRALS: Tightly grouped in compact rows             */}
        {/* ============================================================= */}
        {childCount > 0 &&
          rows.map((rowItems, rowIdx) => {
            // Tight vertical positions: Row 0 at y=94, Row 1 at y=156
            const rowY = rowIdx === 0 ? 94 : 156
            const rowCount = rowItems.length
            const totalRowWidth = rowCount * cardW + (rowCount - 1) * cardGap
            const startX = rootX - totalRowWidth / 2

            return (
              <g key={`row-${rowIdx}`}>
                {rowItems.map((child, colIdx) => {
                  const cardX = startX + colIdx * (cardW + cardGap)
                  const cardCenterX = cardX + cardW / 2
                  const subChildren = allCustomers.filter(c => c.referredById === child.id)
                  const hasSub = subChildren.length > 0

                  // Smooth, tight curve from root directly to child
                  const pathD = `M ${rootX} ${rootBottomY} C ${rootX} ${(rootBottomY + rowY) / 2}, ${cardCenterX} ${(rootBottomY + rowY) / 2}, ${cardCenterX} ${rowY}`

                  return (
                    <g key={child.id}>
                      {/* Connecting Line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="1.5"
                        strokeDasharray="2.5,2.5"
                        opacity="0.85"
                      />

                      {/* Flow Dot */}
                      <circle cx={cardCenterX} cy={rowY} r="2.5" fill="#818cf8" />

                      {/* Child Card */}
                      <g transform={`translate(${cardX}, ${rowY})`}>
                        <rect
                          x="0"
                          y="0"
                          width={cardW}
                          height={cardH}
                          rx="8"
                          fill="url(#childGrad)"
                          stroke="#3b82f6"
                          strokeWidth="1.2"
                        />
                        {/* Name */}
                        <text
                          x={cardW / 2}
                          y="15"
                          fill="#ffffff"
                          fontSize="9.5"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {child.name.length > 14 ? child.name.slice(0, 13) + '…' : child.name}
                        </text>
                        {/* City */}
                        <text
                          x={cardW / 2}
                          y="26"
                          fill="#94a3b8"
                          fontSize="8"
                          textAnchor="middle"
                        >
                          {child.city}
                        </text>
                        {/* Spend */}
                        <text
                          x={cardW / 2}
                          y="37"
                          fill="#34d399"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          Spend: ₹{child.totalPurchases.toLocaleString()}
                        </text>
                      </g>

                      {/* Tier-2 Downline Pill (Anchored tightly under card) */}
                      {hasSub && (
                        <g transform={`translate(${cardCenterX - 45}, ${rowY + cardH + 3})`}>
                          <rect
                            x="0"
                            y="0"
                            width="90"
                            height="16"
                            rx="8"
                            fill="url(#subChildGrad)"
                            stroke="#818cf8"
                            strokeWidth="0.8"
                          />
                          <text
                            x="45"
                            y="11"
                            fill="#93c5fd"
                            fontSize="7.5"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            +{subChildren.length} Tier-2 Downlines
                          </text>
                        </g>
                      )}
                    </g>
                  )
                })}
              </g>
            )
          })}
      </svg>
    </div>
  )
}

export const CommissionsView = () => {
  const {
    customers,
    commissionRecords,
    tiers,
    defaultCommissionRate,
    defaultDiscountRate,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    recordReferralPurchase,
    markCommissionPaid,
    markCommissionUnpaid,
    updateGlobalRates,
    getStats
  } = useCommissionStore()

  const stats = getStats()

  // Tab State (Simplified to 3 main tabs; tree is now inside customer popup)
  const [activeTab, setActiveTab] = useState('customers')

  // Search & Filters for Customers
  const [customerSearch, setCustomerSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Search & Filters for Commission Ledger
  const [ledgerSearch, setLedgerSearch] = useState('')
  const [payoutFilter, setPayoutFilter] = useState('All') // 'All' | 'Unpaid' | 'Paid'

  // Modals State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false)
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false)
  const [isSimulateOrderModalOpen, setIsSimulateOrderModalOpen] = useState(false)

  // Target Entities for Modals
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isFromDetailModal, setIsFromDetailModal] = useState(false)
  const [selectedCommissionRecord, setSelectedCommissionRecord] = useState(null)
  const [copiedCode, setCopiedCode] = useState(null)

  // Customer Form State (Add / Edit)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formCity, setFormCity] = useState('Kolkata, WB')
  const [formReferredById, setFormReferredById] = useState('')
  const [formCommissionRate, setFormCommissionRate] = useState(defaultCommissionRate.toString())
  const [formDiscountRate, setFormDiscountRate] = useState(defaultDiscountRate.toString())
  const [formTier, setFormTier] = useState('Bronze')
  const [formStatus, setFormStatus] = useState('Active')

  // Payout Form State
  const [payoutMethod, setPayoutMethod] = useState('UPI Instant Payout')
  const [payoutRef, setPayoutRef] = useState('')
  const [payoutNotes, setPayoutNotes] = useState('')

  // Simulate Order State
  const [simBuyerId, setSimBuyerId] = useState(customers[1]?.id || customers[0]?.id || '')
  const [simAmount, setSimAmount] = useState('25000')

  // Copy Referral Code helper
  const handleCopyCode = (code, e) => {
    e?.stopPropagation()
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Open Customer Detail Popup
  const handleOpenDetail = (customer) => {
    setSelectedCustomer(customer)
    setIsDetailModalOpen(true)
  }

  // Open Add Customer Modal
  const handleOpenAdd = () => {
    setFormName('')
    setFormEmail('')
    setFormPhone('')
    setFormCity('Kolkata, WB')
    setFormReferredById('')
    setFormCommissionRate(defaultCommissionRate.toString())
    setFormDiscountRate(defaultDiscountRate.toString())
    setFormTier('Bronze')
    setFormStatus('Active')
    setIsAddCustomerModalOpen(true)
  }

  // Open Edit Customer Modal (Defensive against null/undefined, supports opening from Detail modal)
  const handleOpenEdit = (customer, e, fromDetail = false) => {
    e?.stopPropagation?.()
    if (!customer) return
    setIsFromDetailModal(Boolean(fromDetail))
    setSelectedCustomer(customer)
    setFormName(customer.name || '')
    setFormEmail(customer.email || '')
    setFormPhone(customer.phone || '')
    setFormCity(customer.city || '')
    setFormReferredById(customer.referredById || '')

    const safeComm = customer.commissionRate !== undefined && customer.commissionRate !== null && !isNaN(customer.commissionRate)
      ? customer.commissionRate
      : defaultCommissionRate
    const safeDisc = customer.discountRate !== undefined && customer.discountRate !== null && !isNaN(customer.discountRate)
      ? customer.discountRate
      : defaultDiscountRate

    setFormCommissionRate(safeComm.toString())
    setFormDiscountRate(safeDisc.toString())
    setFormTier(customer.tier || 'Bronze')
    setFormStatus(customer.status || 'Active')

    if (fromDetail) {
      setIsDetailModalOpen(false)
    }
    setIsEditCustomerModalOpen(true)
  }

  const handleCloseEdit = () => {
    setIsEditCustomerModalOpen(false)
    if (isFromDetailModal) {
      setIsDetailModalOpen(true)
      setIsFromDetailModal(false)
    }
  }

  // Submit Add Customer
  const handleSaveAdd = (e) => {
    e.preventDefault()
    addCustomer({
      name: formName,
      email: formEmail,
      phone: formPhone,
      city: formCity,
      referredById: formReferredById || null,
      commissionRate: parseFloat(formCommissionRate),
      discountRate: parseFloat(formDiscountRate),
      tier: formTier,
      status: formStatus
    })
    setIsAddCustomerModalOpen(false)
  }

  // Submit Edit Customer
  const handleSaveEdit = (e) => {
    e?.preventDefault?.()
    if (!selectedCustomer) return

    const parsedComm = parseFloat(formCommissionRate)
    const validComm = !isNaN(parsedComm) && parsedComm >= 0 ? parsedComm : defaultCommissionRate

    const parsedDisc = parseFloat(formDiscountRate)
    const validDisc = !isNaN(parsedDisc) && parsedDisc >= 0 ? parsedDisc : defaultDiscountRate

    const updatedData = {
      name: formName.trim() || selectedCustomer.name,
      email: formEmail.trim() || selectedCustomer.email,
      phone: formPhone.trim() || selectedCustomer.phone,
      city: formCity.trim() || selectedCustomer.city,
      referredById: formReferredById || null,
      commissionRate: validComm,
      discountRate: validDisc,
      tier: formTier,
      status: formStatus
    }

    updateCustomer(selectedCustomer.id, updatedData)
    setIsEditCustomerModalOpen(false)

    // Re-fetch latest updated customer in state
    const updated = useCommissionStore.getState().customers.find(c => c.id === selectedCustomer.id)
    if (updated) {
      setSelectedCustomer(updated)
    }

    // Return to Customer Details modal if opened from there
    if (isFromDetailModal) {
      setIsDetailModalOpen(true)
      setIsFromDetailModal(false)
    }
  }

  // Open Delete Customer
  const handleOpenDelete = (customer, e) => {
    e?.stopPropagation()
    setSelectedCustomer(customer)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedCustomer) {
      deleteCustomer(selectedCustomer.id)
      setIsDeleteModalOpen(false)
      setIsDetailModalOpen(false)
      setSelectedCustomer(null)
    }
  }

  // Open Payout Modal for Commission Record
  const handleOpenPayout = (record) => {
    setSelectedCommissionRecord(record)
    setPayoutMethod('UPI Instant Payout')
    setPayoutRef(`UPI-DISBURSE-${Math.floor(100000 + Math.random() * 900000)}`)
    setPayoutNotes(`Commission disbursement for Order ${record.orderId}`)
    setIsPayoutModalOpen(true)
  }

  const handleConfirmPayout = (e) => {
    e.preventDefault()
    if (!selectedCommissionRecord) return
    markCommissionPaid(selectedCommissionRecord.id, {
      paymentMethod: payoutMethod,
      paymentRef: payoutRef,
      notes: payoutNotes
    })
    setIsPayoutModalOpen(false)
    setSelectedCommissionRecord(null)
  }

  // Simulate Order Execution
  const handleSimulateOrder = (e) => {
    e.preventDefault()
    const amount = parseFloat(simAmount) || 25000
    recordReferralPurchase({
      buyerId: simBuyerId,
      orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      orderAmount: amount
    })
    setIsSimulateOrderModalOpen(false)
    setActiveTab('ledger') // Jump to ledger to view new record!
  }

  // Filtered Customers
  const filteredCustomers = customers.filter(c => {
    const query = customerSearch.toLowerCase()
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.referralCode.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query)

    const matchesTier = tierFilter === 'All' || c.tier === tierFilter
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter

    return matchesSearch && matchesTier && matchesStatus
  })

  // Filtered Commission Records
  const filteredRecords = commissionRecords.filter(r => {
    const query = ledgerSearch.toLowerCase()
    const matchesSearch =
      r.id.toLowerCase().includes(query) ||
      r.buyerName.toLowerCase().includes(query) ||
      r.referrerName.toLowerCase().includes(query) ||
      r.orderId.toLowerCase().includes(query)

    const matchesPayout =
      payoutFilter === 'All' ||
      (payoutFilter === 'Paid' && r.status === 'Paid') ||
      (payoutFilter === 'Unpaid' && r.status === 'Unpaid')

    return matchesSearch && matchesPayout
  })

  const handleExportExcel = () => {
    const dataToExport = customers.map((c, idx) => {
      const parent = customers.find(p => p.id === c.referredById)
      const downlineCount = customers.filter(d => d.referredById === c.id).length
      return {
        'SL No': idx + 1,
        'Customer Name': c.name,
        'Referral Code': c.referralCode,
        'Email': c.email,
        'Phone': c.phone,
        'City': c.city,
        'Customer Tier': c.tier,
        'Commission Rate (%)': c.customCommissionRate !== undefined ? c.customCommissionRate : 2.5,
        'Discount Rate (%)': c.customDiscountRate !== undefined ? c.customDiscountRate : 2.0,
        'Referred By': parent ? `${parent.name} (${parent.referralCode})` : 'Direct / Organic',
        'Direct Referrals Count': downlineCount,
        'Lifetime Purchases (₹)': c.totalPurchases || 0,
        'Total Commission Earned (₹)': c.totalCommissionEarned || 0,
        'Total Commission Paid (₹)': c.totalCommissionPaid || 0,
        'Pending Commission Balance (₹)': (c.totalCommissionEarned || 0) - (c.totalCommissionPaid || 0),
        'Payout Status': (c.totalCommissionEarned || 0) <= (c.totalCommissionPaid || 0) ? 'Settled' : 'Pending Clearance',
        'Account Status': c.status
      }
    })
    exportToExcel(dataToExport, 'fillfree_commissions_referral_ledger', 'Commissions & Referrals')
  }

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Customer Referral & Commission System
            </h1>
            <Badge variant="indigo" className="text-[10px] uppercase font-bold tracking-wider">
              Super Admin
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage customers, configure individual user-basis percentages, view referral network trees, and settle commissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleExportExcel}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-9 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            title="Download Commission Ledger in Excel Format"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Download Excel</span>
          </Button>

          <Button onClick={() => setIsSimulateOrderModalOpen(true)} variant="secondary" size="sm">
            <ShoppingBag className="h-4 w-4 mr-1.5 text-indigo-500" />
            Test Referral Order
          </Button>

          <Button onClick={handleOpenAdd} variant="default" size="sm">
            <UserPlus className="h-4 w-4 mr-1.5" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          description="Registered users in network"
          icon={Users}
        />

        <StatCard
          title="Network Referrals"
          value={stats.totalReferrals}
          description="Invited downline members"
          icon={Network}
        />

        <StatCard
          title="Total Commission"
          value={formatCurrency(stats.totalCommissionEarned)}
          description="Total commissions generated"
          icon={Coins}
        />

        <StatCard
          title="Paid Disbursements"
          value={formatCurrency(stats.totalCommissionPaid)}
          description={`${stats.paidRecordsCount} settlements paid out`}
          icon={CheckCircle2}
        />

        <StatCard
          title="Unpaid Balance"
          value={formatCurrency(stats.totalPendingCommission)}
          description={`${stats.unpaidRecordsCount} records pending payment`}
          icon={Clock}
          className={stats.totalPendingCommission > 0 ? "border-amber-500/40 bg-amber-500/5" : ""}
        />
      </div>

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'customers', label: `Customers Directory (${customers.length})` },
          { id: 'ledger', label: `Commission Ledger & Payouts (${commissionRecords.length})` },
          { id: 'discounts', label: 'Rates & Discount Settings' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* ========================================================================= */}
      {/* TAB 1: CUSTOMERS DIRECTORY (Full CRUD + Click to View Network Popup)     */}
      {/* ========================================================================= */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          {/* Informational Banner on Commission Percentage Module */}
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3 shadow-sm">
            <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">
                How Commission & Discount Percentages Work
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                You can specify <strong>custom user-basis commission % and purchase discount %</strong> manually for each customer during creation or by clicking <strong>Edit</strong>.
                If not specified, the system automatically uses the global defaults (<strong>{defaultCommissionRate}% Commission / {defaultDiscountRate}% Discount</strong>).
                <strong> Click any customer row</strong> to open their complete profile, see who they referred, and view their interactive <strong>SVG Referral Tree</strong>!
              </p>
            </div>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search name, phone, city, referral code..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Filter className="h-3.5 w-3.5" />
                <span>Tier:</span>
              </div>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Tiers</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Diamond">Diamond</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Customers Table */}
          <Card className="overflow-hidden p-0 border-slate-200 dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-3 px-4">Customer (Click to View)</th>
                    <th className="py-3 px-4">Referral Code</th>
                    <th className="py-3 px-4">Referred By</th>
                    <th className="py-3 px-4">User Rates (Comm / Disc)</th>
                    <th className="py-3 px-4 text-center">Invited People</th>
                    <th className="py-3 px-4 text-right">Lifetime Spend</th>
                    <th className="py-3 px-4 text-right">Commission Balance</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-8 text-center text-slate-400">
                        No customers match your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => {
                      const referralsCount = customers.filter(c => c.referredById === cust.id).length
                      const isOverriddenComm = cust.commissionRate !== defaultCommissionRate
                      const isOverriddenDisc = cust.discountRate !== defaultDiscountRate

                      return (
                        <tr
                          key={cust.id}
                          onClick={() => handleOpenDetail(cust)}
                          className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 cursor-pointer transition-colors group"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                                {cust.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {cust.name}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">{cust.email}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">{cust.phone} • {cust.city}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                                {cust.referralCode}
                              </span>
                              <button
                                onClick={(e) => handleCopyCode(cust.referralCode, e)}
                                title="Copy Referral Code"
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                {copiedCode === cust.referralCode ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            {cust.referredById ? (
                              <div className="flex items-center gap-1.5">
                                <Badge variant="secondary" className="text-[11px] font-medium">
                                  {cust.referredByName}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">Direct / Organic</span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <Badge
                                  variant={isOverriddenComm ? "indigo" : "secondary"}
                                  className="text-[10px] font-semibold"
                                >
                                  {cust.commissionRate}% Comm
                                </Badge>
                                {isOverriddenComm && (
                                  <span className="text-[9px] text-indigo-500 font-bold" title="Custom user-basis percentage set">
                                    ★ Custom
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Badge
                                  variant={isOverriddenDisc ? "emerald" : "secondary"}
                                  className="text-[10px] font-semibold"
                                >
                                  {cust.discountRate}% Disc
                                </Badge>
                                {isOverriddenDisc && (
                                  <span className="text-[9px] text-emerald-500 font-bold" title="Custom user-basis purchase discount set">
                                    ★ Custom
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              referralsCount > 0 ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : 'text-slate-400'
                            }`}>
                              {referralsCount} {referralsCount === 1 ? 'user' : 'users'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right font-medium text-slate-800 dark:text-slate-200">
                            {formatCurrency(cust.totalPurchases)}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {formatCurrency(cust.totalCommissionEarned)}
                            </p>
                            {cust.pendingCommission > 0 ? (
                              <p className="text-[10px] text-amber-500 font-bold mt-0.5">
                                {formatCurrency(cust.pendingCommission)} Unpaid
                              </p>
                            ) : (
                              <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
                                All Settled
                              </p>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <Badge variant={cust.status === 'Active' ? 'emerald' : 'secondary'}>
                              {cust.status}
                            </Badge>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenEdit(cust, e, false)
                                }}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Edit Customer & Custom Rates"
                              >
                                <Edit className="h-3.5 w-3.5 text-slate-500 hover:text-indigo-600" />
                              </Button>

                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenDelete(cust, e)
                                }}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                title="Delete Customer"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COMMISSION LEDGER & PAYOUT STATUS ("is it paid or not")            */}
      {/* ========================================================================= */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by buyer, beneficiary, order ID..."
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Filter className="h-3.5 w-3.5" />
                <span>Payout Status:</span>
              </div>
              <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                {['All', 'Unpaid', 'Paid'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setPayoutFilter(st)}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      payoutFilter === st
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <Card className="overflow-hidden p-0 border-slate-200 dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-3 px-4">Transaction / Date</th>
                    <th className="py-3 px-4">Beneficiary (Referrer)</th>
                    <th className="py-3 px-4">Purchased By (Buyer)</th>
                    <th className="py-3 px-4">Order Ref & Value</th>
                    <th className="py-3 px-4 text-right">Commission Rate & Amount</th>
                    <th className="py-3 px-4 text-right">Buyer Discount</th>
                    <th className="py-3 px-4 text-center">Payout Status</th>
                    <th className="py-3 px-4 text-right">Action / Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-slate-400">
                        No commission records match your selection.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => {
                      const isPaid = record.status === 'Paid'

                      return (
                        <tr key={record.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-mono">
                            <p className="font-bold text-slate-900 dark:text-white">{record.id}</p>
                            <p className="text-[10px] text-slate-400 font-sans mt-0.5">{formatDate(record.date)}</p>
                          </td>

                          <td className="py-3 px-4">
                            <p className="font-semibold text-indigo-600 dark:text-indigo-400">{record.referrerName}</p>
                            <p className="text-[10px] text-slate-400">Beneficiary</p>
                          </td>

                          <td className="py-3 px-4">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{record.buyerName}</p>
                            <p className="text-[10px] text-slate-400">Referred Customer</p>
                          </td>

                          <td className="py-3 px-4">
                            <p className="font-mono font-medium text-slate-700 dark:text-slate-300">{record.orderId}</p>
                            <p className="text-[11px] text-slate-500 font-semibold">{formatCurrency(record.orderAmount)}</p>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                              +{formatCurrency(record.commissionAmount)}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Calculated @ {record.commissionRate}%
                            </p>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <span className="text-slate-600 dark:text-slate-300 font-medium">
                              -{formatCurrency(record.discountApplied)}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center">
                            {isPaid ? (
                              <Badge variant="emerald" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge variant="amber" className="gap-1">
                                <Clock className="h-3 w-3" />
                                Unpaid
                              </Badge>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {isPaid ? (
                              <div className="text-right">
                                <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                                  {record.paymentMethod}
                                </p>
                                <p className="text-[9px] font-mono text-slate-400" title={record.notes}>
                                  Ref: {record.paymentRef || 'Settled'}
                                </p>
                                <button
                                  onClick={() => markCommissionUnpaid(record.id)}
                                  className="text-[9px] text-rose-500 hover:underline mt-0.5 block ml-auto"
                                >
                                  Revert to Unpaid
                                </button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleOpenPayout(record)}
                                variant="default"
                                size="sm"
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                              >
                                <CreditCard className="h-3 w-3 mr-1" />
                                Pay Commission
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DISCOUNTS & RATE TIERS CONFIGURATION                                */}
      {/* ========================================================================= */}
      {activeTab === 'discounts' && (
        <div className="space-y-6">
          {/* Base System Rates Card */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-indigo-500" />
                    Global Base Referral Rates
                  </CardTitle>
                  <CardDescription>
                    These default rates apply automatically unless a Super Admin specifies custom user-basis percentages for a customer.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Default Referral Commission Rate
                    </p>
                    <Badge variant="indigo">{defaultCommissionRate}%</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Earned by the referring customer on all purchase subtotals placed by users they invited.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Default Customer Purchase Discount Rate
                    </p>
                    <Badge variant="emerald">{defaultDiscountRate}%</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Automatic discount granted to customers on checkout across product orders.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volume Tiers Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer Tier Rules</h3>
                <p className="text-xs text-slate-500">Tier rules calculate standard benefits based on lifetime spend thresholds.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiers.map((tier) => (
                <Card key={tier.id} className="border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tier.badgeColor}`}>
                        {tier.name}
                      </span>
                      <Award className="h-4 w-4 text-slate-400" />
                    </div>
                    <CardTitle className="text-sm mt-2">
                      Min Spend: {formatCurrency(tier.minSpend)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-1.5">
                      <span className="text-slate-500">Commission Rate:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{tier.defaultCommissionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-slate-500">Purchase Discount:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{tier.defaultDiscountRate}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* User-basis Explanation Alert */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
              Manual User-Basis Custom Percentage Controls
            </div>
            <p>
              You do not need a separate complex module to maintain individual user rates: as Super Admin, you can set the exact custom percentages for each customer directly inside their profile during creation or via <strong>Edit Customer</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: POPUP DETAILS & SVG REFERRAL TREE (On clicking any customer)      */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Customer Details & Referral Network: ${selectedCustomer?.name || ''}`}
        description="Comprehensive profile, configured user rates, and visual referral network diagram."
      >
        {selectedCustomer && (
          <div className="space-y-5 pt-2 max-h-[75vh] overflow-y-auto pr-1">
            {/* Top Profile Summary Bar */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedCustomer.name}</h3>
                    <Badge variant={selectedCustomer.status === 'Active' ? 'emerald' : 'secondary'}>
                      {selectedCustomer.status}
                    </Badge>
                    <Badge variant="indigo" className="text-[10px]">
                      {selectedCustomer.tier} Tier
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedCustomer.email} • {selectedCustomer.phone} • {selectedCustomer.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenEdit(selectedCustomer, e, true)
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit Rates & Info
                </Button>
              </div>
            </div>

            {/* Referral Info & User Rates Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Referral Code Card */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Referral Code</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {selectedCustomer.referralCode}
                  </span>
                  <button
                    onClick={(e) => handleCopyCode(selectedCustomer.referralCode, e)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400"
                    title="Copy Code"
                  >
                    {copiedCode === selectedCustomer.referralCode ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Referred By Card */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Referred By</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  {selectedCustomer.referredById ? selectedCustomer.referredByName : 'Direct / Organic (No Referrer)'}
                </p>
              </div>

              {/* User Configured Rates Card */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Rates</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenEdit(selectedCustomer, e, true)
                    }}
                    className="text-[10px] text-indigo-500 hover:text-indigo-400 font-semibold flex items-center gap-0.5 hover:underline"
                  >
                    <Edit className="h-2.5 w-2.5" />
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="indigo" className="text-[10px]">{selectedCustomer.commissionRate}% Comm</Badge>
                  <Badge variant="emerald" className="text-[10px]">{selectedCustomer.discountRate}% Disc</Badge>
                </div>
              </div>
            </div>

            {/* Financial Performance Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Lifetime Purchases</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(selectedCustomer.totalPurchases)}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Earned Commission</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatCurrency(selectedCustomer.totalCommissionEarned)}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Paid Commission</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                  {formatCurrency(selectedCustomer.totalCommissionPaid)}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Pending Balance</p>
                <p className={`text-sm font-bold mt-0.5 ${selectedCustomer.pendingCommission > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {formatCurrency(selectedCustomer.pendingCommission)}
                </p>
              </div>
            </div>

            {/* COOL SVG REFERRAL TREE DIAGRAM */}
            <div className="space-y-2">
              <CustomerReferralSvgTree
                customer={selectedCustomer}
                allCustomers={customers}
              />
            </div>

            {/* List of Referred Customers Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Customers Invited By {selectedCustomer.name}
                </h4>
                <span className="text-[11px] text-slate-400">
                  {customers.filter(c => c.referredById === selectedCustomer.id).length} direct downlines
                </span>
              </div>

              {customers.filter(c => c.referredById === selectedCustomer.id).length === 0 ? (
                <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                  This customer has not referred any new members yet.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2.5 px-3">Referred Member</th>
                        <th className="py-2.5 px-3">Referral Code</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">Joined Date</th>
                        <th className="py-2.5 px-3 text-right">Their Total Purchases</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {customers
                        .filter(c => c.referredById === selectedCustomer.id)
                        .map((downline) => (
                          <tr key={downline.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                            <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                              {downline.name}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-indigo-500">
                              {downline.referralCode}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">{downline.city}</td>
                            <td className="py-2.5 px-3 text-slate-400">{downline.joinedDate}</td>
                            <td className="py-2.5 px-3 text-right font-medium text-slate-800 dark:text-slate-200">
                              {formatCurrency(downline.totalPurchases)}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <Badge variant={downline.status === 'Active' ? 'emerald' : 'secondary'}>
                                {downline.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button onClick={() => setIsDetailModalOpen(false)} variant="default" size="sm">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: ADD CUSTOMER                                                      */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        title="Add New Customer"
        description="Register a new customer and specify custom user-basis commission and discount rates."
      >
        <form onSubmit={handleSaveAdd} className="space-y-4 pt-2">
          <Input
            label="Full Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. Rahul Sengupta"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="rahul@example.com"
              required
            />
            <Input
              label="Phone Number"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="+91 98300 12345"
              required
            />
          </div>

          <Input
            label="City / Location"
            value={formCity}
            onChange={(e) => setFormCity(e.target.value)}
            placeholder="Kolkata, West Bengal"
          />

          {/* Referred By Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Referred By (Invited by existing customer)
            </label>
            <select
              value={formReferredById}
              onChange={(e) => setFormReferredById(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">None (Direct / Organic Customer)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.referralCode}) - {c.city}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              If selected, this referrer will receive referral commission whenever this customer buys products.
            </p>
          </div>

          {/* User-basis Commission & Discount % */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40">
            <div>
              <Input
                label="User Commission %"
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={formCommissionRate}
                onChange={(e) => setFormCommissionRate(e.target.value)}
                placeholder="e.g. 2.5"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Rate this user earns when their invites buy products.
              </p>
            </div>

            <div>
              <Input
                label="Purchase Discount %"
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={formDiscountRate}
                onChange={(e) => setFormDiscountRate(e.target.value)}
                placeholder="e.g. 2.0"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Discount granted to this user on product checkout.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Tier
              </label>
              <select
                value={formTier}
                onChange={(e) => setFormTier(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddCustomerModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Create Customer
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: EDIT CUSTOMER & RATES                                             */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isEditCustomerModalOpen}
        onClose={handleCloseEdit}
        title={`Edit Customer: ${selectedCustomer?.name || ''}`}
        description="Update profile details, referrer binding, or customized user-basis percentages."
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
          <Input
            label="Full Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              required
            />
          </div>

          <Input
            label="City / Location"
            value={formCity}
            onChange={(e) => setFormCity(e.target.value)}
          />

          {/* Referred By */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Referred By (Referrer)
            </label>
            <select
              value={formReferredById}
              onChange={(e) => setFormReferredById(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">None (Direct / Organic Customer)</option>
              {customers
                .filter(c => c.id !== selectedCustomer?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.referralCode}) - {c.city}
                  </option>
                ))}
            </select>
          </div>

          {/* User-basis Commission & Discount % */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40">
            <div>
              <Input
                label="User Commission %"
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={formCommissionRate}
                onChange={(e) => setFormCommissionRate(e.target.value)}
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Custom rate earned when their invites purchase.
              </p>
            </div>

            <div>
              <Input
                label="Purchase Discount %"
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={formDiscountRate}
                onChange={(e) => setFormDiscountRate(e.target.value)}
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Custom discount applied on their product purchases.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Tier
              </label>
              <select
                value={formTier}
                onChange={(e) => setFormTier(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleCloseEdit}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: DELETE CUSTOMER                                                   */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        description={`Are you sure you want to delete customer "${selectedCustomer?.name}"?`}
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Deleting this customer will unbind them from any referred downstream customers. Past commission records will be archived with a note.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Customer
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: SETTLE COMMISSION PAYOUT ("is it paid or not")                    */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Disburse Commission Payout"
        description={`Settle commission for record ${selectedCommissionRecord?.id}`}
      >
        <form onSubmit={handleConfirmPayout} className="space-y-4 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Beneficiary:</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedCommissionRecord?.referrerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Commission Amount:</span>
              <span className="font-bold text-emerald-600 text-sm">
                {formatCurrency(selectedCommissionRecord?.commissionAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Order Ref:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{selectedCommissionRecord?.orderId}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Payment Method
            </label>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="UPI Instant Payout">UPI Instant Payout</option>
              <option value="Bank Wire / RTGS">Bank Wire / RTGS</option>
              <option value="Corporate Net Banking">Corporate Net Banking</option>
              <option value="Cheque / Cash Voucher">Cheque / Cash Voucher</option>
            </select>
          </div>

          <Input
            label="Transaction / Payment Reference ID"
            value={payoutRef}
            onChange={(e) => setPayoutRef(e.target.value)}
            placeholder="e.g. UPI/9831012345@paytm/441290"
            required
          />

          <Input
            label="Internal Settlement Note"
            value={payoutNotes}
            onChange={(e) => setPayoutNotes(e.target.value)}
            placeholder="e.g. Settled via UPI instant disbursement"
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsPayoutModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Confirm & Mark as Paid
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: SIMULATE TEST REFERRAL PURCHASE                                    */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isSimulateOrderModalOpen}
        onClose={() => setIsSimulateOrderModalOpen(false)}
        title="Simulate Referral Purchase"
        description="Simulate a customer order to test discount calculation and automated referrer commission."
      >
        <form onSubmit={handleSimulateOrder} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Purchasing Customer (Buyer)
            </label>
            <select
              value={simBuyerId}
              onChange={(e) => setSimBuyerId(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Discount: {c.discountRate}%) - {c.referredById ? `Invited by ${c.referredByName}` : 'Direct (No Referrer)'}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Order Subtotal Amount (₹)"
            type="number"
            value={simAmount}
            onChange={(e) => setSimAmount(e.target.value)}
            placeholder="25000"
            required
          />

          {(() => {
            const buyer = customers.find(c => c.id === simBuyerId)
            const referrer = customers.find(c => c.id === buyer?.referredById)
            const amount = parseFloat(simAmount) || 0
            const discount = buyer ? Math.round((amount * buyer.discountRate) / 100) : 0
            const commission = referrer ? Math.round((amount * referrer.commissionRate) / 100) : 0

            return (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-white">Expected Transaction Impact:</p>
                <div className="flex justify-between">
                  <span className="text-slate-500">Buyer Discount ({buyer?.discountRate}%):</span>
                  <span className="font-bold text-emerald-600">-{formatCurrency(discount)}</span>
                </div>
                {referrer ? (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Referrer ({referrer.name}) Commission ({referrer.commissionRate}%):</span>
                    <span className="font-bold text-indigo-600">+{formatCurrency(commission)} (Unpaid)</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">This buyer was not referred by anyone, so no referral commission will be generated.</p>
                )}
              </div>
            )
          })()}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsSimulateOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Submit Simulated Purchase
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
