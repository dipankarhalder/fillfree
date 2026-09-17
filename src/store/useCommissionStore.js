import { create } from 'zustand'

const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-101',
    name: 'Amit Sharma',
    email: 'amit.sharma@gmail.com',
    phone: '+91 98310 12345',
    city: 'Kolkata, WB',
    referralCode: 'REF-AMIT01',
    referredById: null,
    referredByName: null,
    commissionRate: 3.0, // User basis commission % (earns 3.0% when referrals purchase)
    discountRate: 2.5,   // User basis discount % (gets 2.5% discount on own purchases)
    tier: 'Gold',
    totalPurchases: 45000,
    totalCommissionEarned: 2450,
    totalCommissionPaid: 1650,
    pendingCommission: 800,
    status: 'Active',
    joinedDate: '2025-11-10'
  },
  {
    id: 'CUST-102',
    name: 'Priya Patel',
    email: 'priya.patel@horizoncorp.in',
    phone: '+91 98200 67890',
    city: 'Mumbai, MH',
    referralCode: 'REF-PRIYA02',
    referredById: 'CUST-101',
    referredByName: 'Amit Sharma',
    commissionRate: 2.5,
    discountRate: 2.0,
    tier: 'Silver',
    totalPurchases: 32000,
    totalCommissionEarned: 1550,
    totalCommissionPaid: 950,
    pendingCommission: 600,
    status: 'Active',
    joinedDate: '2026-01-14'
  },
  {
    id: 'CUST-103',
    name: 'Rajesh Verma',
    email: 'rverma.enterprises@yahoo.com',
    phone: '+91 98111 23456',
    city: 'New Delhi, DL',
    referralCode: 'REF-RAJESH03',
    referredById: 'CUST-101',
    referredByName: 'Amit Sharma',
    commissionRate: 2.0,
    discountRate: 1.5,
    tier: 'Bronze',
    totalPurchases: 22000,
    totalCommissionEarned: 520,
    totalCommissionPaid: 520,
    pendingCommission: 0,
    status: 'Active',
    joinedDate: '2026-02-20'
  },
  {
    id: 'CUST-104',
    name: 'Sneha Sen',
    email: 'sneha.sen@designcraft.com',
    phone: '+91 98305 78901',
    city: 'Kolkata, WB',
    referralCode: 'REF-SNEHA04',
    referredById: 'CUST-102',
    referredByName: 'Priya Patel',
    commissionRate: 2.5,
    discountRate: 2.0,
    tier: 'Silver',
    totalPurchases: 28000,
    totalCommissionEarned: 450,
    totalCommissionPaid: 0,
    pendingCommission: 450,
    status: 'Active',
    joinedDate: '2026-04-05'
  },
  {
    id: 'CUST-105',
    name: 'Vikramaditya Roy',
    email: 'vikram.roy@apexinfra.co',
    phone: '+91 98450 99881',
    city: 'Bengaluru, KA',
    referralCode: 'REF-VIKRAM05',
    referredById: 'CUST-102',
    referredByName: 'Priya Patel',
    commissionRate: 3.0,
    discountRate: 2.5,
    tier: 'Gold',
    totalPurchases: 34000,
    totalCommissionEarned: 510,
    totalCommissionPaid: 0,
    pendingCommission: 510,
    status: 'Active',
    joinedDate: '2026-05-18'
  },
  {
    id: 'CUST-106',
    name: 'Ananya Mukherjee',
    email: 'ananya.m@technovibe.in',
    phone: '+91 98311 44556',
    city: 'Howrah, WB',
    referralCode: 'REF-ANANYA06',
    referredById: 'CUST-103',
    referredByName: 'Rajesh Verma',
    commissionRate: 2.0,
    discountRate: 1.5,
    tier: 'Bronze',
    totalPurchases: 16000,
    totalCommissionEarned: 0,
    totalCommissionPaid: 0,
    pendingCommission: 0,
    status: 'Active',
    joinedDate: '2026-07-22'
  },
  {
    id: 'CUST-107',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@gujaratsteel.com',
    phone: '+91 98790 11223',
    city: 'Ahmedabad, GJ',
    referralCode: 'REF-ROHAN07',
    referredById: 'CUST-101',
    referredByName: 'Amit Sharma',
    commissionRate: 2.5,
    discountRate: 2.0,
    tier: 'Silver',
    totalPurchases: 26000,
    totalCommissionEarned: 0,
    totalCommissionPaid: 0,
    pendingCommission: 0,
    status: 'Active',
    joinedDate: '2026-08-01'
  },
  {
    id: 'CUST-108',
    name: 'Debabrata Ghosh',
    email: 'dghosh.works@gmail.com',
    phone: '+91 94340 33445',
    city: 'Durgapur, WB',
    referralCode: 'REF-DEBABRATA08',
    referredById: 'CUST-104',
    referredByName: 'Sneha Sen',
    commissionRate: 2.0,
    discountRate: 1.5,
    tier: 'Bronze',
    totalPurchases: 18000,
    totalCommissionEarned: 0,
    totalCommissionPaid: 0,
    pendingCommission: 0,
    status: 'Active',
    joinedDate: '2026-08-05'
  },
  {
    id: 'CUST-109',
    name: 'Tanvi Deshmukh',
    email: 'tanvi.d@maharashtratraders.in',
    phone: '+91 98230 55667',
    city: 'Pune, MH',
    referralCode: 'REF-TANVI09',
    referredById: 'CUST-102',
    referredByName: 'Priya Patel',
    commissionRate: 2.0,
    discountRate: 1.5,
    tier: 'Bronze',
    totalPurchases: 14000,
    totalCommissionEarned: 0,
    totalCommissionPaid: 0,
    pendingCommission: 0,
    status: 'Active',
    joinedDate: '2026-08-10'
  },
  {
    id: 'CUST-110',
    name: 'Sanjay Singhania',
    email: 'sanjay.singhania@rajasthanpkg.com',
    phone: '+91 94140 77889',
    city: 'Jaipur, RJ',
    referralCode: 'REF-SANJAY10',
    referredById: 'CUST-105',
    referredByName: 'Vikramaditya Roy',
    commissionRate: 2.5,
    discountRate: 2.0,
    tier: 'Silver',
    totalPurchases: 17000,
    totalCommissionEarned: 0,
    totalCommissionPaid: 0,
    pendingCommission: 0,
    status: 'Active',
    joinedDate: '2026-08-12'
  },
  {
    id: 'CUST-111',
    name: 'Meera Nambiar',
    email: 'meera.nambiar@keralaspices.org',
    phone: '+91 94470 88990',
    city: 'Kochi, KL',
    referralCode: 'REF-MEERA11',
    referredById: null,
    referredByName: null,
    commissionRate: 3.0,
    discountRate: 2.5,
    tier: 'Gold',
    totalPurchases: 38000,
    totalCommissionEarned: 1150,
    totalCommissionPaid: 650,
    pendingCommission: 500,
    status: 'Active',
    joinedDate: '2026-03-15'
  },
  {
    id: 'CUST-112',
    name: 'Arindam Roy',
    email: 'arindam.siliguri@teaexports.com',
    phone: '+91 98320 99001',
    city: 'Siliguri, WB',
    referralCode: 'REF-ARINDAM12',
    referredById: 'CUST-111',
    referredByName: 'Meera Nambiar',
    commissionRate: 2.0,
    discountRate: 1.5,
    tier: 'Bronze',
    totalPurchases: 25000,
    totalCommissionEarned: 0,
    totalCommissionPaid: 0,
    pendingCommission: 0,
    status: 'Active',
    joinedDate: '2026-05-20'
  },
  {
    id: 'CUST-113',
    name: 'Kavita Reddy',
    email: 'kavita.reddy@deccantech.in',
    phone: '+91 98490 22334',
    city: 'Hyderabad, TS',
    referralCode: 'REF-KAVITA13',
    referredById: 'CUST-111',
    referredByName: 'Meera Nambiar',
    commissionRate: 2.5,
    discountRate: 2.0,
    tier: 'Silver',
    totalPurchases: 16000,
    totalCommissionEarned: 0,
    totalCommissionPaid: 0,
    pendingCommission: 0,
    status: 'Active',
    joinedDate: '2026-06-18'
  },
  {
    id: 'CUST-114',
    name: 'Sourav Ganguly',
    email: 'sourav.kolkata@sportsline.in',
    phone: '+91 98300 00111',
    city: 'Kolkata, WB',
    referralCode: 'REF-SOURAV14',
    referredById: null,
    referredByName: null,
    commissionRate: 3.5,
    discountRate: 3.0,
    tier: 'Diamond',
    totalPurchases: 62000,
    totalCommissionEarned: 0,
    totalCommissionPaid: 0,
    pendingCommission: 0,
    status: 'Active',
    joinedDate: '2026-02-01'
  }
]

