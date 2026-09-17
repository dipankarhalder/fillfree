import React, { useState } from 'react'
import {
  Users,
  MapPin,
  Phone,
  Mail,
  Building,
  CreditCard,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  Edit,
  Trash2,
  FileSpreadsheet
} from 'lucide-react'
import { useDataStore } from '@/store/useDataStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency } from '@/lib/utils'
import { exportToExcel } from '@/lib/exportUtils'

export const PartnersView = () => {
  const { partners, addPartner, updatePartner, deletePartner } = useDataStore()
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All')
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState(null)

  // Partner Form State
  const [role, setRole] = useState('Dealer')
  const [businessName, setBusinessName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gstin, setGstin] = useState('')
  const [city, setCity] = useState('Kolkata')
  const [state, setState] = useState('West Bengal')
  const [creditLimit, setCreditLimit] = useState('500000')

  const roles = [
    { id: 'All', label: 'All Partners' },
    { id: 'Dealer', label: 'Dealers' },
    { id: 'Suppliers', label: 'Suppliers' },
    { id: 'whole_saler', label: 'Wholesalers' },
    { id: 'shop_saler', label: 'Shop Salers' }
  ]

  const filteredPartners = partners.filter(p => {
    if (selectedRoleFilter === 'All') return true
    return p.role === selectedRoleFilter
  })

  const getRoleBadgeVariant = (r) => {
    switch (r) {
      case 'Dealer': return 'emerald'
      case 'Suppliers': return 'warning'
      case 'whole_saler': return 'purple'
      case 'shop_saler': return 'cyan'
      default: return 'default'
    }
  }

  const openPartnerDetails = (partner) => {
    setSelectedPartner(partner)
    setIsDetailModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingPartner(null)
    setRole('Dealer')
    setBusinessName('')
    setContactPerson('')
    setEmail('')
    setPhone('')
    setGstin('')
    setCity('Kolkata')
    setState('West Bengal')
    setCreditLimit('500000')
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (partner) => {
    setEditingPartner(partner)
    setRole(partner.role)
    setBusinessName(partner.businessName)
    setContactPerson(partner.contactPerson)
    setEmail(partner.email)
    setPhone(partner.phone)
    setGstin(partner.gstin)
    setCity(partner.locationDetails?.city || 'Kolkata')
    setState(partner.locationDetails?.state || 'West Bengal')
    setCreditLimit(partner.billingDetails?.creditLimit?.toString() || '500000')
    setIsFormModalOpen(true)
  }

  const handleSavePartner = (e) => {
    e.preventDefault()
    if (editingPartner) {
      updatePartner(editingPartner.id, {
        role,
        businessName,
        contactPerson,
        email,
        phone,
        gstin,
        personalDetails: { ...editingPartner.personalDetails, ownerName: contactPerson, mobile: phone },
        locationDetails: { ...editingPartner.locationDetails, city, state },
        billingDetails: { ...editingPartner.billingDetails, creditLimit: Number(creditLimit) }
      })
    } else {
      addPartner({
        role,
        businessName,
        contactPerson,
        email,
        phone,
        gstin,
        personalDetails: { ownerName: contactPerson, mobile: phone, altEmail: email, registrationDate: new Date().toISOString().split('T')[0] },
        locationDetails: { street: 'Commercial Zone', city, state, pincode: '700001', country: 'India', coordinates: '22.5726° N, 88.3639° E' },
        purchaseDetails: { totalOrders: 0, totalSpent: 0, lastOrderDate: 'N/A' },
        billingDetails: { creditLimit: Number(creditLimit), outstandingBalance: 0, paymentTerms: 'Net 15 Days', bankName: 'HDFC Bank', accountNumber: '502000' + Math.floor(100000 + Math.random() * 900000) }
      })
    }
    setIsFormModalOpen(false)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this partner record?')) {
      deletePartner(id)
    }
  }

  const handleExportExcel = () => {
    const dataToExport = filteredPartners.map((p, idx) => ({
      'SL No': idx + 1,
      'Partner ID': p.id,
      'Business / Company Name': p.businessName,
      'Trade Role': (p.role || '').replace('_', ' ').toUpperCase(),
      'Contact Person': p.contactPerson,
      'Email Address': p.email,
      'Phone Number': p.phone,
      'GSTIN': p.gstin || 'N/A',
      'City': p.locationDetails?.city || 'Kolkata',
      'State': p.locationDetails?.state || 'West Bengal',
      'Credit Limit (₹)': p.creditLimit || 500000,
      'Account Status': p.status || 'Active'
    }))
    exportToExcel(dataToExport, 'fillfree_partners_crm_directory', 'Trade Partners')
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Partner Directory</h1>
            <Badge variant="default">Dealers • Suppliers • Wholesalers • Shop Salers</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, View, Edit, and Delete partner profiles with personal details, location maps, and billing records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="gap-1.5 text-xs h-9 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            title="Download Partners Directory in Excel Format (.xlsx)"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Download Excel</span>
          </Button>

          <Button onClick={handleOpenAdd} variant="default" className="text-xs h-9">
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Partner
          </Button>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {roles.map(r => (
          <button
            key={r.id}
            onClick={() => setSelectedRoleFilter(r.id)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              selectedRoleFilter === r.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPartners.map(p => (
          <Card key={p.id} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant={getRoleBadgeVariant(p.role)} className="uppercase text-[10px]">
                  {p.role.replace('_', ' ')}
                </Badge>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{p.businessName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Contact: {p.contactPerson}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                  {p.gstin}
                </span>
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Edit Partner"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                  title="Delete Partner"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-y border-slate-100 dark:border-slate-800/80 py-3">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>{p.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate">
                <Mail className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                <span className="truncate">{p.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 col-span-2">
                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span className="truncate">{p.locationDetails.city}, {p.locationDetails.state}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Outstanding Balance</p>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{formatCurrency(p.billingDetails.outstandingBalance)}</p>
              </div>

              <Button onClick={() => openPartnerDetails(p)} variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* View Details Modal */}
      {selectedPartner && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`${selectedPartner.businessName} Details`}
          description={`Comprehensive partner breakdown including personal info, location, purchase records, and billing.`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800">
              <div>
                <Badge variant={getRoleBadgeVariant(selectedPartner.role)} className="uppercase">
                  {selectedPartner.role.replace('_', ' ')}
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedPartner.businessName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">GSTIN Tax ID: <span className="font-mono text-slate-900 dark:text-slate-200">{selectedPartner.gstin}</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Payment Terms</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{selectedPartner.billingDetails.paymentTerms}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> Personal & Owner Details
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <p><strong className="text-slate-500 dark:text-slate-400">Owner Name:</strong> {selectedPartner.personalDetails.ownerName}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Mobile Phone:</strong> {selectedPartner.personalDetails.mobile}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Work Email:</strong> {selectedPartner.email}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Reg. Date:</strong> {selectedPartner.personalDetails.registrationDate}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Location & Warehouse Address
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <p>{selectedPartner.locationDetails.street}</p>
                  <p>{selectedPartner.locationDetails.city}, {selectedPartner.locationDetails.state} - {selectedPartner.locationDetails.pincode}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Geo: {selectedPartner.locationDetails.coordinates}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <FileText className="h-4 w-4" /> Purchase & Supply History
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <p><strong className="text-slate-500 dark:text-slate-400">Total Volume:</strong> {formatCurrency(selectedPartner.purchaseDetails.totalSpent || selectedPartner.purchaseDetails.totalValueSupplied || 0)}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Last Action Date:</strong> {selectedPartner.purchaseDetails.lastOrderDate || selectedPartner.purchaseDetails.lastSupplyDate}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Favorite Category:</strong> {selectedPartner.purchaseDetails.favoriteCategory || 'Electronics'}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" /> Billing & Credit Ledger
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <p><strong className="text-slate-500 dark:text-slate-400">Credit Limit:</strong> {formatCurrency(selectedPartner.billingDetails.creditLimit)}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Outstanding:</strong> <span className="font-bold text-amber-600 dark:text-amber-400">{formatCurrency(selectedPartner.billingDetails.outstandingBalance)}</span></p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Bank Name:</strong> {selectedPartner.billingDetails.bankName}</p>
                  <p><strong className="text-slate-500 dark:text-slate-400">Account No:</strong> <span className="font-mono text-slate-900 dark:text-slate-200">{selectedPartner.billingDetails.accountNumber}</span></p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setIsDetailModalOpen(false)} variant="outline">
                Close Window
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Partner Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingPartner ? 'Edit Partner Details' : 'Add New Partner Entity'}
        description="Register or update partner details, GSTIN tax ID, and credit limits."
      >
        <form onSubmit={handleSavePartner} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Partner Role Category
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Dealer">Dealer</option>
              <option value="Suppliers">Supplier</option>
              <option value="whole_saler">Wholesaler</option>
              <option value="shop_saler">Shop Saler</option>
            </select>
          </div>

          <Input
            label="Business / Company Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Apex Microelectronics Ltd."
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contact Person Name"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g. Sanjay Dutt"
              required
            />
            <Input
              label="GSTIN / Tax ID"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="e.g. 19AAACT1234A1Z5"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
            />
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@business.com"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <Input label="State" value={state} onChange={(e) => setState(e.target.value)} required />
            <Input label="Credit Limit (₹)" type="number" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} required />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {editingPartner ? 'Update Partner' : 'Create Partner'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
