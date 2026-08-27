import React, { useState } from 'react'
import {
  Ticket,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Calendar,
  Percent,
  IndianRupee,
  AlertCircle
} from 'lucide-react'
import { useDataStore } from '@/store/useDataStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency } from '@/lib/utils'

export const CouponsView = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useDataStore()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)

  // Form State
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState('percentage')
  const [value, setValue] = useState('10')
  const [minOrderAmount, setMinOrderAmount] = useState('10000')
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('5000')
  const [usageLimit, setUsageLimit] = useState('500')
  const [description, setDescription] = useState('')

  const handleOpenAdd = () => {
    setEditingCoupon(null)
    setCode('')
    setDiscountType('percentage')
    setValue('10')
    setMinOrderAmount('10000')
    setMaxDiscountAmount('5000')
    setUsageLimit('500')
    setDescription('')
    setIsAddModalOpen(true)
  }

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon)
    setCode(coupon.code)
    setDiscountType(coupon.discountType)
    setValue(coupon.value.toString())
    setMinOrderAmount(coupon.minOrderAmount.toString())
    setMaxDiscountAmount(coupon.maxDiscountAmount.toString())
    setUsageLimit(coupon.usageLimit.toString())
    setDescription(coupon.description || '')
    setIsAddModalOpen(true)
  }

  const handleSaveCoupon = (e) => {
    e.preventDefault()
    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: code.toUpperCase(),
        discountType,
        value: Number(value),
        minOrderAmount: Number(minOrderAmount),
        maxDiscountAmount: Number(maxDiscountAmount),
        usageLimit: Number(usageLimit),
        description
      })
    } else {
      addCoupon({
        code: code.toUpperCase(),
        discountType,
        value: Number(value),
        minOrderAmount: Number(minOrderAmount),
        maxDiscountAmount: Number(maxDiscountAmount),
        startDate: '2026-08-01',
        endDate: '2026-12-31',
        usageLimit: Number(usageLimit),
        description
      })
    }
    setIsAddModalOpen(false)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this coupon promo code?')) {
      deleteCoupon(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Discount Coupons Management</h1>
            <Badge variant="success">Promotions & Incentives</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, View, Edit, and Delete discount promo codes for dealers, wholesalers, and customers.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default">
          <Plus className="h-4 w-4 mr-1.5" />
          Create Discount Coupon
        </Button>
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 transition-all relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono tracking-wider">{coupon.code}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">{coupon.discountType} discount</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(coupon)}
                  className="p-1.5 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit Coupon"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="p-1.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Delete Coupon"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `${formatCurrency(coupon.value)} FLAT`}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{coupon.description}</p>

              <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                <div className="flex justify-between">
                  <span>Min Order:</span>
                  <span className="text-slate-900 dark:text-slate-200">{formatCurrency(coupon.minOrderAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Cap:</span>
                  <span className="text-slate-900 dark:text-slate-200">{formatCurrency(coupon.maxDiscountAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Redeemed:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{coupon.usageCount} / {coupon.usageLimit} times</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
              <span>Valid till Dec 31, 2026</span>
              <Badge variant="success">{coupon.status}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Coupon Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingCoupon ? 'Edit Discount Coupon' : 'Create New Discount Coupon'}
        description="Set promo code, discount type, minimum order spend, and usage caps."
      >
        <form onSubmit={handleSaveCoupon} className="space-y-4">
          <Input
            label="Coupon Promo Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. FEAST10 or FESTIVE2026"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <Input
              label={discountType === 'percentage' ? 'Percentage Value (%)' : 'Flat Amount (₹)'}
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Minimum Order Spend (₹)"
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              required
            />
            <Input
              label="Maximum Cap Limit (₹)"
              type="number"
              value={maxDiscountAmount}
              onChange={(e) => setMaxDiscountAmount(e.target.value)}
              required
            />
          </div>

          <Input
            label="Usage Limit Count"
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            required
          />

          <Input
            label="Description / Marketing Text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief explanation of offer terms..."
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
