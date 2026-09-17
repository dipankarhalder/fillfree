import React, { useState } from 'react'
import {
  Settings2,
  Ruler,
  Layers,
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  X,
  Sparkles,
  Tag,
  Package,
  FileSpreadsheet
} from 'lucide-react'
import { useMasterStore, STATUS_DOMAINS, COLOR_OPTIONS } from '@/store/useMasterStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useDataStore } from '@/store/useDataStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { exportToExcel } from '@/lib/exportUtils'

export const MastersView = () => {
  const { currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'Super_admin'

  const {
    units,
    statuses,
    addUnit,
    updateUnit,
    deleteUnit,
    addStatus,
    updateStatus,
    deleteStatus
  } = useMasterStore()

  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory
  } = useDataStore()

  const [activeTab, setActiveTab] = useState('units')

  // --- UNIT MODAL STATE ---
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState(null)
  const [unitCode, setUnitCode] = useState('')
  const [unitName, setUnitName] = useState('')
  const [unitSymbol, setUnitSymbol] = useState('')
  const [unitIsDecimal, setUnitIsDecimal] = useState(false)
  const [unitStatus, setUnitStatus] = useState('Active')
  const [unitDescription, setUnitDescription] = useState('')
  const [unitSearch, setUnitSearch] = useState('')

  // --- STATUS MODAL STATE ---
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [editingStatus, setEditingStatus] = useState(null)
  const [statusName, setStatusName] = useState('')
  const [statusCode, setStatusCode] = useState('')
  const [statusDomain, setStatusDomain] = useState('Sales & Orders')
  const [statusColor, setStatusColor] = useState(COLOR_OPTIONS[0].value)
  const [statusDescription, setStatusDescription] = useState('')
  const [statusDomainFilter, setStatusDomainFilter] = useState('All Domains')
  const [statusSearch, setStatusSearch] = useState('')

  // --- CATEGORY MODAL STATE ---
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [catName, setCatName] = useState('')
  const [catDescription, setCatDescription] = useState('')
  const [subcatList, setSubcatList] = useState([])
  const [newSubcatInput, setNewSubcatInput] = useState('')
  const [categorySearch, setCategorySearch] = useState('')

  // Inline Subcat in Card
  const [activeInlineCatId, setActiveInlineCatId] = useState(null)
  const [inlineSubcatInput, setInlineSubcatInput] = useState('')

  // ----------------------------------------------------
  // UNIT HANDLERS
  // ----------------------------------------------------
  const handleOpenAddUnit = () => {
    setEditingUnit(null)
    setUnitCode('')
    setUnitName('')
    setUnitSymbol('')
    setUnitIsDecimal(false)
    setUnitStatus('Active')
    setUnitDescription('')
    setIsUnitModalOpen(true)
  }

  const handleOpenEditUnit = (u) => {
    setEditingUnit(u)
    setUnitCode(u.code)
    setUnitName(u.name)
    setUnitSymbol(u.symbol)
    setUnitIsDecimal(!!u.isDecimalAllowed)
    setUnitStatus(u.status || 'Active')
    setUnitDescription(u.description || '')
    setIsUnitModalOpen(true)
  }

  const handleSaveUnit = (e) => {
    e.preventDefault()
    if (!unitCode.trim() || !unitName.trim()) return

    if (editingUnit) {
      updateUnit(editingUnit.id, {
        code: unitCode,
        name: unitName,
        symbol: unitSymbol || unitCode.toLowerCase(),
        isDecimalAllowed: unitIsDecimal,
        status: unitStatus,
        description: unitDescription
      })
    } else {
      addUnit({
        code: unitCode,
        name: unitName,
        symbol: unitSymbol || unitCode.toLowerCase(),
        isDecimalAllowed: unitIsDecimal,
        status: unitStatus,
        description: unitDescription
      })
    }
    setIsUnitModalOpen(false)
  }

  const handleDeleteUnit = (id, code) => {
    if (confirm(`Are you sure you want to delete Unit of Measure "${code}"?`)) {
      deleteUnit(id)
    }
  }

  const filteredUnits = units.filter(u =>
    u.code.toLowerCase().includes(unitSearch.toLowerCase()) ||
    u.name.toLowerCase().includes(unitSearch.toLowerCase()) ||
    (u.description && u.description.toLowerCase().includes(unitSearch.toLowerCase()))
  )

  // ----------------------------------------------------
  // STATUS HANDLERS
  // ----------------------------------------------------
  const handleOpenAddStatus = () => {
    setEditingStatus(null)
    setStatusName('')
    setStatusCode('')
    setStatusDomain('Sales & Orders')
    setStatusColor(COLOR_OPTIONS[0].value)
    setStatusDescription('')
    setIsStatusModalOpen(true)
  }

  const handleOpenEditStatus = (s) => {
    setEditingStatus(s)
    setStatusName(s.name)
    setStatusCode(s.code)
    setStatusDomain(s.domain)
    setStatusColor(s.colorBadge)
    setStatusDescription(s.description || '')
    setIsStatusModalOpen(true)
  }

  const handleSaveStatus = (e) => {
    e.preventDefault()
    if (!statusName.trim() || !statusCode.trim()) return

    if (editingStatus) {
      updateStatus(editingStatus.id, {
        name: statusName,
        code: statusCode,
        domain: statusDomain,
        colorBadge: statusColor,
        description: statusDescription
      })
    } else {
      addStatus({
        name: statusName,
        code: statusCode,
        domain: statusDomain,
        colorBadge: statusColor,
        description: statusDescription
      })
    }
    setIsStatusModalOpen(false)
  }

  const handleDeleteStatus = (id, name) => {
    if (confirm(`Are you sure you want to delete status "${name}"?`)) {
      deleteStatus(id)
    }
  }

  const filteredStatuses = statuses.filter(s => {
    const matchesDomain = statusDomainFilter === 'All Domains' || s.domain === statusDomainFilter
    const matchesSearch =
      s.name.toLowerCase().includes(statusSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(statusSearch.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(statusSearch.toLowerCase()))
    return matchesDomain && matchesSearch
  })

  // ----------------------------------------------------
  // CATEGORY HANDLERS
  // ----------------------------------------------------
  const handleOpenAddCategory = () => {
    setEditingCategory(null)
    setCatName('')
    setCatDescription('')
    setSubcatList([])
    setNewSubcatInput('')
    setIsCategoryModalOpen(true)
  }

  const handleOpenEditCategory = (c) => {
    setEditingCategory(c)
    setCatName(c.name)
    setCatDescription(c.description || '')
    setSubcatList(c.subcategories || [])
    setNewSubcatInput('')
    setIsCategoryModalOpen(true)
  }

  const handleAddSubcatToModal = () => {
    if (!newSubcatInput.trim()) return
    if (!subcatList.includes(newSubcatInput.trim())) {
      setSubcatList([...subcatList, newSubcatInput.trim()])
    }
    setNewSubcatInput('')
  }

  const handleRemoveSubcatFromModal = (subcat) => {
    setSubcatList(subcatList.filter(s => s !== subcat))
  }

  const handleSaveCategory = (e) => {
    e.preventDefault()
    if (!catName.trim()) return

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catName,
        description: catDescription,
        subcategories: subcatList
      })
    } else {
      addCategory({
        name: catName,
        description: catDescription,
        subcategories: subcatList
      })
    }
    setIsCategoryModalOpen(false)
  }

  const handleDeleteCategory = (id, name) => {
    if (confirm(`Are you sure you want to delete Category "${name}" and all associated subcategories?`)) {
      deleteCategory(id)
    }
  }

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.subcategories?.some(s => s.toLowerCase().includes(categorySearch.toLowerCase()))
  )

  const getProductCountForCat = (catName) => {
    return products.filter(p => p.category === catName).length
  }

  const handleExportUnitsExcel = () => {
    const exportData = units.map(u => ({
      'Unit Code': u.code,
      'Unit Name': u.name,
      'Symbol': u.symbol,
      'Decimal Allowed': u.isDecimal ? 'Yes' : 'No',
      'Status': u.status,
      'System Core': u.isSystemDefault ? 'Yes' : 'No',
      'Description': u.description || ''
    }))
    exportToExcel(exportData, 'FillFree_UOM_Master', 'Units of Measure')
  }

  const handleExportStatusesExcel = () => {
    const exportData = statuses.map(s => ({
      'Status Name': s.name,
      'Status Code': s.code,
      'Workflow Domain': s.domain,
      'System Core': s.isSystemDefault ? 'Yes' : 'No',
      'Description': s.description || ''
    }))
    exportToExcel(exportData, 'FillFree_Workflow_Statuses_Master', 'Workflow Statuses')
  }

  const handleExportCategoriesExcel = () => {
    const exportData = categories.map(c => ({
      'Category Name': c.name,
      'Subcategories Count': c.subcategories?.length || 0,
      'Subcategories': (c.subcategories || []).join(', '),
      'Total Products Linked': getProductCountForCat(c.name),
      'Description': c.description || ''
    }))
    exportToExcel(exportData, 'FillFree_Categories_Taxonomy_Master', 'Categories & Taxonomies')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Super Admin Privilege Notification */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-md shadow-indigo-500/20">
              <Settings2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Master Configuration Console
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Centralized ERP Master Data: Units of Measure (UOM), System Workflow Statuses & Taxonomy
              </p>
            </div>
          </div>
        </div>

        {/* Super Admin Status Badge */}
        <div className="flex items-center gap-2">
          {isSuperAdmin ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Super Admin Access (Full Read / Write)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <span>View Only (Super Admin Required to Modify)</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'units', label: `Units of Measure (${units.length})` },
          { id: 'statuses', label: `System Statuses (${statuses.length})` },
          { id: 'categories', label: `Categories & Subcategories (${categories.length})` }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* ========================================================================= */}
      {/* TAB 1: UNITS OF MEASUREMENT */}
      {/* ========================================================================= */}
      {activeTab === 'units' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-indigo-500" />
                  Units of Measurement (UOM)
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure primary and secondary units for inventory stocking, purchasing, and sales dispatch.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative w-48 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search units..."
                    value={unitSearch}
                    onChange={(e) => setUnitSearch(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportUnitsExcel}
                  className="gap-1.5 h-9 text-xs"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Download Excel</span>
                </Button>

                <Button
                  onClick={handleOpenAddUnit}
                  disabled={!isSuperAdmin}
                  className="gap-1.5 h-9 text-xs"
                  title={!isSuperAdmin ? 'Only Super Admin can add units' : ''}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Unit
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 uppercase text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-3">UOM Code</th>
                      <th className="px-5 py-3">Unit Name</th>
                      <th className="px-5 py-3">Symbol</th>
                      <th className="px-5 py-3">Decimal Precision</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Description</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUnits.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-400">
                          No units of measurement found matching "{unitSearch}".
                        </td>
                      </tr>
                    ) : (
                      filteredUnits.map((unit) => (
                        <tr key={unit.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="px-5 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {unit.code}
                          </td>
                          <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">
                            {unit.name}
                          </td>
                          <td className="px-5 py-3 font-mono text-slate-600 dark:text-slate-400">
                            {unit.symbol}
                          </td>
                          <td className="px-5 py-3">
                            <Badge className={unit.isDecimalAllowed ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}>
                              {unit.isDecimalAllowed ? 'Decimals Allowed' : 'Integer Only'}
                            </Badge>
                          </td>
                          <td className="px-5 py-3">
                            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                              {unit.status || 'Active'}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 text-slate-500 max-w-xs truncate">
                            {unit.description || '—'}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!isSuperAdmin}
                                onClick={() => handleOpenEditUnit(unit)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                title="Edit Unit"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!isSuperAdmin}
                                onClick={() => handleDeleteUnit(unit.id, unit.code)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                                title="Delete Unit"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SYSTEM WORKFLOW STATUSES */}
      {/* ========================================================================= */}
      {activeTab === 'statuses' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-500" />
                  Workflow Lifecycle Statuses
                </CardTitle>
                <CardDescription className="text-xs">
                  Manage standard status tokens for Orders, Inward Lots, Payments, Stock Audit & CRM accounts.
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Domain Selector */}
                <select
                  value={statusDomainFilter}
                  onChange={(e) => setStatusDomainFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {STATUS_DOMAINS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <div className="relative w-40 sm:w-56">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search status..."
                    value={statusSearch}
                    onChange={(e) => setStatusSearch(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportStatusesExcel}
                  className="gap-1.5 h-9 text-xs"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Download Excel</span>
                </Button>

                <Button
                  onClick={handleOpenAddStatus}
                  disabled={!isSuperAdmin}
                  className="gap-1.5 h-9 text-xs"
                  title={!isSuperAdmin ? 'Only Super Admin can add statuses' : ''}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Status
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 uppercase text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-3">Status Name</th>
                      <th className="px-5 py-3">Token Code</th>
                      <th className="px-5 py-3">Workflow Domain</th>
                      <th className="px-5 py-3">Visual Badge Token</th>
                      <th className="px-5 py-3">System Type</th>
                      <th className="px-5 py-3">Description</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStatuses.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-400">
                          No statuses found for selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredStatuses.map((stat) => (
                        <tr key={stat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-900 dark:text-white">
                            {stat.name}
                          </td>
                          <td className="px-5 py-3 font-mono text-slate-500">
                            {stat.code}
                          </td>
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {stat.domain}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <Badge className={stat.colorBadge}>
                              {stat.name}
                            </Badge>
                          </td>
                          <td className="px-5 py-3">
                            {stat.isSystemDefault ? (
                              <span className="text-[11px] text-indigo-500 font-medium flex items-center gap-1">
                                <Sparkles className="h-3 w-3" /> Core Default
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">Custom</span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-slate-500 max-w-xs truncate">
                            {stat.description || '—'}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!isSuperAdmin}
                                onClick={() => handleOpenEditStatus(stat)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                title="Edit Status"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!isSuperAdmin || stat.isSystemDefault}
                                onClick={() => handleDeleteStatus(stat.id, stat.name)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                                title={stat.isSystemDefault ? "System default status cannot be deleted" : "Delete Status"}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CATEGORIES & SUBCATEGORIES */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderTree className="h-4 w-4 text-emerald-500" />
                  Product Taxonomies & Subcategories
                </CardTitle>
                <CardDescription className="text-xs">
                  Hierarchical classification of catalog products, tags, and stock inventory.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative w-48 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search category or subcategory..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCategoriesExcel}
                  className="gap-1.5 h-9 text-xs"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Download Excel</span>
                </Button>

                <Button
                  onClick={handleOpenAddCategory}
                  disabled={!isSuperAdmin}
                  className="gap-1.5 h-9 text-xs"
                  title={!isSuperAdmin ? 'Only Super Admin can add categories' : ''}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Category
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((cat) => {
                  const prodCount = getProductCountForCat(cat.name)

                  return (
                    <div
                      key={cat.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
                    >
                      <div>
                        {/* Header with Title & Action */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Tag className="h-3.5 w-3.5 text-emerald-500" />
                              {cat.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {cat.description || 'No specific description provided.'}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={!isSuperAdmin}
                              onClick={() => handleOpenEditCategory(cat)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={!isSuperAdmin}
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Subcategories pill tags */}
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                            Subcategories ({cat.subcategories?.length || 0})
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {cat.subcategories?.map((sub, i) => (
                              <span
                                key={i}
                                className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                              >
                                {sub}
                                {isSuperAdmin && (
                                  <button
                                    onClick={() => deleteSubcategory(cat.id, sub)}
                                    className="opacity-40 group-hover:opacity-100 hover:text-rose-500 transition-opacity ml-0.5"
                                    title={`Remove ${sub}`}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                              </span>
                            ))}

                            {/* Inline Add Subcategory input */}
                            {isSuperAdmin && (
                              activeInlineCatId === cat.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    placeholder="Subcat name..."
                                    value={inlineSubcatInput}
                                    onChange={(e) => setInlineSubcatInput(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && inlineSubcatInput.trim()) {
                                        addSubcategory(cat.id, inlineSubcatInput.trim())
                                        setInlineSubcatInput('')
                                        setActiveInlineCatId(null)
                                      }
                                    }}
                                    autoFocus
                                    className="h-6 w-28 rounded-md border border-indigo-500 bg-slate-50 dark:bg-slate-950 px-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => {
                                      if (inlineSubcatInput.trim()) {
                                        addSubcategory(cat.id, inlineSubcatInput.trim())
                                      }
                                      setInlineSubcatInput('')
                                      setActiveInlineCatId(null)
                                    }}
                                    className="text-indigo-500 text-xs font-bold px-1"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => {
                                      setInlineSubcatInput('')
                                      setActiveInlineCatId(null)
                                    }}
                                    className="text-slate-400 text-xs px-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActiveInlineCatId(cat.id)
                                    setInlineSubcatInput('')
                                  }}
                                  className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-medium border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-indigo-500 hover:border-indigo-400 transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                  Add
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5 text-slate-400" />
                          {prodCount} Products in Stock
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {cat.id}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT UNIT */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isUnitModalOpen}
        onClose={() => setIsUnitModalOpen(false)}
        title={editingUnit ? `Edit UOM: ${editingUnit.code}` : 'Create Unit of Measure'}
      >
        <form onSubmit={handleSaveUnit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                UOM Code * (e.g. PCS, KG, LTR)
              </label>
              <Input
                required
                placeholder="e.g. BOX"
                value={unitCode}
                onChange={(e) => setUnitCode(e.target.value.toUpperCase())}
                className="font-mono uppercase font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Display Symbol (e.g. box, pcs)
              </label>
              <Input
                placeholder="e.g. box"
                value={unitSymbol}
                onChange={(e) => setUnitSymbol(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Unit Name *
            </label>
            <Input
              required
              placeholder="e.g. Packaging Carton / Master Box"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Operational Status
              </label>
              <select
                value={unitStatus}
                onChange={(e) => setUnitStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive / Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="decimalAllowedCheck"
                checked={unitIsDecimal}
                onChange={(e) => setUnitIsDecimal(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="decimalAllowedCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Allow Fractional Decimals (e.g. 1.75 kg)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description & Usage Context
            </label>
            <textarea
              rows={2}
              placeholder="Notes on where this unit is used across warehousing or sales..."
              value={unitDescription}
              onChange={(e) => setUnitDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsUnitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingUnit ? 'Save Changes' : 'Create Unit'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT STATUS */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={editingStatus ? `Edit Status: ${editingStatus.name}` : 'Create Workflow Status'}
      >
        <form onSubmit={handleSaveStatus} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status Display Name *
              </label>
              <Input
                required
                placeholder="e.g. Quality Passed"
                value={statusName}
                onChange={(e) => setStatusName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                System Code * (e.g. QC_PASS)
              </label>
              <Input
                required
                placeholder="e.g. QC_PASS"
                value={statusCode}
                onChange={(e) => setStatusCode(e.target.value.toUpperCase())}
                className="font-mono uppercase font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Workflow Domain *
              </label>
              <select
                value={statusDomain}
                onChange={(e) => setStatusDomain(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
              >
                {STATUS_DOMAINS.filter(d => d !== 'All Domains').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Badge Color Token
              </label>
              <select
                value={statusColor}
                onChange={(e) => setStatusColor(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
              >
                {COLOR_OPTIONS.map(opt => (
                  <option key={opt.label} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Preview */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Live Preview:</span>
            <Badge className={statusColor}>
              {statusName || 'Status Preview'}
            </Badge>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Lifecycle trigger conditions and business rules..."
              value={statusDescription}
              onChange={(e) => setStatusDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingStatus ? 'Save Changes' : 'Create Status'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: ADD / EDIT CATEGORY */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create Category'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category Name *
            </label>
            <Input
              required
              placeholder="e.g. Electrical Components"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category Description
            </label>
            <textarea
              rows={2}
              placeholder="Scope of products covered under this category..."
              value={catDescription}
              onChange={(e) => setCatDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Subcategories
            </label>
            <div className="flex items-center gap-2 mb-2">
              <Input
                placeholder="Type subcategory and press Add..."
                value={newSubcatInput}
                onChange={(e) => setNewSubcatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSubcatToModal()
                  }
                }}
              />
              <Button type="button" onClick={handleAddSubcatToModal} variant="secondary" className="shrink-0 text-xs">
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              {subcatList.length === 0 ? (
                <span className="text-xs text-slate-400">No subcategories added yet.</span>
              ) : (
                subcatList.map((sub, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    {sub}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcatFromModal(sub)}
                      className="text-slate-400 hover:text-rose-500 transition-colors ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
export default MastersView
