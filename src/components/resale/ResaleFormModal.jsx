import React, { useState, useEffect } from 'react'
import {
  X,
  TrendingUp,
  Building2,
  Truck,
  MapPin,
  ShoppingBag,
  Coins,
  ShieldCheck,
  Hash,
  AlertCircle
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useDataStore } from '@/store/useDataStore'
import { useBillingStore } from '@/store/useBillingStore'
import { formatCurrency } from '@/lib/utils'

export const ResaleFormModal = ({ isOpen, onClose, onSave, editingResale = null }) => {
  const { partners, products } = useDataStore()
  const { salesOrders } = useBillingStore()

  // Resellers are Partners who buy products (Dealer, Wholesaler, Shop Saler)
  const eligibleResellers = partners.filter(p => p.role !== 'Suppliers')

  // Form States
  const [resellerId, setResellerId] = useState('')
  const [primaryOrderId, setPrimaryOrderId] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unitDealerCost, setUnitDealerCost] = useState(0)
  const [unitResalePrice, setUnitResalePrice] = useState(0)
  
  // Downstream Buyer & Channel
  const [buyerName, setBuyerName] = useState('')
  const [buyerBusinessName, setBuyerBusinessName] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerGstin, setBuyerGstin] = useState('')
  const [channelType, setChannelType] = useState('Retail Store')

  // Downstream Destination Address
  const [shopPremise, setShopPremise] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [state, setState] = useState('West Bengal')
  const [pincode, setPincode] = useState('')
  const [territoryZone, setTerritoryZone] = useState('')

  // Logistics & Status
  const [resaleRef, setResaleRef] = useState('')
  const [resaleDate, setResaleDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState('UPI / Immediate Wire')
  const [paymentStatus, setPaymentStatus] = useState('Settled')
  const [deliveryStatus, setDeliveryStatus] = useState('Delivered & Verified')
  const [serialNumbersText, setSerialNumbersText] = useState('')
  const [notes, setNotes] = useState('')

  // Initialize form when opening or editing
  useEffect(() => {
    if (editingResale) {
      setResellerId(editingResale.resellerId || eligibleResellers[0]?.id || '')
      setPrimaryOrderId(editingResale.primaryOrderId || salesOrders[0]?.orderId || '')
      setProductId(editingResale.productId || products[0]?.id || '')
      setQuantity(editingResale.quantity || 1)
      setUnitDealerCost(editingResale.unitDealerCost || 0)
      setUnitResalePrice(editingResale.unitResalePrice || 0)
      
      setBuyerName(editingResale.buyerName || '')
      setBuyerBusinessName(editingResale.buyerBusinessName || '')
      setBuyerPhone(editingResale.buyerPhone || '')
      setBuyerEmail(editingResale.buyerEmail || '')
      setBuyerGstin(editingResale.buyerGstin || '')
      setChannelType(editingResale.channelType || 'Retail Store')

      setShopPremise(editingResale.shopPremise || '')
      setStreetAddress(editingResale.streetAddress || '')
      setCity(editingResale.city || '')
      setDistrict(editingResale.district || '')
      setState(editingResale.state || 'West Bengal')
      setPincode(editingResale.pincode || '')
      setTerritoryZone(editingResale.territoryZone || '')

      setResaleRef(editingResale.resaleRef || '')
      setResaleDate(editingResale.resaleDate || new Date().toISOString().split('T')[0])
      setPaymentMethod(editingResale.paymentMethod || 'UPI / Immediate Wire')
      setPaymentStatus(editingResale.paymentStatus || 'Settled')
      setDeliveryStatus(editingResale.deliveryStatus || 'Delivered & Verified')
      setSerialNumbersText(editingResale.serialNumbers?.join(', ') || '')
      setNotes(editingResale.notes || '')
    } else {
      const defaultReseller = eligibleResellers[0]
      const defaultProduct = products[0]
      const defaultOrder = salesOrders[0]

      setResellerId(defaultReseller?.id || '')
      setPrimaryOrderId(defaultOrder?.orderId || 'ORD-98412')
      setProductId(defaultProduct?.id || '')
      setQuantity(2)
      setUnitDealerCost(defaultProduct?.price || 18500)
      setUnitResalePrice(Math.round((defaultProduct?.price || 18500) * 1.18))

      setBuyerName('')
      setBuyerBusinessName('')
      setBuyerPhone('+91 ')
      setBuyerEmail('')
      setBuyerGstin('')
      setChannelType('Retail Store')

      setShopPremise('')
      setStreetAddress('')
      setCity('Siliguri')
      setDistrict('Darjeeling')
      setState('West Bengal')
      setPincode('734001')
      setTerritoryZone('North Bengal Hub')

      setResaleRef(`RES-${Date.now().toString().slice(-6)}`)
      setResaleDate(new Date().toISOString().split('T')[0])
      setPaymentMethod('UPI / Immediate Wire')
      setPaymentStatus('Settled')
      setDeliveryStatus('Delivered & Verified')
      setSerialNumbersText('')
      setNotes('')
    }
  }, [editingResale, isOpen])

  // When product changes, adjust dealer cost and default resale price
  const handleProductChange = (prodId) => {
    setProductId(prodId)
    const prod = products.find(p => p.id === prodId)
    if (prod) {
      setUnitDealerCost(prod.price)
      setUnitResalePrice(Math.round(prod.price * 1.18))
    }
  }

  // Calculations
  const qtyNum = Math.max(1, Number(quantity) || 1)
  const dealerCostNum = Number(unitDealerCost) || 0
  const resalePriceNum = Number(unitResalePrice) || 0
  const subtotalResale = qtyNum * resalePriceNum
  const taxAmount = Math.round(subtotalResale * 0.18)
  const totalResaleAmount = subtotalResale + taxAmount
  const unitMargin = resalePriceNum - dealerCostNum
  const totalMarginEarned = unitMargin * qtyNum
  const marginPercentage = dealerCostNum > 0 ? ((unitMargin / dealerCostNum) * 100).toFixed(2) : 0

  const handleSubmit = (e) => {
    e.preventDefault()

    const chosenReseller = eligibleResellers.find(r => r.id === resellerId) || eligibleResellers[0]
    const chosenProduct = products.find(p => p.id === productId) || products[0]
    const chosenOrder = salesOrders.find(o => o.orderId === primaryOrderId) || salesOrders[0]

    const serialsArray = serialNumbersText
      ? serialNumbersText.split(',').map(s => s.trim()).filter(Boolean)
      : []

    const payload = {
      resaleRef: resaleRef.trim() || `RES-${Date.now().toString().slice(-6)}`,
      resellerId: chosenReseller?.id,
      resellerName: chosenReseller?.businessName,
      resellerRole: chosenReseller?.role,
      primaryOrderId: chosenOrder?.orderId || primaryOrderId,
      primaryOrderDate: chosenOrder?.saleDate?.split('T')[0] || '2026-08-26',
      lotCode: chosenOrder?.lotName || 'LOT-202608-8801',
      warehouseName: chosenOrder?.warehouseName || 'Dankuni Logistics Godam',
      productId: chosenProduct?.id,
      productName: chosenProduct?.name,
      sku: chosenProduct?.sku,
      category: chosenProduct?.category,
      serialNumbers: serialsArray,

      buyerName: buyerName.trim(),
      buyerBusinessName: buyerBusinessName.trim() || buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      buyerEmail: buyerEmail.trim(),
      buyerGstin: buyerGstin.trim() || 'N/A',
      channelType,

      shopPremise: shopPremise.trim() || 'Main Market Commercial Store',
      streetAddress: streetAddress.trim(),
      city: city.trim(),
      district: district.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      territoryZone: territoryZone.trim() || `${city.trim()} Hub`,

      quantity: qtyNum,
      unitDealerCost: dealerCostNum,
      unitResalePrice: resalePriceNum,
      subtotalResale,
      taxRate: 18,
      taxAmount,
      totalResaleAmount,
      unitMargin,
      totalMarginEarned,
      marginPercentage: Number(marginPercentage),
      paymentMethod,
      paymentStatus,

      resaleDate,
      deliveryStatus,
      warrantyActivated: deliveryStatus === 'Delivered & Verified',
      warrantyPeriodMonths: 24,
      warrantyExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2).toISOString().split('T')[0],
      notes: notes.trim()
    }

    onSave(payload)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingResale ? 'Edit Downstream Resale Entry' : 'Record Dealer / Wholesaler Resale'}
      description="Track where and to whom an authorized dealer or wholesaler sold the products, including destination city, resale price, and profit markup."
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Reseller & Originating Primary Order */}
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
            <Building2 className="h-4 w-4" />
            <span>1. Reselling Partner & FillFree Stock Source</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reselling Partner (Dealer / Wholesaler) *
              </label>
              <select
                value={resellerId}
                onChange={(e) => setResellerId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                {eligibleResellers.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.businessName} ({r.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Originating FillFree Primary Order *
              </label>
              <select
                value={primaryOrderId}
                onChange={(e) => setPrimaryOrderId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                {salesOrders.map(o => (
                  <option key={o.orderId} value={o.orderId}>
                    {o.orderId} — {o.customerName} ({o.lotName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product Resold *
              </label>
              <select
                value={productId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Resale Quantities & Profitability Markup */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Coins className="h-4 w-4 text-amber-500" />
            <span>2. Resale Quantities & Dealer Markup / Profitability</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resale Quantity *
              </label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dealer Cost / Unit (₹)
              </label>
              <Input
                type="number"
                value={unitDealerCost}
                onChange={(e) => setUnitDealerCost(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resale Selling Price / Unit (₹) *
              </label>
              <Input
                type="number"
                value={unitResalePrice}
                onChange={(e) => setUnitResalePrice(e.target.value)}
                required
              />
            </div>

            {/* Calculated Profit Box */}
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 p-2.5 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                Dealer Realized Profit
              </span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(totalMarginEarned)}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold">
                +{marginPercentage}% markup margin
              </span>
            </div>
          </div>
        </div>

        {/* Step 3: Downstream Buyer Information */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <ShoppingBag className="h-4 w-4 text-indigo-500" />
              <span>3. Downstream Buyer / Outlet Profile</span>
            </div>
            <span className="text-[10px] text-slate-400">Where the goods were sold</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Buyer Shop / Business Name *
              </label>
              <Input
                placeholder="e.g. Metro Infotech & Gaming Hub"
                value={buyerBusinessName}
                onChange={(e) => setBuyerBusinessName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Owner / Contact Person *
              </label>
              <Input
                placeholder="e.g. Surojit Biswas"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Distribution Channel Type *
              </label>
              <select
                value={channelType}
                onChange={(e) => setChannelType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Retail Store">Retail Store / Local Shop</option>
                <option value="Sub-Dealer">Sub-Dealer / Regional Dist.</option>
                <option value="Direct Consumer (B2C)">Direct Consumer (B2C)</option>
                <option value="Enterprise / Institutional">Enterprise / Corporate</option>
                <option value="Contractor / Workshop">Contractor / Technician</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <Input
                placeholder="+91 98322 11002"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="buyer@shop.in"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GSTIN / Tax ID
              </label>
              <Input
                placeholder="e.g. 19AAAFM8821B1Z4 or N/A"
                value={buyerGstin}
                onChange={(e) => setBuyerGstin(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Step 4: Destination Geolocation & Territory */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-50/30 dark:bg-rose-950/15 p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
            <MapPin className="h-4 w-4" />
            <span>4. Resale Destination Geolocation (Where Did They Resell?)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shop / Premise Complex *
              </label>
              <Input
                placeholder="Shop 4, Bidhan Market Commercial Complex"
                value={shopPremise}
                onChange={(e) => setShopPremise(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Street / Area Road *
              </label>
              <Input
                placeholder="Sevoke Road, Near Planet Mall"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City / Town *
              </label>
              <Input
                placeholder="Siliguri"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                District *
              </label>
              <Input
                placeholder="Darjeeling"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                State *
              </label>
              <Input
                placeholder="West Bengal"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pincode *
              </label>
              <Input
                placeholder="734001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Territory Zone
              </label>
              <Input
                placeholder="North Bengal Hub"
                value={territoryZone}
                onChange={(e) => setTerritoryZone(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Step 5: Resale Verification & Traceability */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>5. Invoice Reference, Serials & Verification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resale Invoice / Ref # *
              </label>
              <Input
                placeholder="RES-TV-2026-441"
                value={resaleRef}
                onChange={(e) => setResaleRef(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resale Date *
              </label>
              <Input
                type="date"
                value={resaleDate}
                onChange={(e) => setResaleDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="UPI / Immediate Wire">UPI / Immediate Wire</option>
                <option value="Bank Wire / RTGS">Bank Wire / RTGS</option>
                <option value="Net 15 Days Credit">Net 15 Days Credit</option>
                <option value="Cash on Delivery">Cash on Counter</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Consignment Status
              </label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Delivered & Verified">Delivered & Verified</option>
                <option value="In-Transit">In-Transit</option>
                <option value="Pending Dispatch">Pending Dispatch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tracked Serial Numbers (Comma-separated)
            </label>
            <Input
              placeholder="SN-MN27-8801-01, SN-MN27-8801-02, SN-MN27-8801-03"
              value={serialNumbersText}
              onChange={(e) => setSerialNumbersText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deployment & Market Notes
            </label>
            <Input
              placeholder="e.g. High demand esports monitor delivery for Siliguri computer showroom."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Submit Actions */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default" className="bg-indigo-600 hover:bg-indigo-500 text-white">
            {editingResale ? 'Update Resale Record' : 'Save Downstream Resale Entry'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
