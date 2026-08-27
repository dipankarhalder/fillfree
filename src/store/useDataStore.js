import { create } from 'zustand'

const INITIAL_CATEGORIES = [
  {
    id: 'cat-01',
    name: 'Electronics & Hardware',
    subcategories: ['Monitors & Displays', 'Networking Gear', 'Power Storage']
  },
  {
    id: 'cat-02',
    name: 'Chemicals & Lubricants',
    subcategories: ['Thermal Solutions', 'Industrial Solvents']
  },
  {
    id: 'cat-03',
    name: 'Office & Industrial Supplies',
    subcategories: ['Packing & Boxes', 'Safety Gear']
  }
]

const INITIAL_PRODUCTS = [
  {
    id: 'prod-01',
    name: 'Smart LED Monitor 27"',
    sku: 'ELE-MON-2701',
    category: 'Electronics & Hardware',
    subcategory: 'Monitors & Displays',
    price: 18500,
    mrp: 22000,
    totalStockReceived: 25,
    goodQty: 20,
    damagedCount: 3,
    expiredCount: 2,
    quantity: 20, // Good sellable stock
    minQuantityThreshold: 5,
    warehouseId: 'wh-01',
    warehouseName: 'Dankuni Logistics Godam',
    roomName: 'Room A - Cold Storage Electronics',
    rowName: 'Row 01',
    shelfName: 'Shelf A1-2',
    lotCode: 'LOT-202608-8801',
    eligibleCoupon: 'FEAST10',
    description: '4K UHD IPS panel monitor with USB-C hub and ergonomic stand.'
  },
  {
    id: 'prod-04',
    name: 'Organic Thermal Lubricant 500ml',
    sku: 'CHEM-LUB-05',
    category: 'Chemicals & Lubricants',
    subcategory: 'Thermal Solutions',
    price: 1200,
    mrp: 1500,
    totalStockReceived: 500,
    goodQty: 475,
    damagedCount: 0,
    expiredCount: 25,
    quantity: 475,
    minQuantityThreshold: 50,
    warehouseId: 'wh-02',
    warehouseName: 'Taratala Cargo Bhandar',
    roomName: 'Room W1 - Fast Moving Consumer Goods',
    rowName: 'Row 101',
    shelfName: 'Cell W1-A',
    lotCode: 'LOT-202608-8802',
    eligibleCoupon: 'BULK5',
    description: 'High performance non-conductive thermal paste for CPU/GPU cooling assemblies.'
  },
  {
    id: 'prod-06',
    name: 'High-Speed Wireless Router AX3000',
    sku: 'NET-RTR-3000',
    category: 'Electronics & Hardware',
    subcategory: 'Networking Gear',
    price: 4500,
    mrp: 5999,
    totalStockReceived: 180,
    goodQty: 170,
    damagedCount: 10,
    expiredCount: 0,
    quantity: 170,
    minQuantityThreshold: 15,
    warehouseId: 'wh-01',
    warehouseName: 'Dankuni Logistics Godam',
    roomName: 'Room A - Cold Storage Electronics',
    rowName: 'Row 02',
    shelfName: 'Shelf A2-1',
    lotCode: 'LOT-202608-8801',
    eligibleCoupon: 'NETSAVER',
    description: 'Dual-band Wi-Fi 6 router with 4 gigabit LAN ports and mesh capability.'
  },
  {
    id: 'prod-08',
    name: 'Lithium Storage Cell Packs 12V',
    sku: 'BAT-LITH-12V',
    category: 'Electronics & Hardware',
    subcategory: 'Power Storage',
    price: 8200,
    mrp: 10500,
    totalStockReceived: 100,
    goodQty: 85,
    damagedCount: 0,
    expiredCount: 15,
    quantity: 85,
    minQuantityThreshold: 10,
    warehouseId: 'wh-03',
    warehouseName: 'Dhulagarh Freight Warehouse',
    roomName: 'Room S1 - High Security Value Items',
    rowName: 'Row S-Alpha',
    shelfName: 'Vault-01',
    lotCode: 'LOT-202605-1102',
    eligibleCoupon: 'POWER20',
    description: 'Deep cycle LiFePO4 battery pack with internal BMS for backup power.'
  }
]

