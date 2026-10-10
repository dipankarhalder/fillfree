import { create } from 'zustand'

const INITIAL_RECHARGES = [
  {
    id: 'RCH-2026-88091',
    targetMobileNumber: '+91 98301 22445',
    operator: 'Jio',
    circle: 'Kolkata',
    connectionType: 'Prepaid',
    planAmount: 719,
    planCategory: 'Unlimited 5G Data Pack',
    planValidity: '84 Days',
    planBenefits: '2 GB/Day + Unlimited 5G Data + Unlimited Voice Calls + 100 SMS/Day + JioCinema Premium',
    
    // App User Profile
    appUserId: 'USR-APP-1029',
    appUserName: 'Aniket Roy',
    appUserEmail: 'aniket.roy@gmail.com',
    appDevice: 'Android App (v2.4.1)',
    
    // 3rd Party Processing Coordinates
    thirdPartyGateway: 'Bharat BillPay (BBPS)',
    operatorRefId: 'JIO-TXN-99812409',
    gatewayTxnId: 'BBPS-PAY-771920',
    rechargeStatus: 'Success', // Success, Pending Operator Response, Failed, Refunded
    failureReason: null,
    createdAt: '2026-10-10T17:42:15Z',
    
    // Financials & Margins
    paymentMode: 'UPI (PhonePe)',
    paymentStatus: 'Paid',
    platformCommission: 17.98, // ~2.5%
    userCashback: 10.00,
    netPlatformProfit: 7.98
  },
  {
    id: 'RCH-2026-88092',
    targetMobileNumber: '+91 98200 33441',
    operator: 'Airtel',
    circle: 'Mumbai',
    connectionType: 'Prepaid',
    planAmount: 299,
    planCategory: 'Unlimited 5G Data Pack',
    planValidity: '28 Days',
    planBenefits: '1.5 GB/Day + Unlimited True 5G + Unlimited Calls + 100 SMS/Day + Apollo 24|7 Circle',
    
    appUserId: 'USR-APP-1044',
    appUserName: 'Priya Patel',
    appUserEmail: 'priya.patel@horizoncorp.in',
    appDevice: 'iOS App (v2.3.0)',
    
    thirdPartyGateway: 'PayTM Telecom Engine',
    operatorRefId: 'AIRTEL-RCH-441829',
    gatewayTxnId: 'PAYTM-VAS-109281',
    rechargeStatus: 'Success',
    failureReason: null,
    createdAt: '2026-10-10T16:15:30Z',
    
    paymentMode: 'UPI (Google Pay)',
    paymentStatus: 'Paid',
    platformCommission: 7.48, // 2.5%
    userCashback: 5.00,
    netPlatformProfit: 2.48
  },
  {
    id: 'RCH-2026-88093',
    targetMobileNumber: '+91 98110 44211',
    operator: 'Vi',
    circle: 'Delhi NCR',
    connectionType: 'Prepaid',
    planAmount: 199,
    planCategory: 'Unlimited 5G Data Pack',
    planValidity: '18 Days',
    planBenefits: '1 GB/Day + Unlimited Local/STD Calls + 100 SMS/Day + Vi Movies & TV Lite',
    
    appUserId: 'USR-APP-1082',
    appUserName: 'Rajesh Verma',
    appUserEmail: 'rverma.enterprises@yahoo.com',
    appDevice: 'Android App (v2.4.1)',
    
    thirdPartyGateway: 'Razorpay VAS',
    operatorRefId: 'VI-REF-880192',
    gatewayTxnId: 'RZP-RCH-309182',
    rechargeStatus: 'Success',
    failureReason: null,
    createdAt: '2026-10-10T14:30:22Z',
    
    paymentMode: 'Debit Card (HDFC)',
    paymentStatus: 'Paid',
    platformCommission: 4.98,
    userCashback: 0.00,
    netPlatformProfit: 4.98
  },
  {
    id: 'RCH-2026-88094',
    targetMobileNumber: '+91 98312 66778',
    operator: 'Jio',
    circle: 'West Bengal',
    connectionType: 'Prepaid',
    planAmount: 2999,
    planCategory: 'Annual Super Pack',
    planValidity: '365 Days',
    planBenefits: '2.5 GB/Day (912.5 GB Total) + Unlimited 5G Data + Unlimited Calls + 100 SMS/Day + 1 Year FanCode Subscription',
    
    appUserId: 'USR-APP-1102',
    appUserName: 'Sneha Sen',
    appUserEmail: 'sneha.sen@designcraft.com',
    appDevice: 'iOS App (v2.3.0)',
    
    thirdPartyGateway: 'Bharat BillPay (BBPS)',
    operatorRefId: 'JIO-TXN-99824018',
    gatewayTxnId: 'BBPS-PAY-772184',
    rechargeStatus: 'Success',
    failureReason: null,
    createdAt: '2026-10-10T12:05:40Z',
    
    paymentMode: 'UPI (Paytm)',
    paymentStatus: 'Paid',
    platformCommission: 74.98,
    userCashback: 50.00,
    netPlatformProfit: 24.98
  },
  {
    id: 'RCH-2026-88095',
    targetMobileNumber: '+91 98450 88990',
    operator: 'Airtel',
    circle: 'Karnataka',
    connectionType: 'Prepaid',
    planAmount: 65,
    planCategory: 'Data Booster Add-on',
    planValidity: 'Base Plan Validity',
    planBenefits: '4 GB High Speed 4G/5G Extra Data Booster (Valid till active base plan expiration)',
    
    appUserId: 'USR-APP-1130',
    appUserName: 'Vikramaditya Roy',
    appUserEmail: 'vikram.roy@apexinfra.co',
    appDevice: 'Android App (v2.4.1)',
    
    thirdPartyGateway: 'PayTM Telecom Engine',
    operatorRefId: 'AIRTEL-RCH-442011',
    gatewayTxnId: 'PAYTM-VAS-109452',
    rechargeStatus: 'Success',
    failureReason: null,
    createdAt: '2026-10-10T10:50:18Z',
    
    paymentMode: 'FillFree App Wallet',
    paymentStatus: 'Paid',
    platformCommission: 1.63,
    userCashback: 0.00,
    netPlatformProfit: 1.63
  },
  {
    id: 'RCH-2026-88096',
    targetMobileNumber: '+91 94330 11992',
    operator: 'BSNL',
    circle: 'Kolkata',
    connectionType: 'Prepaid',
    planAmount: 107,
    planCategory: 'Voice & Talktime',
    planValidity: '35 Days',
    planBenefits: '3 GB 4G High Speed Data + 200 Minutes Voice Calls to Any Network + BSNL Tunes free for 35 days',
    
    appUserId: 'USR-APP-1155',
    appUserName: 'Subrata Mukherjee',
    appUserEmail: 'subrata.mukherjee@gmail.com',
    appDevice: 'Android App (v2.4.1)',
    
    thirdPartyGateway: 'CyberPlat Switch',
    operatorRefId: 'BSNL-RRN-102941',
    gatewayTxnId: 'CYB-VAS-881029',
    rechargeStatus: 'Success',
    failureReason: null,
    createdAt: '2026-10-10T09:20:11Z',
    
    paymentMode: 'UPI (PhonePe)',
    paymentStatus: 'Paid',
    platformCommission: 3.21,
    userCashback: 0.00,
    netPlatformProfit: 3.21
  },
  {
    id: 'RCH-2026-88097',
    targetMobileNumber: '+91 97110 55667',
    operator: 'Jio',
    circle: 'Bihar & Jharkhand',
    connectionType: 'Prepaid',
    planAmount: 239,
    planCategory: 'Unlimited 5G Data Pack',
    planValidity: '28 Days',
    planBenefits: '1.5 GB/Day + Unlimited True 5G + Unlimited Calls + 100 SMS/Day',
    
    appUserId: 'USR-APP-1180',
    appUserName: 'Rahul Sharma',
    appUserEmail: 'rahul.sharma@outlook.com',
    appDevice: 'Mobile Web',
    
    thirdPartyGateway: 'Bharat BillPay (BBPS)',
    operatorRefId: 'JIO-ERR-881902',
    gatewayTxnId: 'BBPS-PAY-772401',
    rechargeStatus: 'Failed',
    failureReason: 'Operator Switch Rejected: Target mobile number circle mismatch (SIM registered in UP East, not Bihar).',
    createdAt: '2026-10-10T08:14:05Z',
    
    paymentMode: 'UPI (Google Pay)',
    paymentStatus: 'Refunded',
    platformCommission: 0.00,
    userCashback: 0.00,
    netPlatformProfit: 0.00
  },
  {
    id: 'RCH-2026-88098',
    targetMobileNumber: '+91 94340 88123',
    operator: 'Airtel',
    circle: 'West Bengal',
    connectionType: 'Prepaid',
    planAmount: 839,
    planCategory: 'Unlimited 5G Data Pack',
    planValidity: '84 Days',
    planBenefits: '2 GB/Day + Unlimited 5G Data + Unlimited Calls + 100 SMS/Day + 3 Months Disney+ Hotstar Mobile + RewardsMini',
    
    appUserId: 'USR-APP-1194',
    appUserName: 'Tanmoy Das',
    appUserEmail: 'tanmoy.das@rediffmail.com',
    appDevice: 'Android App (v2.4.1)',
    
    thirdPartyGateway: 'PayTM Telecom Engine',
    operatorRefId: 'AIRTEL-QUEUE-99120',
    gatewayTxnId: 'PAYTM-VAS-109881',
    rechargeStatus: 'Pending Operator Response',
    failureReason: null,
    createdAt: '2026-10-10T07:45:30Z',
    
    paymentMode: 'UPI (PhonePe)',
    paymentStatus: 'Paid',
    platformCommission: 20.98,
    userCashback: 15.00,
    netPlatformProfit: 5.98
  },
  {
    id: 'RCH-2026-88099',
    targetMobileNumber: '+91 98305 99001',
    operator: 'Vi',
    circle: 'Kolkata',
    connectionType: 'Prepaid',
    planAmount: 479,
    planCategory: 'Unlimited 5G Data Pack',
    planValidity: '56 Days',
    planBenefits: '1.5 GB/Day + Unlimited Calls + 100 SMS/Day + Binge All Night (12 AM to 6 AM Unlimited data) + Weekend Data Rollover',
    
    appUserId: 'USR-APP-1205',
    appUserName: 'Megha Ghosh',
    appUserEmail: 'megha.ghosh@gmail.com',
    appDevice: 'iOS App (v2.3.0)',
    
    thirdPartyGateway: 'Razorpay VAS',
    operatorRefId: 'VI-CAN-449102',
    gatewayTxnId: 'RZP-RCH-309405',
    rechargeStatus: 'Refunded',
    failureReason: 'Order cancelled by customer before operator switch commit. Amount credited back to bank account.',
    createdAt: '2026-10-09T20:10:45Z',
    
    paymentMode: 'Net Banking (SBI)',
    paymentStatus: 'Refunded',
    platformCommission: 0.00,
    userCashback: 0.00,
    netPlatformProfit: 0.00
  },
  {
    id: 'RCH-2026-88100',
    targetMobileNumber: '+91 98100 77889',
    operator: 'Jio',
    circle: 'Delhi NCR',
    connectionType: 'Prepaid',
    planAmount: 19,
    planCategory: 'Data Booster Add-on',
    planValidity: '1 Day',
    planBenefits: '1.5 GB Extra High Speed 4G/5G Data Add-on (Valid till midnight)',
    
    appUserId: 'USR-APP-1220',
    appUserName: 'Swati Sen',
    appUserEmail: 'swati.sen@techlead.in',
    appDevice: 'Android App (v2.4.1)',
    
    thirdPartyGateway: 'Bharat BillPay (BBPS)',
    operatorRefId: 'JIO-TXN-99831902',
    gatewayTxnId: 'BBPS-PAY-772990',
    rechargeStatus: 'Success',
    failureReason: null,
    createdAt: '2026-10-09T18:02:19Z',
    
    paymentMode: 'UPI (Paytm)',
    paymentStatus: 'Paid',
    platformCommission: 0.48,
    userCashback: 0.00,
    netPlatformProfit: 0.48
  }
]

