import { create } from 'zustand'

const INITIAL_WAREHOUSES = [
  {
    id: 'wh-01',
    name: 'Dankuni Logistics Godam',
    code: 'WH-KOL-01',
    location: 'Dankuni Freight Complex, Hooghly',
    city: 'Kolkata',
    state: 'West Bengal',
    zipCode: '712311',
    totalCapacity: 100000, // units
    occupiedCapacity: 74500,
    managerId: 'usr-102',
    managerName: 'Debabrata Banerjee',
    managerPhone: '+91 98301 11223',
    staffIds: ['usr-103', 'usr-104', 'usr-105'],
    staffCount: 18,
    rooms: [
      {
        id: 'room-a',
        name: 'Room A - Cold Storage Electronics',
        temperature: '18°C',
        rows: [
          { id: 'row-a1', name: 'Row 01', shelves: ['Shelf A1-1', 'Shelf A1-2', 'Shelf A1-3', 'Shelf A1-4'] },
          { id: 'row-a2', name: 'Row 02', shelves: ['Shelf A2-1', 'Shelf A2-2', 'Shelf A2-3'] },
        ]
      },
      {
        id: 'room-b',
        name: 'Room B - General Bulk Storage',
        temperature: 'Ambient',
        rows: [
          { id: 'row-b1', name: 'Row B1', shelves: ['Shelf B1-1', 'Shelf B1-2', 'Shelf B1-3', 'Shelf B1-4', 'Shelf B1-5'] },
          { id: 'row-b2', name: 'Row B2', shelves: ['Shelf B2-1', 'Shelf B2-2', 'Shelf B2-3'] }
        ]
      }
    ]
  },
  {
    id: 'wh-02',
    name: 'Taratala Cargo Bhandar',
    code: 'WH-KOL-02',
    location: 'Taratala Industrial Estate, Port Area',
    city: 'Kolkata',
    state: 'West Bengal',
    zipCode: '700088',
    totalCapacity: 85000,
    occupiedCapacity: 52000,
    managerId: 'usr-106',
    managerName: 'Sarmistha Chakraborty',
    managerPhone: '+91 98200 44332',
    staffIds: ['usr-107', 'usr-108'],
    staffCount: 14,
    rooms: [
      {
        id: 'room-w1',
        name: 'Room W1 - Fast Moving Consumer Goods',
        temperature: 'Ambient',
        rows: [
          { id: 'row-w1-1', name: 'Row 101', shelves: ['Cell W1-A', 'Cell W1-B', 'Cell W1-C'] },
          { id: 'row-w1-2', name: 'Row 102', shelves: ['Cell W2-A', 'Cell W2-B'] }
        ]
      }
    ]
  },
  {
    id: 'wh-03',
    name: 'Dhulagarh Freight Warehouse',
    code: 'WH-HOW-03',
    location: 'Dhulagarh Logistics Hub, Howrah',
    city: 'Howrah / Kolkata',
    state: 'West Bengal',
    zipCode: '711302',
    totalCapacity: 60000,
    occupiedCapacity: 48900,
    managerId: 'usr-109',
    managerName: 'Anirban Ghosh',
    managerPhone: '+91 99001 55667',
    staffIds: ['usr-110'],
    staffCount: 10,
    rooms: [
      {
        id: 'room-s1',
        name: 'Room S1 - High Security Value Items',
        temperature: 'Controlled 22°C',
        rows: [
          { id: 'row-s1-1', name: 'Row S-Alpha', shelves: ['Vault-01', 'Vault-02', 'Vault-03'] }
        ]
      }
    ]
  }
]

export const useWarehouseStore = create((set, get) => ({
  warehouses: INITIAL_WAREHOUSES,
  selectedWarehouseId: 'wh-01',

  selectWarehouse: (id) => set({ selectedWarehouseId: id }),

  // CREATE
  addWarehouse: (warehouseData) => {
    const newWh = {
      id: `wh-${Date.now()}`,
      code: `WH-${(warehouseData.city || 'KOL').substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      occupiedCapacity: 0,
      staffIds: [],
      staffCount: 0,
      rooms: [
        {
          id: 'room-1',
          name: 'Main Storage Room',
          temperature: 'Ambient',
          rows: [
            { id: 'row-1', name: 'Row 01', shelves: ['Shelf 1', 'Shelf 2', 'Shelf 3', 'Shelf 4'] }
          ]
        }
      ],
      ...warehouseData
    }
    set((state) => ({ warehouses: [...state.warehouses, newWh] }))
  },

  // UPDATE
  updateWarehouse: (id, updatedFields) => {
    set((state) => ({
      warehouses: state.warehouses.map(w => w.id === id ? { ...w, ...updatedFields } : w)
    }))
  },

  // DELETE
  deleteWarehouse: (id) => {
    set((state) => {
      const remaining = state.warehouses.filter(w => w.id !== id)
      return {
        warehouses: remaining,
        selectedWarehouseId: remaining[0]?.id || ''
      }
    })
  },

  assignStaffToWarehouse: (warehouseId, staffId) => {
    set((state) => ({
      warehouses: state.warehouses.map(w => {
        if (w.id === warehouseId) {
          const updatedStaff = Array.from(new Set([...w.staffIds, staffId]))
          return { ...w, staffIds: updatedStaff, staffCount: updatedStaff.length }
        }
        return w
      })
    }))
  }
}))
