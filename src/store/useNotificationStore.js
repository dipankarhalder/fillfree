import { create } from 'zustand'

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Low Stock Alert',
    message: 'Lithium Storage Cell Packs 12V is running low (85 units remaining in Dhulagarh Freight Warehouse).',
    type: 'stock', // 'stock' | 'lot' | 'order' | 'security'
    category: 'Inventory',
    date: '2026-08-27T05:10:00Z',
    isRead: false,
    link: '/products'
  },
  {
    id: 'notif-2',
    title: 'New Purchase Lot Arrival',
    message: 'Supplier Lot LOT-202608-8801 has been received and stored in Dankuni Logistics Godam.',
    type: 'lot',
    category: 'Billing',
    date: '2026-08-26T14:30:00Z',
    isRead: false,
    link: '/billing'
  },
  {
    id: 'notif-3',
    title: 'Stock Damage Incident Reported',
    message: 'Debabrata Banerjee reported 3 damaged units of Smart LED Monitor 27" due to water leakage.',
    type: 'stock',
    category: 'Loss Audit',
    date: '2026-08-25T11:20:00Z',
    isRead: true,
    link: '/stock-loss'
  },
  {
    id: 'notif-4',
    title: 'High Volume Sales Order Paid',
    message: 'Order ORD-98412 from TechVision Retail (Dealer) of ₹1,99,800 has been marked as Paid.',
    type: 'order',
    category: 'Sales',
    date: '2026-08-24T16:45:00Z',
    isRead: true,
    link: '/billing'
  },
  {
    id: 'notif-5',
    title: 'New Device Session Detected',
    message: 'New login detected on Chrome Browser (Windows 11) from IP 49.36.192.88.',
    type: 'security',
    category: 'Security',
    date: '2026-08-24T09:45:00Z',
    isRead: true,
    link: '/profile'
  }
]

export const useNotificationStore = create((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    }))
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true }))
    }))
  },

  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },

  clearAll: () => {
    set({ notifications: [] })
  },

  getUnreadCount: () => {
    return get().notifications.filter(n => !n.isRead).length
  }
}))