export const useRechargeStore = create((set, get) => ({
  recharges: INITIAL_RECHARGES,

  addRecharge: (newRecharge) => {
    const autoId = `RCH-2026-${Math.floor(10000 + Math.random() * 90000)}`
    const commission = (Number(newRecharge.planAmount) || 0) * 0.025
    const cashback = Number(newRecharge.userCashback) || 0
    const profit = Math.max(0, commission - cashback)

    const record = {
      id: autoId,
      createdAt: new Date().toISOString(),
      rechargeStatus: newRecharge.rechargeStatus || 'Success',
      paymentStatus: newRecharge.paymentStatus || 'Paid',
      platformCommission: Number(commission.toFixed(2)),
      userCashback: Number(cashback.toFixed(2)),
      netPlatformProfit: Number(profit.toFixed(2)),
      operatorRefId: newRecharge.operatorRefId || `${newRecharge.operator?.toUpperCase()}-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      gatewayTxnId: newRecharge.gatewayTxnId || `BBPS-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      ...newRecharge
    }

    set((state) => ({
      recharges: [record, ...state.recharges]
    }))
    return record.id
  },

  updateRechargeStatus: (id, newStatus, reason = null) => {
    set((state) => ({
      recharges: state.recharges.map((r) =>
        r.id === id
          ? {
              ...r,
              rechargeStatus: newStatus,
              failureReason: reason,
              paymentStatus: newStatus === 'Refunded' ? 'Refunded' : r.paymentStatus
            }
          : r
      )
    }))
  },

  refundRecharge: (id) => {
    set((state) => ({
      recharges: state.recharges.map((r) =>
        r.id === id
          ? {
              ...r,
              rechargeStatus: 'Refunded',
              paymentStatus: 'Refunded',
              failureReason: 'Refund initiated by Super Admin via Gateway Webhook.',
              netPlatformProfit: 0,
              platformCommission: 0
            }
          : r
      )
    }))
  },

  deleteRecharge: (id) => {
    set((state) => ({
      recharges: state.recharges.filter((r) => r.id !== id)
    }))
  },

  getOperatorBreakdown: () => {
    const recharges = get().recharges
    const operatorMap = { Jio: 0, Airtel: 0, Vi: 0, BSNL: 0 }
    let totalCount = 0

    recharges.forEach((r) => {
      if (operatorMap[r.operator] !== undefined) {
        operatorMap[r.operator] += 1
        totalCount += 1
      }
    })

    return Object.entries(operatorMap).map(([operator, count]) => ({
      operator,
      count,
      percentage: totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : 0
    }))
  },

  getRechargeStats: () => {
    const recharges = get().recharges
    const totalVolume = recharges.reduce((acc, r) => acc + (r.planAmount || 0), 0)
    const successList = recharges.filter((r) => r.rechargeStatus === 'Success')
    const successRate = recharges.length > 0
      ? ((successList.length / recharges.length) * 100).toFixed(1)
      : 0
    const totalCommission = recharges.reduce((acc, r) => acc + (r.platformCommission || 0), 0)
    const uniqueMobiles = new Set(recharges.map((r) => r.targetMobileNumber)).size

    return {
      totalVolume,
      totalCount: recharges.length,
      successCount: successList.length,
      successRate,
      totalCommission,
      uniqueMobiles
    }
  }
}))