const INITIAL_COMMISSION_RECORDS = [
  {
    id: 'COM-801',
    date: '2026-08-20T10:00:00Z',
    buyerId: 'CUST-102',
    buyerName: 'Priya Patel',
    referrerId: 'CUST-101',
    referrerName: 'Amit Sharma',
    orderId: 'ORD-98412',
    orderAmount: 32000,
    commissionRate: 3.0,
    commissionAmount: 960,
    discountApplied: 640, // 2.0% discount
    status: 'Paid',
    paidDate: '2026-08-22T14:15:00Z',
    paymentMethod: 'UPI Instant Payout',
    paymentRef: 'UPI/9831012345@paytm/441290',
    notes: 'Disbursed via UPI payment gateway'
  },
  {
    id: 'COM-802',
    date: '2026-08-24T12:30:00Z',
    buyerId: 'CUST-103',
    buyerName: 'Rajesh Verma',
    referrerId: 'CUST-101',
    referrerName: 'Amit Sharma',
    orderId: 'ORD-98413',
    orderAmount: 22000,
    commissionRate: 3.0,
    commissionAmount: 660,
    discountApplied: 330, // 1.5% discount
    status: 'Paid',
    paidDate: '2026-08-25T11:20:00Z',
    paymentMethod: 'Bank Wire / RTGS',
    paymentRef: 'RTGS-HDFC-88219',
    notes: 'Settled via corporate banking portal'
  },
  {
    id: 'COM-803',
    date: '2026-08-25T15:45:00Z',
    buyerId: 'CUST-107',
    buyerName: 'Rohan Mehta',
    referrerId: 'CUST-101',
    referrerName: 'Amit Sharma',
    orderId: 'ORD-98414',
    orderAmount: 26000,
    commissionRate: 3.0,
    commissionAmount: 830,
    discountApplied: 520, // 2.0% discount
    status: 'Unpaid',
    paidDate: null,
    paymentMethod: null,
    paymentRef: null,
    notes: 'Awaiting monthly settlement cycle'
  },
  {
    id: 'COM-804',
    date: '2026-08-26T11:00:00Z',
    buyerId: 'CUST-104',
    buyerName: 'Sneha Sen',
    referrerId: 'CUST-102',
    referrerName: 'Priya Patel',
    orderId: 'ORD-98415',
    orderAmount: 28000,
    commissionRate: 2.5,
    commissionAmount: 700,
    discountApplied: 560, // 2.0% discount
    status: 'Paid',
    paidDate: '2026-08-27T09:40:00Z',
    paymentMethod: 'UPI Instant Payout',
    paymentRef: 'UPI/9820067890@icici/55129',
    notes: 'Paid through UPI instant transfer'
  },
  {
    id: 'COM-805',
    date: '2026-08-26T16:20:00Z',
    buyerId: 'CUST-105',
    buyerName: 'Vikramaditya Roy',
    referrerId: 'CUST-102',
    referrerName: 'Priya Patel',
    orderId: 'ORD-98416',
    orderAmount: 34000,
    commissionRate: 2.5,
    commissionAmount: 850,
    discountApplied: 850, // 2.5% discount
    status: 'Unpaid',
    paidDate: null,
    paymentMethod: null,
    paymentRef: null,
    notes: 'Order confirmed; payout pending verification'
  },
  {
    id: 'COM-806',
    date: '2026-08-27T10:15:00Z',
    buyerId: 'CUST-108',
    buyerName: 'Debabrata Ghosh',
    referrerId: 'CUST-104',
    referrerName: 'Sneha Sen',
    orderId: 'ORD-98417',
    orderAmount: 18000,
    commissionRate: 2.5,
    commissionAmount: 450,
    discountApplied: 270, // 1.5% discount
    status: 'Unpaid',
    paidDate: null,
    paymentMethod: null,
    paymentRef: null,
    notes: 'Direct referral commission on newly joined user'
  },
  {
    id: 'COM-807',
    date: '2026-08-27T14:30:00Z',
    buyerId: 'CUST-110',
    buyerName: 'Sanjay Singhania',
    referrerId: 'CUST-105',
    referrerName: 'Vikramaditya Roy',
    orderId: 'ORD-98418',
    orderAmount: 17000,
    commissionRate: 3.0,
    commissionAmount: 510,
    discountApplied: 340, // 2.0% discount
    status: 'Unpaid',
    paidDate: null,
    paymentMethod: null,
    paymentRef: null,
    notes: 'Second-generation downline purchase commission'
  },
  {
    id: 'COM-808',
    date: '2026-08-25T09:00:00Z',
    buyerId: 'CUST-112',
    buyerName: 'Arindam Roy',
    referrerId: 'CUST-111',
    referrerName: 'Meera Nambiar',
    orderId: 'ORD-98419',
    orderAmount: 25000,
    commissionRate: 3.0,
    commissionAmount: 750,
    discountApplied: 375, // 1.5% discount
    status: 'Paid',
    paidDate: '2026-08-26T16:00:00Z',
    paymentMethod: 'Bank Wire / RTGS',
    paymentRef: 'RTGS-SBI-99120',
    notes: 'Settled via SBI Commercial Banking'
  },
  {
    id: 'COM-809',
    date: '2026-08-27T11:45:00Z',
    buyerId: 'CUST-113',
    buyerName: 'Kavita Reddy',
    referrerId: 'CUST-111',
    referrerName: 'Meera Nambiar',
    orderId: 'ORD-98420',
    orderAmount: 16000,
    commissionRate: 3.0,
    commissionAmount: 480,
    discountApplied: 320, // 2.0% discount
    status: 'Unpaid',
    paidDate: null,
    paymentMethod: null,
    paymentRef: null,
    notes: 'Generated from Southern distribution cluster order'
  }
]

