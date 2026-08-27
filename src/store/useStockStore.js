import { create } from 'zustand'

const INITIAL_LOSS_RECORDS = [
  {
    id: 'loss-101',
    productId: 'prod-01',
    productName: 'Smart LED Monitor 27"',
    sku: 'ELE-MON-2701',
    type: 'Damaged', // 'Damaged' | 'Expired'
    quantity: 3,
    unitCost: 18500,
    totalLoss: 55500,
    warehouseId: 'wh-01',
    warehouseName: 'Dankuni Logistics Godam',
    roomName: 'Room A - Cold Storage Electronics',
    rowName: 'Row 01',
    shelfName: 'Shelf A1-2',
    reason: 'Water leakage damage during transport from supplier lot',
    date: '2026-08-25T14:30:00Z',
    period: 'weekly',
    reportedBy: 'Debabrata Banerjee (Warehouse Manager)'
  },
  {
    id: 'loss-102',
    productId: 'prod-01',
    productName: 'Smart LED Monitor 27"',
    sku: 'ELE-MON-2701',
    type: 'Expired',
    quantity: 2,
    unitCost: 18500,
    totalLoss: 37000,
    warehouseId: 'wh-01',
    warehouseName: 'Dankuni Logistics Godam',
    roomName: 'Room A - Cold Storage Electronics',
    rowName: 'Row 01',
    shelfName: 'Shelf A1-2',
    reason: 'Exceeded shelf life expiry threshold',
    date: '2026-08-24T10:15:00Z',
    period: 'weekly',
    reportedBy: 'Debabrata Banerjee (Warehouse Manager)'
  },
  {
    id: 'loss-103',
    productId: 'prod-04',
    productName: 'Organic Thermal Lubricant 500ml',
    sku: 'CHEM-LUB-05',
    type: 'Expired',
    quantity: 25,
    unitCost: 1200,
    totalLoss: 30000,
    warehouseId: 'wh-02',
    warehouseName: 'Taratala Cargo Bhandar',
    roomName: 'Room W1 - Fast Moving Consumer Goods',
    rowName: 'Row 101',
    shelfName: 'Cell W1-A',
    reason: 'Exceeded shelf life expiry threshold date (EXP: 2026-08-15)',
    date: '2026-08-18T10:15:00Z',
    period: 'monthly',
    reportedBy: 'Sarmistha Chakraborty (Warehouse Manager)'
  },
  {
    id: 'loss-104',
    productId: 'prod-06',
    productName: 'High-Speed Wireless Router AX3000',
    sku: 'NET-RTR-3000',
    type: 'Damaged',
    quantity: 10,
    unitCost: 4500,
    totalLoss: 45000,
    warehouseId: 'wh-01',
    warehouseName: 'Dankuni Logistics Godam',
    roomName: 'Room A - Cold Storage Electronics',
    rowName: 'Row 02',
    shelfName: 'Shelf A2-1',
    reason: 'Forklift dropping incident during pallet unloading',
    date: '2026-07-12T11:00:00Z',
    period: 'yearly',
    reportedBy: 'Debabrata Banerjee (Warehouse Manager)'
  },
  {
    id: 'loss-105',
    productId: 'prod-08',
    productName: 'Lithium Storage Cell Packs 12V',
    sku: 'BAT-LITH-12V',
    type: 'Expired',
    quantity: 15,
    unitCost: 8200,
    totalLoss: 123000,
    warehouseId: 'wh-03',
    warehouseName: 'Dhulagarh Freight Warehouse',
    roomName: 'Room S1 - High Security Value Items',
    rowName: 'Row S-Alpha',
    shelfName: 'Vault-01',
    reason: 'Electrolyte degradation over time limit',
    date: '2026-05-04T09:20:00Z',
    period: 'yearly',
    reportedBy: 'Anirban Ghosh (Warehouse Manager)'
  }
]

export const useStockStore = create((set, get) => ({
  lossRecords: INITIAL_LOSS_RECORDS,

  // CREATE
  tagStockDamageOrExpiry: (data) => {
    const totalLoss = Number(data.quantity) * Number(data.unitCost)
    const newRecord = {
      id: `loss-${Date.now()}`,
      totalLoss,
      date: new Date().toISOString(),
      period: 'weekly',
      ...data
    }
    set((state) => ({
      lossRecords: [newRecord, ...state.lossRecords]
    }))
  },

  // UPDATE
  updateLossRecord: (id, updatedFields) => {
    set((state) => ({
      lossRecords: state.lossRecords.map(r => {
        if (r.id === id) {
          const qty = updatedFields.quantity !== undefined ? Number(updatedFields.quantity) : r.quantity
          const cost = updatedFields.unitCost !== undefined ? Number(updatedFields.unitCost) : r.unitCost
          return {
            ...r,
            ...updatedFields,
            quantity: qty,
            unitCost: cost,
            totalLoss: qty * cost
          }
        }
        return r
      })
    }))
  },

  // DELETE
  deleteLossRecord: (id) => {
    set((state) => ({
      lossRecords: state.lossRecords.filter(r => r.id !== id)
    }))
  },

  // CALCULATE STOCK BREAKDOWN (Formula: Total Stock = Good + Damaged + Expired)
  calculateStockBreakdown: (totalReceived, damagedQty, expiredQty) => {
    const goodQty = Math.max(0, Number(totalReceived) - (Number(damagedQty) + Number(expiredQty)))
    return {
      totalReceived: Number(totalReceived),
      goodQty,
      damagedQty: Number(damagedQty),
      expiredQty: Number(expiredQty)
    }
  },

  getLossAnalytics: () => {
    const records = get().lossRecords
    const now = new Date()

    // Helper for timeframe calculations
    const computePeriod = (filterFn, defaultSalesRevenue) => {
      const filtered = records.filter(filterFn)
      const damagedRecords = filtered.filter(r => r.type === 'Damaged')
      const expiredRecords = filtered.filter(r => r.type === 'Expired')

      const damagedQty = damagedRecords.reduce((sum, r) => sum + r.quantity, 0)
      const expiredQty = expiredRecords.reduce((sum, r) => sum + r.quantity, 0)

      const damagedLoss = damagedRecords.reduce((sum, r) => sum + r.totalLoss, 0)
      const expiredLoss = expiredRecords.reduce((sum, r) => sum + r.totalLoss, 0)
      const totalLoss = damagedLoss + expiredLoss

      const grossSalesRevenue = defaultSalesRevenue
      const netRevenue = Math.max(0, grossSalesRevenue - totalLoss)

      return {
        damagedQty,
        expiredQty,
        damagedLoss,
        expiredLoss,
        totalLoss,
        grossSalesRevenue,
        netRevenue,
        count: filtered.length
      }
    }

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const currentYear = now.getFullYear()

    return {
      weekly: computePeriod(r => new Date(r.date) >= sevenDaysAgo, 285000),
      monthly: computePeriod(r => new Date(r.date) >= thirtyDaysAgo, 950000),
      yearly: computePeriod(r => new Date(r.date).getFullYear() === currentYear, 4200000)
    }
  }
}))
