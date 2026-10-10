import { create } from 'zustand'

const INITIAL_RESALES = [
  {
    id: 'RS-2026-901',
    resaleRef: 'RES-TV-2026-441',
    resellerId: 'part-deal-01',
    resellerName: 'TechVision Retail Pvt Ltd',
    resellerRole: 'Dealer',
    primaryOrderId: 'ORD-98412',
    primaryOrderDate: '2026-08-26',
    lotCode: 'LOT-202608-8801',
    warehouseName: 'Dankuni Logistics Godam',
    productId: 'prod-01',
    productName: 'Smart LED Monitor 27"',
    sku: 'ELE-MON-2701',
    category: 'Electronics & Hardware',
    serialNumbers: ['SN-MN27-8801-01', 'SN-MN27-8801-02', 'SN-MN27-8801-03', 'SN-MN27-8801-04'],
    
    // Downstream Buyer (Where they resold)
    buyerName: 'Surojit Biswas',
    buyerBusinessName: 'Metro Infotech & Gaming Hub',
    buyerPhone: '+91 98322 11002',
    buyerEmail: 'metro.infotech.slg@gmail.com',
    buyerGstin: '19AAAFM8821B1Z4',
    channelType: 'Retail Store', // Retail Store, Sub-Dealer, Direct Consumer, Enterprise / Institutional, Contractor
    
    // Downstream Geolocation / Destination Address
    shopPremise: 'Shop 4, Bidhan Market Commercial Complex',
    streetAddress: 'Sevoke Road, Near Planet Mall',
    city: 'Siliguri',
    district: 'Darjeeling',
    state: 'West Bengal',
    pincode: '734001',
    territoryZone: 'North Bengal Hub',
    coordinates: '26.7271° N, 88.3953° E',
    
    // Financials & Margins
    quantity: 4,
    unitDealerCost: 18500, // Cost bought from FillFree
    unitResalePrice: 21500, // Price sold to downstream buyer
    subtotalResale: 86000,
    taxRate: 18,
    taxAmount: 15480,
    totalResaleAmount: 101480,
    unitMargin: 3000,
    totalMarginEarned: 12000,
    marginPercentage: 16.22,
    paymentMethod: 'UPI / Immediate Wire',
    paymentStatus: 'Settled', // Settled, Credit / Net 15, Partial
    
    // Delivery & Warranty Traceability
    resaleDate: '2026-08-28',
    deliveryStatus: 'Delivered & Verified', // Delivered & Verified, In-Transit, Pending Dispatch
    warrantyActivated: true,
    warrantyPeriodMonths: 36,
    warrantyExpiryDate: '2029-08-28',
    notes: 'Sold for specialized high-FPS competitive esports displays in North Bengal showroom.'
  },
  {
    id: 'RS-2026-902',
    resaleRef: 'RES-TV-2026-442',
    resellerId: 'part-deal-01',
    resellerName: 'TechVision Retail Pvt Ltd',
    resellerRole: 'Dealer',
    primaryOrderId: 'ORD-98412',
    primaryOrderDate: '2026-08-26',
    lotCode: 'LOT-202608-8801',
    warehouseName: 'Dankuni Logistics Godam',
    productId: 'prod-01',
    productName: 'Smart LED Monitor 27"',
    sku: 'ELE-MON-2701',
    category: 'Electronics & Hardware',
    serialNumbers: ['SN-MN27-8801-05', 'SN-MN27-8801-06', 'SN-MN27-8801-07'],
    
    buyerName: 'Rohan Sen',
    buyerBusinessName: 'Apex Graphic Design Studio',
    buyerPhone: '+91 98308 44556',
    buyerEmail: 'accounts@apexdesignstudio.co.in',
    buyerGstin: '19AAGCA9021K1ZN',
    channelType: 'Enterprise / Institutional',
    
    shopPremise: 'Unit 304, Tower 2, Godrej Genesis',
    streetAddress: 'Sector V, Salt Lake Electronics Complex',
    city: 'Kolkata',
    district: 'North 24 Parganas',
    state: 'West Bengal',
    pincode: '700091',
    territoryZone: 'Kolkata Tech Hub',
    coordinates: '22.5735° N, 88.4331° E',
    
    quantity: 3,
    unitDealerCost: 18500,
    unitResalePrice: 21800,
    subtotalResale: 65400,
    taxRate: 18,
    taxAmount: 11772,
    totalResaleAmount: 77172,
    unitMargin: 3300,
    totalMarginEarned: 9900,
    marginPercentage: 17.84,
    paymentMethod: 'Bank Wire / RTGS',
    paymentStatus: 'Settled',
    
    resaleDate: '2026-08-29',
    deliveryStatus: 'Delivered & Verified',
    warrantyActivated: true,
    warrantyPeriodMonths: 36,
    warrantyExpiryDate: '2029-08-29',
    notes: 'Color-calibrated monitors deployed for 3D CGI rendering workstations.'
  },
  {
    id: 'RS-2026-903',
    resaleRef: 'RES-EW-2026-118',
    resellerId: 'part-ws-01',
    resellerName: 'Eastern Wholesale Traders',
    resellerRole: 'whole_saler',
    primaryOrderId: 'ORD-98413',
    primaryOrderDate: '2026-08-25',
    lotCode: 'LOT-202608-8801',
    warehouseName: 'Dankuni Logistics Godam',
    productId: 'prod-06',
    productName: 'High-Speed Wireless Router AX3000',
    sku: 'NET-RTR-3000',
    category: 'Electronics & Hardware',
    serialNumbers: ['SN-RTR-8801-11', 'SN-RTR-8801-12', 'SN-RTR-8801-13', 'SN-RTR-8801-14', 'SN-RTR-8801-15', 'SN-RTR-8801-16', 'SN-RTR-8801-17', 'SN-RTR-8801-18'],
    
    buyerName: 'Prabir Banerjee',
    buyerBusinessName: 'Durgapur Cyber & Broadband Services',
    buyerPhone: '+91 94340 77119',
    buyerEmail: 'prabir@durgapurcyber.in',
    buyerGstin: '19BBBPB7712C1Z8',
    channelType: 'Sub-Dealer',
    
    shopPremise: 'Shop 18, Steel Market Commercial Plaza',
    streetAddress: 'Nachan Road, Benachity',
    city: 'Durgapur',
    district: 'Paschim Bardhaman',
    state: 'West Bengal',
    pincode: '713213',
    territoryZone: 'Industrial Corridor WB',
    coordinates: '23.5204° N, 87.3119° E',
    
    quantity: 8,
    unitDealerCost: 4500,
    unitResalePrice: 5400,
    subtotalResale: 43200,
    taxRate: 18,
    taxAmount: 7776,
    totalResaleAmount: 50976,
    unitMargin: 900,
    totalMarginEarned: 7200,
    marginPercentage: 20.0,
    paymentMethod: 'Net 15 Days Credit',
    paymentStatus: 'Settled',
    
    resaleDate: '2026-08-27',
    deliveryStatus: 'Delivered & Verified',
    warrantyActivated: true,
    warrantyPeriodMonths: 24,
    warrantyExpiryDate: '2028-08-27',
    notes: 'Supplied to local ISP provider for FTTH Gigabit broadband customer deployments.'
  },
  {
    id: 'RS-2026-904',
    resaleRef: 'RES-EW-2026-119',
    resellerId: 'part-ws-01',
    resellerName: 'Eastern Wholesale Traders',
    resellerRole: 'whole_saler',
    primaryOrderId: 'ORD-98413',
    primaryOrderDate: '2026-08-25',
    lotCode: 'LOT-202608-8801',
    warehouseName: 'Dankuni Logistics Godam',
    productId: 'prod-06',
    productName: 'High-Speed Wireless Router AX3000',
    sku: 'NET-RTR-3000',
    category: 'Electronics & Hardware',
    serialNumbers: ['SN-RTR-8801-21', 'SN-RTR-8801-22', 'SN-RTR-8801-23', 'SN-RTR-8801-24', 'SN-RTR-8801-25', 'SN-RTR-8801-26'],
    
    buyerName: 'Alok Kumar Sinha',
    buyerBusinessName: 'Patna Tech Solutions & Network',
    buyerPhone: '+91 94310 88223',
    buyerEmail: 'alok@patnatechsolutions.com',
    buyerGstin: '10AAAPS9901M1Z1',
    channelType: 'Sub-Dealer',
    
    shopPremise: 'Arcade Building, 2nd Floor, Shop 102',
    streetAddress: 'Boring Road Crossing',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    territoryZone: 'East Central Zone',
    coordinates: '25.5941° N, 85.1376° E',
    
    quantity: 6,
    unitDealerCost: 4500,
    unitResalePrice: 5300,
    subtotalResale: 31800,
    taxRate: 18,
    taxAmount: 5724,
    totalResaleAmount: 37524,
    unitMargin: 800,
    totalMarginEarned: 4800,
    marginPercentage: 17.78,
    paymentMethod: 'Bank Wire / RTGS',
    paymentStatus: 'Partial',
    
    resaleDate: '2026-08-28',
    deliveryStatus: 'In-Transit',
    warrantyActivated: false,
    warrantyPeriodMonths: 24,
    warrantyExpiryDate: null,
    notes: 'Interstate resale dispatched via BlueDart Surface Cargo to Patna market.'
  },
  {
    id: 'RS-2026-905',
    resaleRef: 'RES-MC-2026-089',
    resellerId: 'part-shop-01',
    resellerName: 'Metro Cyber Corner Shop',
    resellerRole: 'shop_saler',
    primaryOrderId: 'ORD-98412',
    primaryOrderDate: '2026-08-26',
    lotCode: 'LOT-202608-8801',
    warehouseName: 'Dankuni Logistics Godam',
    productId: 'prod-01',
    productName: 'Smart LED Monitor 27"',
    sku: 'ELE-MON-2701',
    category: 'Electronics & Hardware',
    serialNumbers: ['SN-MN27-8801-08'],
    
    buyerName: 'Anjali Verma',
    buyerBusinessName: 'Creative Freelance Workstation',
    buyerPhone: '+91 98110 55442',
    buyerEmail: 'anjali.v.creative@gmail.com',
    buyerGstin: 'N/A (B2C Retail)',
    channelType: 'Direct Consumer (B2C)',
    
    shopPremise: 'Flat 4B, Greenview Apartments',
    streetAddress: 'Block C, Lajpat Nagar Phase 2',
    city: 'New Delhi',
    district: 'South Delhi',
    state: 'Delhi',
    pincode: '110024',
    territoryZone: 'Northern Capital Hub',
    coordinates: '28.5677° N, 77.2433° E',
    
    quantity: 1,
    unitDealerCost: 18500,
    unitResalePrice: 22000,
    subtotalResale: 22000,
    taxRate: 18,
    taxAmount: 3960,
    totalResaleAmount: 25960,
    unitMargin: 3500,
    totalMarginEarned: 3500,
    marginPercentage: 18.92,
    paymentMethod: 'UPI / QR Settlement',
    paymentStatus: 'Settled',
    
    resaleDate: '2026-08-30',
    deliveryStatus: 'Delivered & Verified',
    warrantyActivated: true,
    warrantyPeriodMonths: 36,
    warrantyExpiryDate: '2029-08-30',
    notes: 'Direct counter retail sale to digital animator. B2C warranty successfully registered.'
  },
  {
    id: 'RS-2026-906',
    resaleRef: 'RES-EW-2026-120',
    resellerId: 'part-ws-01',
    resellerName: 'Eastern Wholesale Traders',
    resellerRole: 'whole_saler',
    primaryOrderId: 'ORD-98413',
    primaryOrderDate: '2026-08-25',
    lotCode: 'LOT-202608-8801',
    warehouseName: 'Dankuni Logistics Godam',
    productId: 'prod-06',
    productName: 'High-Speed Wireless Router AX3000',
    sku: 'NET-RTR-3000',
    category: 'Electronics & Hardware',
    serialNumbers: ['SN-RTR-8801-31', 'SN-RTR-8801-32', 'SN-RTR-8801-33', 'SN-RTR-8801-34', 'SN-RTR-8801-35'],
    
    buyerName: 'Tapan Ghosh',
    buyerBusinessName: 'Asansol Digital Junction',
    buyerPhone: '+91 94341 22990',
    buyerEmail: 'asansoldigital@rediffmail.com',
    buyerGstin: '19AAATG4412K1ZY',
    channelType: 'Retail Store',
    
    shopPremise: 'Ghosh Bhavan, Shop 2',
    streetAddress: 'GT Road, Near Asansol Junction Station',
    city: 'Asansol',
    district: 'Paschim Bardhaman',
    state: 'West Bengal',
    pincode: '713301',
    territoryZone: 'Industrial Corridor WB',
    coordinates: '23.6889° N, 86.9661° E',
    
    quantity: 5,
    unitDealerCost: 4500,
    unitResalePrice: 5450,
    subtotalResale: 27250,
    taxRate: 18,
    taxAmount: 4905,
    totalResaleAmount: 32155,
    unitMargin: 950,
    totalMarginEarned: 4750,
    marginPercentage: 21.11,
    paymentMethod: 'UPI / Immediate Wire',
    paymentStatus: 'Settled',
    
    resaleDate: '2026-08-31',
    deliveryStatus: 'Delivered & Verified',
    warrantyActivated: true,
    warrantyPeriodMonths: 24,
    warrantyExpiryDate: '2028-08-31',
    notes: 'Retail stock placement for student and small business Wi-Fi upgrades in Asansol.'
  },
  {
    id: 'RS-2026-907',
    resaleRef: 'RES-TV-2026-443',
    resellerId: 'part-deal-01',
    resellerName: 'TechVision Retail Pvt Ltd',
    resellerRole: 'Dealer',
    primaryOrderId: 'ORD-98412',
    primaryOrderDate: '2026-08-26',
    lotCode: 'LOT-202608-8801',
    warehouseName: 'Dankuni Logistics Godam',
    productId: 'prod-01',
    productName: 'Smart LED Monitor 27"',
    sku: 'ELE-MON-2701',
    category: 'Electronics & Hardware',
    serialNumbers: ['SN-MN27-8801-09', 'SN-MN27-8801-10'],
    
    buyerName: 'Dipak Saha',
    buyerBusinessName: 'Malda Tech Zone & Peripherals',
    buyerPhone: '+91 94348 33441',
    buyerEmail: 'maldazone@gmail.com',
    buyerGstin: '19AAKDS2201D1ZZ',
    channelType: 'Retail Store',
    
    shopPremise: 'Shop 11, Commercial Plaza',
    streetAddress: 'English Bazar Main Road',
    city: 'Malda',
    district: 'Malda',
    state: 'West Bengal',
    pincode: '732101',
    territoryZone: 'North Bengal Hub',
    coordinates: '25.0108° N, 88.1411° E',
    
    quantity: 2,
    unitDealerCost: 18500,
    unitResalePrice: 21600,
    subtotalResale: 43200,
    taxRate: 18,
    taxAmount: 7776,
    totalResaleAmount: 50976,
    unitMargin: 3100,
    totalMarginEarned: 6200,
    marginPercentage: 16.76,
    paymentMethod: 'Bank Wire / RTGS',
    paymentStatus: 'Settled',
    
    resaleDate: '2026-09-02',
    deliveryStatus: 'Delivered & Verified',
    warrantyActivated: true,
    warrantyPeriodMonths: 36,
    warrantyExpiryDate: '2029-09-02',
    notes: 'Secondary distribution to prominent Malda district electronics retailer.'
  }
]

