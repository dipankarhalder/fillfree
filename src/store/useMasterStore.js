import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const INITIAL_UNITS = [
  {
    id: 'uom-01',
    code: 'PCS',
    name: 'Pieces / Units',
    symbol: 'pcs',
    isDecimalAllowed: false,
    status: 'Active',
    description: 'Standard discrete item count for monitors, electronics, and devices.'
  },
  {
    id: 'uom-02',
    code: 'KG',
    name: 'Kilogram',
    symbol: 'kg',
    isDecimalAllowed: true,
    status: 'Active',
    description: 'Metric weight measurement for raw bulk materials and powders.'
  },
  {
    id: 'uom-03',
    code: 'LTR',
    name: 'Liter',
    symbol: 'L',
    isDecimalAllowed: true,
    status: 'Active',
    description: 'Volume measurement for cooling liquids, lubricants, and solvents.'
  },
  {
    id: 'uom-04',
    code: 'BOX',
    name: 'Carton / Box',
    symbol: 'box',
    isDecimalAllowed: false,
    status: 'Active',
    description: 'Master packing outer carton containing multiple discrete units.'
  },
  {
    id: 'uom-05',
    code: 'MTR',
    name: 'Meter',
    symbol: 'm',
    isDecimalAllowed: true,
    status: 'Active',
    description: 'Linear length measurement for network patch cables and optical fiber.'
  },
  {
    id: 'uom-06',
    code: 'SET',
    name: 'Combo Set',
    symbol: 'set',
    isDecimalAllowed: false,
    status: 'Active',
    description: 'Pre-bundled kit consisting of complementary hardware accessories.'
  },
  {
    id: 'uom-07',
    code: 'PLT',
    name: 'Pallet Load',
    symbol: 'plt',
    isDecimalAllowed: false,
    status: 'Active',
    description: 'Warehouse skid pallet holding high-volume master lots.'
  },
  {
    id: 'uom-08',
    code: 'BDL',
    name: 'Bundle',
    symbol: 'bdl',
    isDecimalAllowed: false,
    status: 'Active',
    description: 'Strapped bundle packaging for industrial warehouse supplies.'
  }
]

export const INITIAL_STATUSES = [
  // Sales & Orders Domain
  {
    id: 'stat-ord-01',
    name: 'Draft Order',
    code: 'DRAFT',
    domain: 'Sales & Orders',
    colorBadge: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    description: 'Order created in preliminary state, pending customer confirmation.',
    isSystemDefault: true
  },
  {
    id: 'stat-ord-02',
    name: 'Confirmed',
    code: 'CONFIRMED',
    domain: 'Sales & Orders',
    colorBadge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    description: 'Customer order verified and approved for godam packing.',
    isSystemDefault: true
  },
  {
    id: 'stat-ord-03',
    name: 'Dispatched',
    code: 'DISPATCHED',
    domain: 'Sales & Orders',
    colorBadge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    description: 'Consignment handed over to freight courier partner with tracking ID.',
    isSystemDefault: true
  },
  {
    id: 'stat-ord-04',
    name: 'Delivered',
    code: 'DELIVERED',
    domain: 'Sales & Orders',
    colorBadge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'Consignment successfully signed and acknowledged by recipient.',
    isSystemDefault: true
  },
  {
    id: 'stat-ord-05',
    name: 'Cancelled',
    code: 'CANCELLED',
    domain: 'Sales & Orders',
    colorBadge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    description: 'Voided order with items restocked back to warehouse floor.',
    isSystemDefault: false
  },

  // Payment Domain
  {
    id: 'stat-pay-01',
    name: 'Unpaid / Pending',
    code: 'UNPAID',
    domain: 'Payments',
    colorBadge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    description: 'Invoice issued with outstanding balance awaiting settlement.',
    isSystemDefault: true
  },
  {
    id: 'stat-pay-02',
    name: 'Partial Payment',
    code: 'PARTIAL',
    domain: 'Payments',
    colorBadge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    description: 'Part payment received; residual balance pending credit term maturity.',
    isSystemDefault: true
  },
  {
    id: 'stat-pay-03',
    name: 'Paid in Full',
    code: 'PAID',
    domain: 'Payments',
    colorBadge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: '100% remittance cleared via Bank Wire, RTGS, or UPI gateway.',
    isSystemDefault: true
  },
  {
    id: 'stat-pay-04',
    name: 'Refunded',
    code: 'REFUNDED',
    domain: 'Payments',
    colorBadge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    description: 'Funds reversed to customer account following return or adjustment.',
    isSystemDefault: false
  },

  // Procurement Domain
  {
    id: 'stat-proc-01',
    name: 'PO Placed',
    code: 'ORDERED',
    domain: 'Procurement',
    colorBadge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    description: 'Purchase Order officially issued to authorized manufacturing vendor.',
    isSystemDefault: true
  },
  {
    id: 'stat-proc-02',
    name: 'In Transit',
    code: 'TRANSIT',
    domain: 'Procurement',
    colorBadge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    description: 'Cargo dispatched by supplier and en route to central godam.',
    isSystemDefault: true
  },
  {
    id: 'stat-proc-03',
    name: 'In-Stock / Inwarded',
    code: 'IN_STOCK',
    domain: 'Procurement',
    colorBadge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'Lot verified, QC cleared, and received into warehouse bins.',
    isSystemDefault: true
  },
  {
    id: 'stat-proc-04',
    name: 'QC Rejected',
    code: 'QC_REJECTED',
    domain: 'Procurement',
    colorBadge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    description: 'Consignment failed incoming quality inspection; marked for supplier return.',
    isSystemDefault: false
  },

  // Inventory & Stock Domain
  {
    id: 'stat-inv-01',
    name: 'Healthy Stock',
    code: 'HEALTHY',
    domain: 'Inventory & Stock',
    colorBadge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'Inventory levels above configured safety buffer thresholds.',
    isSystemDefault: true
  },
  {
    id: 'stat-inv-02',
    name: 'Low Stock Alert',
    code: 'LOW_STOCK',
    domain: 'Inventory & Stock',
    colorBadge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    description: 'Stock level at or below minimum threshold; reorder recommended.',
    isSystemDefault: true
  },
  {
    id: 'stat-inv-03',
    name: 'Damaged / Quarantined',
    code: 'DAMAGED',
    domain: 'Inventory & Stock',
    colorBadge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    description: 'Broken or water-damaged units segregated from sellable inventory.',
    isSystemDefault: true
  },

  // Accounts & Partners Domain
  {
    id: 'stat-acc-01',
    name: 'Active & Verified',
    code: 'ACTIVE',
    domain: 'Partner Accounts',
    colorBadge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'KYC verified partner with active trade and commission eligibility.',
    isSystemDefault: true
  },
  {
    id: 'stat-acc-02',
    name: 'Pending KYC Review',
    code: 'PENDING_KYC',
    domain: 'Partner Accounts',
    colorBadge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    description: 'GSTIN, PAN, and trade license awaiting admin compliance clearance.',
    isSystemDefault: true
  },
  {
    id: 'stat-acc-03',
    name: 'Suspended / Hold',
    code: 'SUSPENDED',
    domain: 'Partner Accounts',
    colorBadge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    description: 'Account frozen due to overdue payment or contractual review.',
    isSystemDefault: false
  }
]