const INITIAL_TIERS = [
  { id: 'tier-bronze', name: 'Bronze', minSpend: 0, defaultCommissionRate: 2.0, defaultDiscountRate: 1.5, badgeColor: 'bg-amber-700/20 text-amber-500 border-amber-600/30' },
  { id: 'tier-silver', name: 'Silver', minSpend: 25000, defaultCommissionRate: 2.5, defaultDiscountRate: 2.0, badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  { id: 'tier-gold', name: 'Gold', minSpend: 50000, defaultCommissionRate: 3.0, defaultDiscountRate: 2.5, badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'tier-diamond', name: 'Diamond / VIP', minSpend: 100000, defaultCommissionRate: 3.5, defaultDiscountRate: 3.0, badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
]

export function generateCustomerReferralCode(name) {
  const cleanName = (name || 'USER').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5)
  const randomSuffix = Math.floor(10 + Math.random() * 90)
  return `REF-${cleanName}${randomSuffix}`
}

export const useCommissionStore = create((set, get) => ({
  customers: INITIAL_CUSTOMERS,
  commissionRecords: INITIAL_COMMISSION_RECORDS,
  tiers: INITIAL_TIERS,
  defaultCommissionRate: 2.5, // Realistic default base commission % (e.g. 2.5%)
  defaultDiscountRate: 2.0,   // Realistic default purchase discount % (e.g. 2.0%)

  // ==========================================
  // CUSTOMER CRUD OPERATIONS (Super Admin)
  // ==========================================
  addCustomer: (data) => {
    const nextId = `CUST-${Math.floor(120 + Math.random() * 880)}`
    const referralCode = data.referralCode || generateCustomerReferralCode(data.name)
    
    // Resolve referrer info if selected
    let referredByName = null
    if (data.referredById) {
      const referrer = get().customers.find(c => c.id === data.referredById)
      if (referrer) {
        referredByName = referrer.name
      }
    }

    const parsedComm = parseFloat(data.commissionRate)
    const commRate = !isNaN(parsedComm) && parsedComm >= 0 ? parsedComm : get().defaultCommissionRate

    const parsedDisc = parseFloat(data.discountRate)
    const discRate = !isNaN(parsedDisc) && parsedDisc >= 0 ? parsedDisc : get().defaultDiscountRate

    const newCustomer = {
      id: nextId,
      name: data.name || 'New Customer',
      email: data.email || '',
      phone: data.phone || '',
      city: data.city || 'Kolkata, WB',
      referralCode,
      referredById: data.referredById || null,
      referredByName,
      commissionRate: commRate,
      discountRate: discRate,
      tier: data.tier || 'Bronze',
      totalPurchases: 0,
      totalCommissionEarned: 0,
      totalCommissionPaid: 0,
      pendingCommission: 0,
      status: data.status || 'Active',
      joinedDate: new Date().toISOString().split('T')[0]
    }

    set(state => ({
      customers: [newCustomer, ...state.customers]
    }))

    return newCustomer
  },

  updateCustomer: (id, updatedData) => {
    set(state => {
      let referredByName = updatedData.referredByName
      if (updatedData.referredById !== undefined) {
        if (updatedData.referredById) {
          const referrer = state.customers.find(c => c.id === updatedData.referredById)
          referredByName = referrer ? referrer.name : null
        } else {
          referredByName = null
        }
      }

      return {
        customers: state.customers.map(c => {
          if (c.id === id) {
            let commRate = c.commissionRate
            if (updatedData.commissionRate !== undefined) {
              const parsedComm = parseFloat(updatedData.commissionRate)
              commRate = !isNaN(parsedComm) && parsedComm >= 0 ? parsedComm : (c.commissionRate ?? get().defaultCommissionRate)
            }

            let discRate = c.discountRate
            if (updatedData.discountRate !== undefined) {
              const parsedDisc = parseFloat(updatedData.discountRate)
              discRate = !isNaN(parsedDisc) && parsedDisc >= 0 ? parsedDisc : (c.discountRate ?? get().defaultDiscountRate)
            }

            const updated = {
              ...c,
              ...updatedData,
              commissionRate: commRate,
              discountRate: discRate,
              referredByName: referredByName !== undefined ? referredByName : c.referredByName
            }
            // Recalculate pending commission defensively
            const earned = Number(updated.totalCommissionEarned) || 0
            const paid = Number(updated.totalCommissionPaid) || 0
            updated.pendingCommission = Math.max(0, earned - paid)
            return updated
          }
          return c
        })
      }
    })
  },

  deleteCustomer: (id) => {
    set(state => ({
      customers: state.customers
        .filter(c => c.id !== id)
        .map(c => c.referredById === id ? { ...c, referredById: null, referredByName: null } : c),
      commissionRecords: state.commissionRecords.map(r => {
        if (r.buyerId === id) return { ...r, buyerName: `${r.buyerName} (Archived)` }
        if (r.referrerId === id) return { ...r, referrerName: `${r.referrerName} (Archived)` }
        return r
      })
    }))
  },

  // ==========================================
  // COMMISSION & PURCHASE FLOW
  // ==========================================
  recordReferralPurchase: ({ buyerId, orderId, orderAmount }) => {
    const state = get()
    const buyer = state.customers.find(c => c.id === buyerId)
    if (!buyer) return null

    const discountRate = buyer.discountRate || state.defaultDiscountRate
    const discountApplied = Math.round((orderAmount * discountRate) / 100)

    let newRecord = null

    if (buyer.referredById) {
      const referrer = state.customers.find(c => c.id === buyer.referredById)
      if (referrer) {
        const commissionRate = referrer.commissionRate || state.defaultCommissionRate
        const commissionAmount = Math.round((orderAmount * commissionRate) / 100)

        newRecord = {
          id: `COM-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString(),
          buyerId: buyer.id,
          buyerName: buyer.name,
          referrerId: referrer.id,
          referrerName: referrer.name,
          orderId: orderId || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
          orderAmount,
          commissionRate,
          commissionAmount,
          discountApplied,
          status: 'Unpaid',
          paidDate: null,
          paymentMethod: null,
          paymentRef: null,
          notes: `Referral commission generated for ${referrer.name} on ${buyer.name}'s purchase`
        }

        set(s => ({
          commissionRecords: [newRecord, ...s.commissionRecords],
          customers: s.customers.map(c => {
            if (c.id === referrer.id) {
              const newEarned = c.totalCommissionEarned + commissionAmount
              return {
                ...c,
                totalCommissionEarned: newEarned,
                pendingCommission: newEarned - c.totalCommissionPaid
              }
            }
            if (c.id === buyer.id) {
              return {
                ...c,
                totalPurchases: c.totalPurchases + orderAmount
              }
            }
            return c
          })
        }))
      }
    } else {
      set(s => ({
        customers: s.customers.map(c => {
          if (c.id === buyer.id) {
            return {
              ...c,
              totalPurchases: c.totalPurchases + orderAmount
            }
          }
          return c
        })
      }))
    }

    return { discountApplied, commissionRecord: newRecord }
  },

  // ==========================================
  // COMMISSION PAYOUT OPERATIONS (Paid / Unpaid)
  // ==========================================
  markCommissionPaid: (recordId, { paymentMethod = 'UPI Instant Payout', paymentRef = 'UPI-PAY-OK', notes = '' } = {}) => {
    set(state => {
      const targetRecord = state.commissionRecords.find(r => r.id === recordId)
      if (!targetRecord || targetRecord.status === 'Paid') return state

      const paidAmount = targetRecord.commissionAmount
      const referrerId = targetRecord.referrerId

      return {
        commissionRecords: state.commissionRecords.map(r => {
          if (r.id === recordId) {
            return {
              ...r,
              status: 'Paid',
              paidDate: new Date().toISOString(),
              paymentMethod,
              paymentRef,
              notes: notes || r.notes
            }
          }
          return r
        }),
        customers: state.customers.map(c => {
          if (c.id === referrerId) {
            const newPaid = c.totalCommissionPaid + paidAmount
            return {
              ...c,
              totalCommissionPaid: newPaid,
              pendingCommission: Math.max(0, c.totalCommissionEarned - newPaid)
            }
          }
          return c
        })
      }
    })
  },

  markCommissionUnpaid: (recordId) => {
    set(state => {
      const targetRecord = state.commissionRecords.find(r => r.id === recordId)
      if (!targetRecord || targetRecord.status === 'Unpaid') return state

      const revertAmount = targetRecord.commissionAmount
      const referrerId = targetRecord.referrerId

      return {
        commissionRecords: state.commissionRecords.map(r => {
          if (r.id === recordId) {
            return {
              ...r,
              status: 'Unpaid',
              paidDate: null,
              paymentMethod: null,
              paymentRef: null
            }
          }
          return r
        }),
        customers: state.customers.map(c => {
          if (c.id === referrerId) {
            const newPaid = Math.max(0, c.totalCommissionPaid - revertAmount)
            return {
              ...c,
              totalCommissionPaid: newPaid,
              pendingCommission: c.totalCommissionEarned - newPaid
            }
          }
          return c
        })
      }
    })
  },

  // ==========================================
  // CONFIGURATION & TIERS
  // ==========================================
  updateGlobalRates: ({ defaultCommissionRate, defaultDiscountRate }) => {
    set(state => ({
      defaultCommissionRate: defaultCommissionRate !== undefined ? Number(defaultCommissionRate) : state.defaultCommissionRate,
      defaultDiscountRate: defaultDiscountRate !== undefined ? Number(defaultDiscountRate) : state.defaultDiscountRate
    }))
  },

  updateTier: (tierId, updatedFields) => {
    set(state => ({
      tiers: state.tiers.map(t => t.id === tierId ? { ...t, ...updatedFields } : t)
    }))
  },

  getCustomerReferrals: (customerId) => {
    return get().customers.filter(c => c.referredById === customerId)
  },

  getStats: () => {
    const { customers, commissionRecords } = get()
    const totalCustomers = customers.length
    const totalReferrals = customers.filter(c => c.referredById !== null).length
    const totalCommissionEarned = customers.reduce((sum, c) => sum + (c.totalCommissionEarned || 0), 0)
    const totalCommissionPaid = customers.reduce((sum, c) => sum + (c.totalCommissionPaid || 0), 0)
    const totalPendingCommission = customers.reduce((sum, c) => sum + (c.pendingCommission || 0), 0)
    const paidRecordsCount = commissionRecords.filter(r => r.status === 'Paid').length
    const unpaidRecordsCount = commissionRecords.filter(r => r.status === 'Unpaid').length

    return {
      totalCustomers,
      totalReferrals,
      totalCommissionEarned,
      totalCommissionPaid,
      totalPendingCommission,
      paidRecordsCount,
      unpaidRecordsCount
    }
  }
}))