export const useResaleStore = create((set, get) => ({
  resales: INITIAL_RESALES,

  addResale: (newResale) => {
    const autoId = `RS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    const record = {
      id: autoId,
      resaleRef: newResale.resaleRef || `RES-${autoId}`,
      resaleDate: newResale.resaleDate || new Date().toISOString().split('T')[0],
      deliveryStatus: newResale.deliveryStatus || 'Delivered & Verified',
      paymentStatus: newResale.paymentStatus || 'Settled',
      ...newResale
    }

    set((state) => ({
      resales: [record, ...state.resales]
    }))
    return record.id
  },

  updateResale: (id, updatedFields) => {
    set((state) => ({
      resales: state.resales.map((r) =>
        r.id === id ? { ...r, ...updatedFields } : r
      )
    }))
  },

  deleteResale: (id) => {
    set((state) => ({
      resales: state.resales.filter((r) => r.id !== id)
    }))
  },

  verifyResale: (id) => {
    set((state) => ({
      resales: state.resales.map((r) =>
        r.id === id
          ? {
              ...r,
              deliveryStatus: 'Delivered & Verified',
              warrantyActivated: true,
              warrantyExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 3).toISOString().split('T')[0]
            }
          : r
      )
    }))
  },

  getResalesByReseller: (resellerId) => {
    return get().resales.filter((r) => r.resellerId === resellerId)
  },

  getResalesByProduct: (productId) => {
    return get().resales.filter((r) => r.productId === productId)
  },

  getTerritoryStats: () => {
    const resales = get().resales
    const territoryMap = {}

    resales.forEach((r) => {
      const territory = r.territoryZone || `${r.city}, ${r.state}`
      if (!territoryMap[territory]) {
        territoryMap[territory] = {
          name: territory,
          state: r.state,
          cities: new Set(),
          totalResaleValue: 0,
          totalUnitsResold: 0,
          dealers: new Set(),
          buyers: new Set(),
          resalesCount: 0
        }
      }

      territoryMap[territory].cities.add(r.city)
      territoryMap[territory].totalResaleValue += r.totalResaleAmount || 0
      territoryMap[territory].totalUnitsResold += r.quantity || 0
      territoryMap[territory].dealers.add(r.resellerName)
      territoryMap[territory].buyers.add(r.buyerBusinessName || r.buyerName)
      territoryMap[territory].resalesCount += 1
    })

    return Object.values(territoryMap).map((t) => ({
      ...t,
      citiesList: Array.from(t.cities).join(', '),
      dealersList: Array.from(t.dealers).join(', '),
      uniqueBuyersCount: t.buyers.size,
      citiesCount: t.cities.size
    }))
  }
}))