const INITIAL_PARTNERS = [
  {
    id: 'part-deal-01',
    role: 'Dealer',
    businessName: 'TechVision Retail Pvt Ltd',
    contactPerson: 'Sanjay Dutt',
    email: 'sanjay@techvision.in',
    phone: '+91 98312 99887',
    gstin: '19AAACT1234A1Z5',
    personalDetails: {
      ownerName: 'Sanjay Dutt',
      mobile: '+91 98312 99887',
      altEmail: 'accounts@techvision.in',
      registrationDate: '2023-04-12'
    },
    locationDetails: {
      street: '14 Park Street, Commercial Block 4B',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700016',
      country: 'India',
      coordinates: '22.5532° N, 88.3524° E'
    },
    purchaseDetails: {
      totalOrders: 42,
      totalSpent: 4850000,
      lastOrderDate: '2026-08-26',
      favoriteCategory: 'Electronics & Hardware'
    },
    billingDetails: {
      creditLimit: 1000000,
      outstandingBalance: 199800,
      paymentTerms: 'Net 15 Days',
      bankName: 'HDFC Bank (Salt Lake Branch)',
      accountNumber: '50200084920192'
    }
  },
  {
    id: 'part-sup-01',
    role: 'Suppliers',
    businessName: 'Apex Microelectronics Ltd.',
    contactPerson: 'Karan Mehra',
    email: 'karan@apexmicro.com',
    phone: '+91 98100 55443',
    gstin: '27AABCA9988B1Z2',
    personalDetails: {
      ownerName: 'Apex Micro Board Directors',
      mobile: '+91 98100 55443',
      altEmail: 'orders@apexmicro.com',
      registrationDate: '2022-01-10'
    },
    locationDetails: {
      street: 'Plot 88, MIDC Industrial Zone',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411018',
      country: 'India',
      coordinates: '18.5204° N, 73.8567° E'
    },
    purchaseDetails: {
      totalLotsSupplied: 18,
      totalValueSupplied: 24500000,
      lastSupplyDate: '2026-08-20',
      rating: '4.9 / 5.0'
    },
    billingDetails: {
      creditLimit: 5000000,
      outstandingBalance: 0,
      paymentTerms: 'Immediate / RTGS',
      bankName: 'ICICI Bank',
      accountNumber: '000405099812'
    }
  },
  {
    id: 'part-ws-01',
    role: 'whole_saler',
    businessName: 'Eastern Wholesale Traders',
    contactPerson: 'Amitabh Roy',
    email: 'roy@easternwholesale.co.in',
    phone: '+91 94330 12345',
    gstin: '19BBBEW5544C1Z9',
    personalDetails: {
      ownerName: 'Amitabh Roy & Sons',
      mobile: '+91 94330 12345',
      altEmail: 'billing@easternwholesale.co.in',
      registrationDate: '2021-11-05'
    },
    locationDetails: {
      street: '88 Burrabazar Wholesale Hub',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700007',
      country: 'India',
      coordinates: '22.5855° N, 88.3541° E'
    },
    purchaseDetails: {
      totalOrders: 95,
      totalSpent: 12400000,
      lastOrderDate: '2026-08-25',
      favoriteCategory: 'Electronics & Hardware'
    },
    billingDetails: {
      creditLimit: 2500000,
      outstandingBalance: 101700,
      paymentTerms: 'Net 30 Days',
      bankName: 'Axis Bank',
      accountNumber: '912010049281928'
    }
  },
  {
    id: 'part-shop-01',
    role: 'shop_saler',
    businessName: 'Metro Cyber Corner Shop',
    contactPerson: 'Vikram Singh',
    email: 'vikram@metrocyber.com',
    phone: '+91 97110 88221',
    gstin: '07CCCSS1122D1Z0',
    personalDetails: {
      ownerName: 'Vikram Singh',
      mobile: '+91 97110 88221',
      altEmail: 'sales@metrocyber.com',
      registrationDate: '2023-09-20'
    },
    locationDetails: {
      street: 'Shop 12, Nehru Place Computer Market',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110019',
      country: 'India',
      coordinates: '28.5494° N, 77.2517° E'
    },
    purchaseDetails: {
      totalOrders: 18,
      totalSpent: 850000,
      lastOrderDate: '2026-08-10',
      favoriteCategory: 'Networking Gear'
    },
    billingDetails: {
      creditLimit: 300000,
      outstandingBalance: 0,
      paymentTerms: 'Prepaid / UPI',
      bankName: 'State Bank of India',
      accountNumber: '30991827491'
    }
  }
]

