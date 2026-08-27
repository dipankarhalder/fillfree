import { create } from 'zustand'

const INITIAL_LOTS = [
  {
    lotId: 'lot-8801',
    lotName: 'LOT-202608-8801', // Auto-generated read-only
    supplierId: 'part-sup-01',
    supplierName: 'Apex Microelectronics Ltd.',
    purchaseDate: '2026-08-20T10:00:00Z',
    invoiceNumber: 'INV-APEX-9921',
    warehouseId: 'wh-01',
    warehouseName: 'Dankuni Logistics Godam',
    totalItems: 400,
    subtotal: 7400000,
    taxAmount: 1332000, // 18% GST
    totalAmount: 8732000,
    status: 'In-Stock', // In-Stock, Processing, Sold-Out
    items: [
      { productId: 'prod-01', productName: 'Smart LED Monitor 27"', quantity: 200, unitPrice: 18500 },
      { productId: 'prod-06', productName: 'High-Speed Wireless Router AX3000', quantity: 200, unitPrice: 4500 }
    ]
  },
  {
    lotId: 'lot-8802',
    lotName: 'LOT-202608-8802',
    supplierId: 'part-sup-02',
    supplierName: 'Global Polymers & Tech Inc.',
    purchaseDate: '2026-08-12T15:45:00Z',
    invoiceNumber: 'INV-GPT-4410',
    warehouseId: 'wh-02',
    warehouseName: 'Taratala Cargo Bhandar',
    totalItems: 500,
    subtotal: 600000,
    taxAmount: 108000,
    totalAmount: 708000,
    status: 'In-Stock',
    items: [
      { productId: 'prod-04', productName: 'Organic Thermal Lubricant 500ml', quantity: 500, unitPrice: 1200 }
    ]
  }
]

const INITIAL_SALES = [
  {
    orderId: 'ORD-98412',
    customerId: 'part-deal-01',
    customerName: 'TechVision Retail Pvt Ltd (Dealer)',
    customerType: 'Dealer',
    saleDate: '2026-08-26T11:20:00Z',
    warehouseId: 'wh-01',
    warehouseName: 'Dankuni Logistics Godam',
    lotId: 'lot-8801',
    lotName: 'LOT-202608-8801',
    subtotal: 185000,
    taxRate: 18,
    taxAmount: 33300,
    couponCode: 'FEAST10',
    discountAmount: 18500,
    finalTotal: 199800,
    paymentStatus: 'Paid', // Paid, Pending, Partial
    paymentMethod: 'Bank Wire / RTGS',
    items: [
      { productId: 'prod-01', productName: 'Smart LED Monitor 27"', quantity: 10, unitPrice: 18500, lineTotal: 185000 }
    ]
  },
  {
    orderId: 'ORD-98413',
    customerId: 'part-ws-01',
    customerName: 'Eastern Wholesale Traders (Wholesaler)',
    customerType: 'whole_saler',
    saleDate: '2026-08-25T16:00:00Z',
    warehouseId: 'wh-01',
    warehouseName: 'Dankuni Logistics Godam',
    lotId: 'lot-8801',
    lotName: 'LOT-202608-8801',
    subtotal: 90000,
    taxRate: 18,
    taxAmount: 16200,
    couponCode: 'BULK5',
    discountAmount: 4500,
    finalTotal: 101700,
    paymentStatus: 'Pending',
    paymentMethod: 'Net 30 Credit Line',
    items: [
      { productId: 'prod-06', productName: 'High-Speed Wireless Router AX3000', quantity: 20, unitPrice: 4500, lineTotal: 90000 }
    ]
  }
]

export function generateAutoLotName() {
  const now = new Date()
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `LOT-${yearMonth}-${randomSuffix}`
}

export const useBillingStore = create((set, get) => ({
  lotPurchases: INITIAL_LOTS,
  salesOrders: INITIAL_SALES,

  // LOT CREATE
  addLotPurchase: (lotData) => {
    const autoLotName = generateAutoLotName()
    const newLot = {
      lotId: `lot-${Date.now()}`,
      lotName: autoLotName, // Locked rule #6
      purchaseDate: new Date().toISOString(),
      status: 'In-Stock',
      ...lotData
    }
    set((state) => ({
      lotPurchases: [newLot, ...state.lotPurchases]
    }))
    return autoLotName
  },

  // LOT UPDATE
  updateLotPurchase: (lotId, updatedData) => {
    set((state) => ({
      lotPurchases: state.lotPurchases.map(lot => {
        if (lot.lotId === lotId) {
          // lotName remains locked!
          const { lotName, ...safeUpdates } = updatedData
          return { ...lot, ...safeUpdates }
        }
        return lot
      })
    }))
  },

  // LOT DELETE
  deleteLotPurchase: (lotId) => {
    set((state) => ({
      lotPurchases: state.lotPurchases.filter(l => l.lotId !== lotId)
    }))
  },

  // SALES CREATE
  createSalesOrder: (saleData) => {
    const newOrder = {
      orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      saleDate: new Date().toISOString(),
      paymentStatus: 'Paid',
      ...saleData
    }
    set((state) => ({
      salesOrders: [newOrder, ...state.salesOrders]
    }))
    return newOrder.orderId
  },

  // SALES UPDATE
  updateSalesOrder: (orderId, updatedFields) => {
    set((state) => ({
      salesOrders: state.salesOrders.map(s => s.orderId === orderId ? { ...s, ...updatedFields } : s)
    }))
  },

  updateSalePaymentStatus: (orderId, newStatus) => {
    set((state) => ({
      salesOrders: state.salesOrders.map(s => s.orderId === orderId ? { ...s, paymentStatus: newStatus } : s)
    }))
  },

  // SALES DELETE
  deleteSalesOrder: (orderId) => {
    set((state) => ({
      salesOrders: state.salesOrders.filter(s => s.orderId !== orderId)
    }))
  }
}))
