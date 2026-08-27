import React, { useState } from 'react'
import {
  UserCheck,
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  Phone,
  Mail,
  Plus,
  Shield,
  CreditCard,
  Briefcase,
  Edit,
  Trash2
} from 'lucide-react'
import { useDataStore } from '@/store/useDataStore'
import { useWarehouseStore } from '@/store/useWarehouseStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency } from '@/lib/utils'

export const PersonnelView = () => {
  const { personnel, addPersonnel, updatePersonnel, deletePersonnel } = useDataStore()
  const { warehouses } = useWarehouseStore()

  const [roleFilter, setRoleFilter] = useState('All')
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)

  // Staff Form State
  const [role, setRole] = useState('member_stuff')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [baseSalary, setBaseSalary] = useState('65000')
  const [allowances, setAllowances] = useState('12000')
  const [pfDeduction, setPfDeduction] = useState('3900')
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || '')

  const filteredPersonnel = personnel.filter(p => {
    if (roleFilter === 'All') return true
    return p.role === roleFilter
  })

  const openStaffModal = (staff) => {
    setSelectedStaff(staff)
    setIsDetailModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingStaff(null)
    setRole('member_stuff')
    setName('')
    setEmail('')
    setPhone('')
    setBaseSalary('65000')
    setAllowances('12000')
    setPfDeduction('3900')
    setWarehouseId(warehouses[0]?.id || '')
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (staff) => {
    setEditingStaff(staff)
    setRole(staff.role)
    setName(staff.name)
    setEmail(staff.email)
    setPhone(staff.phone)
    setBaseSalary(staff.salaryDetails.baseSalary.toString())
    setAllowances(staff.salaryDetails.allowances.toString())
    setPfDeduction(staff.salaryDetails.pfDeduction.toString())
    setWarehouseId(staff.assignedWarehouseId || warehouses[0]?.id)
    setIsFormModalOpen(true)
  }

  const handleSavePersonnel = (e) => {
    e.preventDefault()
    const targetWh = warehouses.find(w => w.id === warehouseId) || warehouses[0]

    const base = Number(baseSalary)
    const allow = Number(allowances)
    const pf = Number(pfDeduction)
    const net = base + allow - pf

    if (editingStaff) {
      updatePersonnel(editingStaff.id, {
        role,
        name,
        email,
        phone,
        assignedWarehouseId: targetWh.id,
        assignedWarehouseName: targetWh.name,
        salaryDetails: {
          ...editingStaff.salaryDetails,
          baseSalary: base,
          allowances: allow,
          pfDeduction: pf,
          netSalary: net
        }
      })
    } else {
      addPersonnel({
        role,
        name,
        email,
        phone,
        personalDetails: { dob: '1992-05-10', gender: 'Male', emergencyContact: '+91 98000 11223', joinDate: new Date().toISOString().split('T')[0] },
        locationDetails: { address: 'Salt Lake City', city: targetWh.city, state: targetWh.state, branchOffice: targetWh.name },
        salaryDetails: { baseSalary: base, allowances: allow, pfDeduction: pf, netSalary: net, payFrequency: 'Monthly', lastPaidDate: '2026-08-01', bankAccount: 'HDFC Bank - 50100' + Math.floor(1000 + Math.random() * 9000) },
        assignedWarehouseId: targetWh.id,
        assignedWarehouseName: targetWh.name
      })
    }
    setIsFormModalOpen(false)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this staff member record?')) {
      deletePersonnel(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admin & Member Staff Directory</h1>
            <Badge variant="default">Full Personnel CRUD</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, View, Edit, and Delete internal personnel profiles, work locations, salary packages, and warehouse assignments.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Personnel Record
        </Button>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2">
        {['All', 'Admin', 'member_stuff'].map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              roleFilter === r
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {r === 'All' ? 'All Personnel' : r === 'Admin' ? 'Admins' : 'Member Staff'}
          </button>
        ))}
      </div>

      {/* Personnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredPersonnel.map((staff) => (
          <Card key={staff.id} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <img
                  src={staff.avatar}
                  alt={staff.name}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <Badge variant={staff.role === 'Admin' ? 'default' : 'purple'}>
                    {staff.role === 'Admin' ? 'Admin' : 'Member Staff'}
                  </Badge>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{staff.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{staff.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(staff)}
                  className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Edit Personnel"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(staff.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                  title="Delete Personnel"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" /> Facility:
                </span>
                <span className="font-medium text-slate-900 dark:text-white truncate max-w-[140px]">
                  {staff.assignedWarehouseName || 'Kolkata HQ'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" /> Net Salary:
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatCurrency(staff.salaryDetails.netSalary)} / mo
                </span>
              </div>
            </div>

            <div className="mt-4 pt-2">
              <Button onClick={() => openStaffModal(staff)} variant="outline" className="w-full text-xs">
                Check Personal & Salary File
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Staff Detailed Modal */}
      {selectedStaff && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`${selectedStaff.name} Personnel File`}
          description="Complete profile overview including personal details, office location, and salary breakdown."
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800">
              <img
                src={selectedStaff.avatar}
                alt={selectedStaff.name}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500"
              />
              <div>
                <Badge variant={selectedStaff.role === 'Admin' ? 'default' : 'purple'}>
                  {selectedStaff.role === 'Admin' ? 'Admin' : 'Member Staff'}
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedStaff.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedStaff.email} • {selectedStaff.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4" /> Personal Information
                </h4>
                <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <p><strong className="text-slate-500 dark:text-slate-400">Date of Birth:</strong> {selectedStaff.personalDetails.dob}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Gender:</strong> {selectedStaff.personalDetails.gender}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Date Joined:</strong> {selectedStaff.personalDetails.joinDate}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Emergency Contact:</strong> {selectedStaff.personalDetails.emergencyContact}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Work Location & Branch
                </h4>
                <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <p><strong className="text-slate-500 dark:text-slate-400">Residential Address:</strong> {selectedStaff.locationDetails.address}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">City / State:</strong> {selectedStaff.locationDetails.city}, {selectedStaff.locationDetails.state}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Branch Office:</strong> {selectedStaff.locationDetails.branchOffice}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Assigned Facility:</strong> <span className="font-bold text-indigo-600 dark:text-indigo-300">{selectedStaff.assignedWarehouseName}</span></p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <IndianRupee className="h-4 w-4" /> Salary & Payroll Structure
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase">Base Salary</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 mt-0.5">{formatCurrency(selectedStaff.salaryDetails.baseSalary)}</p>
                </div>
                <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase">Allowances</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">+{formatCurrency(selectedStaff.salaryDetails.allowances)}</p>
                </div>
                <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase">PF Deduction</p>
                  <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mt-0.5">-{formatCurrency(selectedStaff.salaryDetails.pfDeduction)}</p>
                </div>
                <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase">Net Monthly Payout</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatCurrency(selectedStaff.salaryDetails.netSalary)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Bank Account: <strong className="text-slate-900 dark:text-slate-200 font-mono">{selectedStaff.salaryDetails.bankAccount}</strong></span>
                <span>Last Payout: <strong className="text-slate-900 dark:text-slate-200">{selectedStaff.salaryDetails.lastPaidDate}</strong></span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setIsDetailModalOpen(false)} variant="outline">
                Close Record Window
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Personnel Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingStaff ? 'Edit Personnel File' : 'Add New Staff Member'}
        description="Configure personal details, assigned warehouse, and monthly salary structure."
      >
        <form onSubmit={handleSavePersonnel} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Administrative Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="member_stuff">Member Staff</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Assign Warehouse Facility
              </label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Debabrata Banerjee"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rajesh@fillfree.com"
              required
            />
            <Input
              label="Phone Contact"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98301 11223"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Base Salary (₹)"
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              required
            />
            <Input
              label="Allowances (₹)"
              type="number"
              value={allowances}
              onChange={(e) => setAllowances(e.target.value)}
              required
            />
            <Input
              label="PF Deduction (₹)"
              type="number"
              value={pfDeduction}
              onChange={(e) => setPfDeduction(e.target.value)}
              required
            />
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs flex justify-between font-mono">
            <span className="text-slate-500 dark:text-slate-400">Calculated Net Monthly Payout:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {formatCurrency(Number(baseSalary) + Number(allowances) - Number(pfDeduction))}
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {editingStaff ? 'Update Staff Record' : 'Create Staff Record'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