const INITIAL_PERSONNEL = [
  {
    id: 'usr-101',
    role: 'Admin',
    name: 'Ananya Sen',
    email: 'ananya@fillfree.com',
    phone: '+91 98300 77665',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    personalDetails: {
      dob: '1992-06-14',
      gender: 'Female',
      emergencyContact: 'Subhash Sen (+91 98300 11223)',
      joinDate: '2023-02-01'
    },
    locationDetails: {
      address: 'Salt Lake City, Sector 3',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700098',
      branchOffice: 'Kolkata HQ - Salt Lake'
    },
    salaryDetails: {
      baseSalary: 120000, // per month
      allowances: 25000,
      pfDeduction: 7200,
      netSalary: 137800,
      payFrequency: 'Monthly',
      lastPaidDate: '2026-08-01',
      bankAccount: 'Kotak Bank - 4409123891'
    },
    assignedWarehouseId: 'wh-01',
    assignedWarehouseName: 'Dankuni Logistics Godam'
  },
  {
    id: 'usr-102',
    role: 'member_stuff',
    name: 'Debabrata Banerjee',
    email: 'debabrata.b@fillfree.com',
    phone: '+91 98301 11223',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    personalDetails: {
      dob: '1988-11-22',
      gender: 'Male',
      emergencyContact: 'Suhasini Banerjee (+91 98301 99887)',
      joinDate: '2023-05-15'
    },
    locationDetails: {
      address: 'Dankuni Station Road',
      city: 'Hooghly / Kolkata',
      state: 'West Bengal',
      pincode: '712311',
      branchOffice: 'Dankuni Logistics Godam'
    },
    salaryDetails: {
      baseSalary: 65000,
      allowances: 12000,
      pfDeduction: 3900,
      netSalary: 73100,
      payFrequency: 'Monthly',
      lastPaidDate: '2026-08-01',
      bankAccount: 'HDFC Bank - 5010091827'
    },
    assignedWarehouseId: 'wh-01',
    assignedWarehouseName: 'Dankuni Logistics Godam (Manager)'
  },
  {
    id: 'usr-106',
    role: 'member_stuff',
    name: 'Sarmistha Chakraborty',
    email: 'sarmistha.c@fillfree.com',
    phone: '+91 98200 44332',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    personalDetails: {
      dob: '1994-03-10',
      gender: 'Female',
      emergencyContact: 'Aritra Chakraborty (+91 98200 99001)',
      joinDate: '2024-01-10'
    },
    locationDetails: {
      address: 'Taratala Industrial Area',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700088',
      branchOffice: 'Taratala Cargo Bhandar'
    },
    salaryDetails: {
      baseSalary: 70000,
      allowances: 15000,
      pfDeduction: 4200,
      netSalary: 80800,
      payFrequency: 'Monthly',
      lastPaidDate: '2026-08-01',
      bankAccount: 'ICICI Bank - 0021059918'
    },
    assignedWarehouseId: 'wh-02',
    assignedWarehouseName: 'Taratala Cargo Bhandar (Manager)'
  }
]

