import React, { useState } from 'react'
import {
  Smartphone,
  Radio,
  Zap,
  User,
  CreditCard,
  Building2,
  Tag,
  Hash
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

export const RechargeLogModal = ({ isOpen, onClose, onSave }) => {
  const [targetMobileNumber, setTargetMobileNumber] = useState('+91 ')
  const [operator, setOperator] = useState('Jio')
  const [circle, setCircle] = useState('Kolkata')
  const [connectionType, setConnectionType] = useState('Prepaid')
  const [planAmount, setPlanAmount] = useState('719')
  const [planCategory, setPlanCategory] = useState('Unlimited 5G Data Pack')
  const [planValidity, setPlanValidity] = useState('84 Days')
  const [planBenefits, setPlanBenefits] = useState(
    '2 GB/Day + Unlimited True 5G Data + Unlimited Voice Calls + 100 SMS/Day'
  )

  const [appUserName, setAppUserName] = useState('Subir Das')
  const [appUserEmail, setAppUserEmail] = useState('subir.das@gmail.com')
  const [appDevice, setAppDevice] = useState('Android App (v2.4.1)')
  const [thirdPartyGateway, setThirdPartyGateway] = useState('Bharat BillPay (BBPS)')
  const [paymentMode, setPaymentMode] = useState('UPI (Google Pay)')
  const [rechargeStatus, setRechargeStatus] = useState('Success')
  const [userCashback, setUserCashback] = useState('10')

  const handleSubmit = (e) => {
    e.preventDefault()

    const amt = Number(planAmount) || 0
    const cashback = Number(userCashback) || 0

    const payload = {
      targetMobileNumber: targetMobileNumber.trim(),
      operator,
      circle,
      connectionType,
      planAmount: amt,
      planCategory,
      planValidity,
      planBenefits: planBenefits.trim(),
      appUserId: `USR-APP-${Math.floor(1000 + Math.random() * 9000)}`,
      appUserName: appUserName.trim(),
      appUserEmail: appUserEmail.trim(),
      appDevice,
      thirdPartyGateway,
      paymentMode,
      rechargeStatus,
      userCashback: cashback,
      failureReason: rechargeStatus === 'Failed' ? 'Operator Switch timed out waiting for acknowledgment.' : null
    }

    onSave(payload)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Simulate / Record Mobile Recharge Event"
      description="Record or simulate a mobile recharge transaction executed via the consumer mobile app and 3rd-party gateway."
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Target Mobile Details */}
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
            <Smartphone className="h-4 w-4" />
            <span>1. Target Mobile Number & Carrier</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Mobile Number *
              </label>
              <Input
                placeholder="+91 98301 22445"
                value={targetMobileNumber}
                onChange={(e) => setTargetMobileNumber(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telecom Operator *
              </label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Jio">Jio (Reliance Jio)</option>
                <option value="Airtel">Airtel (Bharti Airtel)</option>
                <option value="Vi">Vi (Vodafone Idea)</option>
                <option value="BSNL">BSNL (Bharat Sanchar Nigam)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telecom Circle / Region *
              </label>
              <select
                value={circle}
                onChange={(e) => setCircle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Kolkata">Kolkata</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Maharashtra">Maharashtra & Goa</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Bihar & Jharkhand">Bihar & Jharkhand</option>
                <option value="UP East">UP East</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Recharge Plan Details */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>2. Recharge Plan Value & Benefits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Plan Amount (₹) *
              </label>
              <Input
                type="number"
                min="10"
                value={planAmount}
                onChange={(e) => setPlanAmount(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Plan Category
              </label>
              <select
                value={planCategory}
                onChange={(e) => setPlanCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Unlimited 5G Data Pack">Unlimited 5G Data Pack</option>
                <option value="Annual Super Pack">Annual Super Pack</option>
                <option value="Data Booster Add-on">Data Booster Add-on</option>
                <option value="Voice & Talktime">Voice & Talktime</option>
                <option value="Cricket Season Pack">Cricket Season Pack</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Plan Validity *
              </label>
              <Input
                placeholder="e.g. 84 Days"
                value={planValidity}
                onChange={(e) => setPlanValidity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                User Cashback (₹)
              </label>
              <Input
                type="number"
                min="0"
                value={userCashback}
                onChange={(e) => setUserCashback(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Plan Benefits Summary
            </label>
            <Input
              value={planBenefits}
              onChange={(e) => setPlanBenefits(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Step 3: App User Profile & Gateway Coordinates */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Radio className="h-4 w-4 text-emerald-500" />
            <span>3. App User & 3rd Party Processing Coordinates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                App Customer Name *
              </label>
              <Input
                value={appUserName}
                onChange={(e) => setAppUserName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Customer Email *
              </label>
              <Input
                type="email"
                value={appUserEmail}
                onChange={(e) => setAppUserEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                App Device Platform
              </label>
              <select
                value={appDevice}
                onChange={(e) => setAppDevice(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Android App (v2.4.1)">Android App (v2.4.1)</option>
                <option value="iOS App (v2.3.0)">iOS App (v2.3.0)</option>
                <option value="Mobile Web">Mobile Web</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                3rd Party Gateway
              </label>
              <select
                value={thirdPartyGateway}
                onChange={(e) => setThirdPartyGateway(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Bharat BillPay (BBPS)">Bharat BillPay (BBPS)</option>
                <option value="PayTM Telecom Engine">PayTM Telecom Engine</option>
                <option value="Razorpay VAS">Razorpay VAS</option>
                <option value="CyberPlat Switch">CyberPlat Switch</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Channel
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="UPI (Google Pay)">UPI (Google Pay)</option>
                <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                <option value="UPI (Paytm)">UPI (Paytm)</option>
                <option value="Debit Card">Debit Card</option>
                <option value="FillFree App Wallet">FillFree App Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Recharge Status
              </label>
              <select
                value={rechargeStatus}
                onChange={(e) => setRechargeStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Success">Success (Operator Acknowledged)</option>
                <option value="Pending Operator Response">Pending Operator Response</option>
                <option value="Failed">Failed (Rejected)</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default" className="bg-indigo-600 hover:bg-indigo-500 text-white">
            Commit Recharge Record
          </Button>
        </div>
      </form>
    </Modal>
  )
}