export const STATUS_DOMAINS = [
  'All Domains',
  'Sales & Orders',
  'Payments',
  'Procurement',
  'Inventory & Stock',
  'Partner Accounts'
]

export const COLOR_OPTIONS = [
  { label: 'Emerald (Green / Success)', value: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { label: 'Blue (Info / In-Process)', value: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { label: 'Indigo (Primary / PO)', value: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  { label: 'Amber (Warning / Pending)', value: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  { label: 'Rose (Danger / Void / Rejected)', value: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  { label: 'Purple (Dispatched / Special)', value: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  { label: 'Cyan (Refund / Alt)', value: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  { label: 'Slate (Draft / Neutral)', value: 'bg-slate-500/15 text-slate-400 border-slate-500/30' }
]

export const useMasterStore = create(
  persist(
    (set, get) => ({
      units: INITIAL_UNITS,
      statuses: INITIAL_STATUSES,

      // Units CRUD (Super Admin)
      addUnit: (unitData) => {
        const newUnit = {
          id: `uom-${Date.now()}`,
          status: 'Active',
          isDecimalAllowed: false,
          ...unitData,
          code: unitData.code.toUpperCase().trim()
        }
        set((state) => ({ units: [newUnit, ...state.units] }))
        return newUnit
      },

      updateUnit: (id, unitData) => {
        set((state) => ({
          units: state.units.map(u =>
            u.id === id
              ? { ...u, ...unitData, code: (unitData.code || u.code).toUpperCase().trim() }
              : u
          )
        }))
      },

      deleteUnit: (id) => {
        set((state) => ({
          units: state.units.filter(u => u.id !== id)
        }))
      },

      // Statuses CRUD (Super Admin)
      addStatus: (statusData) => {
        const newStatus = {
          id: `stat-${Date.now()}`,
          isSystemDefault: false,
          ...statusData,
          code: statusData.code.toUpperCase().trim()
        }
        set((state) => ({ statuses: [newStatus, ...state.statuses] }))
        return newStatus
      },

      updateStatus: (id, statusData) => {
        set((state) => ({
          statuses: state.statuses.map(s =>
            s.id === id
              ? { ...s, ...statusData, code: (statusData.code || s.code).toUpperCase().trim() }
              : s
          )
        }))
      },

      deleteStatus: (id) => {
        set((state) => ({
          statuses: state.statuses.filter(s => s.id !== id)
        }))
      },

      // Helper getters
      getStatusesByDomain: (domain) => {
        const all = get().statuses
        if (!domain || domain === 'All Domains') return all
        return all.filter(s => s.domain === domain)
      }
    }),
    {
      name: 'fillfree_master_config',
      partialize: (state) => ({
        units: state.units,
        statuses: state.statuses
      })
    }
  )
)