const INITIAL_COUPONS = [
  {
    id: 'coup-01',
    code: 'FEAST10',
    discountType: 'percentage', // percentage | fixed
    value: 10, // 10%
    minOrderAmount: 10000,
    maxDiscountAmount: 20000,
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    usageLimit: 500,
    usageCount: 142,
    status: 'Active',
    description: 'Get 10% instant discount on bulk electronic orders above ₹10,000.'
  },
  {
    id: 'coup-02',
    code: 'BULK5',
    discountType: 'percentage',
    value: 5,
    minOrderAmount: 50000,
    maxDiscountAmount: 50000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 1000,
    usageCount: 389,
    status: 'Active',
    description: 'Special 5% wholesaler incentive on high volume lot sales.'
  },
  {
    id: 'coup-03',
    code: 'FLAT5000',
    discountType: 'fixed',
    value: 5000,
    minOrderAmount: 100000,
    maxDiscountAmount: 5000,
    startDate: '2026-08-15',
    endDate: '2026-09-15',
    usageLimit: 100,
    usageCount: 45,
    status: 'Active',
    description: 'Flat ₹5,000 discount on orders exceeding ₹1,00,000 total invoice value.'
  }
]

export const useDataStore = create((set, get) => ({
  categories: INITIAL_CATEGORIES,
  products: INITIAL_PRODUCTS,
  partners: INITIAL_PARTNERS,
  personnel: INITIAL_PERSONNEL,
  coupons: INITIAL_COUPONS,

  // Products CRUD
  addProduct: (product) => {
    const newProd = {
      id: `prod-${Date.now()}`,
      damagedCount: 0,
      expiredCount: 0,
      ...product
    }
    set((state) => ({ products: [newProd, ...state.products] }))
  },
  updateProduct: (id, data) => {
    set((state) => ({
      products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
    }))
  },
  deleteProduct: (id) => {
    set((state) => ({ products: state.products.filter(p => p.id !== id) }))
  },

  // Partners CRUD
  addPartner: (partner) => {
    const newPart = {
      id: `part-${Date.now()}`,
      ...partner
    }
    set((state) => ({ partners: [newPart, ...state.partners] }))
  },
  updatePartner: (id, data) => {
    set((state) => ({
      partners: state.partners.map(p => p.id === id ? { ...p, ...data } : p)
    }))
  },
  deletePartner: (id) => {
    set((state) => ({ partners: state.partners.filter(p => p.id !== id) }))
  },

  // Personnel CRUD
  addPersonnel: (staff) => {
    const newStaff = {
      id: `usr-${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      ...staff
    }
    set((state) => ({ personnel: [newStaff, ...state.personnel] }))
  },
  updatePersonnel: (id, data) => {
    set((state) => ({
      personnel: state.personnel.map(p => p.id === id ? { ...p, ...data } : p)
    }))
  },
  deletePersonnel: (id) => {
    set((state) => ({ personnel: state.personnel.filter(p => p.id !== id) }))
  },

  // Categories & Subcategories CRUD
  addCategory: (categoryData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      subcategories: categoryData.subcategories || [],
      description: categoryData.description || '',
      createdDate: new Date().toISOString().split('T')[0],
      ...categoryData
    }
    set((state) => ({ categories: [...state.categories, newCat] }))
  },
  updateCategory: (id, data) => {
    set((state) => ({
      categories: state.categories.map(c => c.id === id ? { ...c, ...data } : c)
    }))
  },
  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter(c => c.id !== id)
    }))
  },
  addSubcategory: (categoryId, subcategoryName) => {
    set((state) => ({
      categories: state.categories.map(c => {
        if (c.id === categoryId) {
          if (c.subcategories.includes(subcategoryName)) return c
          return { ...c, subcategories: [...c.subcategories, subcategoryName] }
        }
        return c
      })
    }))
  },
  deleteSubcategory: (categoryId, subcategoryName) => {
    set((state) => ({
      categories: state.categories.map(c => {
        if (c.id === categoryId) {
          return { ...c, subcategories: c.subcategories.filter(s => s !== subcategoryName) }
        }
        return c
      })
    }))
  },

  // Coupons CRUD
  addCoupon: (coupon) => {
    const newCoupon = {
      id: `coup-${Date.now()}`,
      usageCount: 0,
      status: 'Active',
      ...coupon
    }
    set((state) => ({ coupons: [newCoupon, ...state.coupons] }))
  },
  updateCoupon: (id, data) => {
    set((state) => ({
      coupons: state.coupons.map(c => c.id === id ? { ...c, ...data } : c)
    }))
  },
  deleteCoupon: (id) => {
    set((state) => ({ coupons: state.coupons.filter(c => c.id !== id) }))
  }
}))
