import React, { useState } from 'react'
import {
  Package,
  Plus,
  Search,
  Grid,
  Tag,
  Layers,
  Building2,
  Trash2,
  Edit,
  IndianRupee,
  Ticket,
  Calculator,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { useDataStore } from '@/store/useDataStore'
import { useWarehouseStore } from '@/store/useWarehouseStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency } from '@/lib/utils'

export const ProductsView = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useDataStore()
  const { warehouses } = useWarehouseStore()

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Form State
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [category, setCategory] = useState(categories[0]?.name || 'Electronics & Hardware')
  const [subcategory, setSubcategory] = useState('Monitors & Displays')
  const [price, setPrice] = useState('15000')
  const [mrp, setMrp] = useState('18000')
  const [totalStockReceived, setTotalStockReceived] = useState('25')
  const [damagedCount, setDamagedCount] = useState('3')
  const [expiredCount, setExpiredCount] = useState('2')
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || '')
  const [roomName, setRoomName] = useState('Room A')
  const [rowName, setRowName] = useState('Row 01')
  const [shelfName, setShelfName] = useState('Shelf A1')
  const [eligibleCoupon, setEligibleCoupon] = useState('FEAST10')
  const [description, setDescription] = useState('')

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory
    const query = searchQuery.toLowerCase()
    const matchesSearch = (
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.lotCode?.toLowerCase().includes(query)
    )
    return matchesCat && matchesSearch
  })

  const calculatedGoodQty = Math.max(0, Number(totalStockReceived) - (Number(damagedCount) + Number(expiredCount)))

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setName('')
    setSku('')
    setCategory(categories[0]?.name || 'Electronics & Hardware')
    setSubcategory('Monitors & Displays')
    setPrice('15000')
    setMrp('18000')
    setTotalStockReceived('25')
    setDamagedCount('3')
    setExpiredCount('2')
    setWarehouseId(warehouses[0]?.id || '')
    setRoomName('Room A')
    setRowName('Row 01')
    setShelfName('Shelf A1')
    setEligibleCoupon('FEAST10')
    setDescription('')
    setIsAddModalOpen(true)
  }

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod)
    setName(prod.name)
    setSku(prod.sku)
    setCategory(prod.category)
    setSubcategory(prod.subcategory)
    setPrice(prod.price.toString())
    setMrp(prod.mrp.toString())
    setTotalStockReceived((prod.totalStockReceived || prod.quantity).toString())
    setDamagedCount((prod.damagedCount || 0).toString())
    setExpiredCount((prod.expiredCount || 0).toString())
    setWarehouseId(prod.warehouseId)
    setRoomName(prod.roomName)
    setRowName(prod.rowName)
    setShelfName(prod.shelfName)
    setEligibleCoupon(prod.eligibleCoupon || '')
    setDescription(prod.description || '')
    setIsAddModalOpen(true)
  }

  const handleSaveProduct = (e) => {
    e.preventDefault()
    const targetWh = warehouses.find(w => w.id === warehouseId) || warehouses[0]
    const totRec = Number(totalStockReceived)
    const dmg = Number(damagedCount)
    const exp = Number(expiredCount)
    const good = Math.max(0, totRec - (dmg + exp))

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        sku,
        category,
        subcategory,
        price: Number(price),
        mrp: Number(mrp),
        totalStockReceived: totRec,
        goodQty: good,
        damagedCount: dmg,
        expiredCount: exp,
        quantity: good,
        warehouseId: targetWh.id,
        warehouseName: targetWh.name,
        roomName,
        rowName,
        shelfName,
        eligibleCoupon,
        description
      })
    } else {
      addProduct({
        name,
        sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        category,
        subcategory,
        price: Number(price),
        mrp: Number(mrp),
        totalStockReceived: totRec,
        goodQty: good,
        damagedCount: dmg,
        expiredCount: exp,
        quantity: good,
        minQuantityThreshold: 10,
        warehouseId: targetWh.id,
        warehouseName: targetWh.name,
        roomName,
        rowName,
        shelfName,
        lotCode: `LOT-202608-${Math.floor(1000 + Math.random() * 9000)}`,
        eligibleCoupon,
        description
      })
    }

    setIsAddModalOpen(false)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product item?')) {
      deleteProduct(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Product Catalog & Category Inventory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Reconciles <strong className="text-indigo-600 dark:text-indigo-400">Total Stock = Good Sellable + Damaged Goods + Expired Goods</strong> for every SKU.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default">
          <Plus className="h-4 w-4 mr-1.5" />
          Add New Product
        </Button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, SKU, Lot..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
        <CardContent className="pt-5">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-950 uppercase text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Product Name & SKU</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Unit Price & MRP</th>
                  <th className="px-4 py-3">Stock Breakdown (Total = Good + Damaged + Expired)</th>
                  <th className="px-4 py-3">Warehouse & Bin</th>
                  <th className="px-4 py-3">Lot Code</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => {
                    const totalRec = prod.totalStockReceived || prod.quantity
                    const dmg = prod.damagedCount || 0
                    const exp = prod.expiredCount || 0
                    const good = prod.goodQty !== undefined ? prod.goodQty : prod.quantity

                    return (
                      <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          <div>{prod.name}</div>
                          <span className="font-mono text-[10px] text-slate-400">{prod.sku}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-800 dark:text-slate-200 font-medium">{prod.category}</div>
                          <span className="text-[10px] text-slate-400">{prod.subcategory}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(prod.price)}</div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through">{formatCurrency(prod.mrp)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 font-mono text-xs">
                            <span className="font-bold text-slate-900 dark:text-white">{totalRec} Total</span>
                            <span className="text-slate-400">=</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                              {good} Good
                            </span>
                            <span className="text-slate-400">+</span>
                            <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                              {dmg} Dmg
                            </span>
                            <span className="text-slate-400">+</span>
                            <span className="text-purple-600 dark:text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded">
                              {exp} Exp
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-700 dark:text-slate-300 font-medium">{prod.warehouseName}</div>
                          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-300">
                            {prod.roomName} • {prod.rowName} ({prod.shelfName})
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="purple" className="font-mono">
                            {prod.lotCode}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                      No products found matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingProduct ? 'Edit Product Details' : 'Add New Product with Stock Reconciliation'}
        description="Specify total stock received, damaged units, and expired units. Good sellable stock is auto-calculated."
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <Input
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Smart LED Monitor 27''"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="SKU Code"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. ELE-MON-2701"
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Selling Price (₹)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              label="MRP List Price (₹)"
              type="number"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              required
            />
          </div>

          {/* Stock Accounting Inputs (Formula: Total = Good + Damaged + Expired) */}
          <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-slate-50 dark:bg-slate-950 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Calculator className="h-4 w-4" /> Stock Accounting Breakdown (Formula Rule)
            </p>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Total Received"
                type="number"
                value={totalStockReceived}
                onChange={(e) => setTotalStockReceived(e.target.value)}
                placeholder="25"
                required
              />
              <Input
                label="Damaged Units"
                type="number"
                value={damagedCount}
                onChange={(e) => setDamagedCount(e.target.value)}
                placeholder="3"
                required
              />
              <Input
                label="Expired Units"
                type="number"
                value={expiredCount}
                onChange={(e) => setExpiredCount(e.target.value)}
                placeholder="2"
                required
              />
            </div>

            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-300">Auto-Calculated Good / Sellable Stock:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                {calculatedGoodQty} units
              </span>
            </div>
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
                <option key={w.id} value={w.id}>{w.name} ({w.city})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            <Input label="Row ID" value={rowName} onChange={(e) => setRowName(e.target.value)} />
            <Input label="Shelf / Cell ID" value={shelfName} onChange={(e) => setShelfName(e.target.value)} />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
