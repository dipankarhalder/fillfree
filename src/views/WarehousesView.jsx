import React, { useState } from 'react'
import {
  Building2,
  MapPin,
  Users,
  Plus,
  Search,
  Grid,
  Thermometer,
  UserCheck,
  Box,
  Layers,
  Edit,
  Trash2,
  FileSpreadsheet
} from 'lucide-react'
import { useWarehouseStore } from '@/store/useWarehouseStore'
import { useDataStore } from '@/store/useDataStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { exportToExcel } from '@/lib/exportUtils'

export const WarehousesView = () => {
  const { warehouses, addWarehouse, updateWarehouse, deleteWarehouse, selectWarehouse, selectedWarehouseId } = useWarehouseStore()
  const { products } = useDataStore()
  const [searchGridQuery, setSearchGridQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingWh, setEditingWh] = useState(null)

  // Form state
  const [whName, setWhName] = useState('')
  const [whLocation, setWhLocation] = useState('')
  const [whCity, setWhCity] = useState('')
  const [whState, setWhState] = useState('')
  const [whCapacity, setWhCapacity] = useState('75000')
  const [whManager, setWhManager] = useState('Debabrata Banerjee')

  const activeWarehouse = warehouses.find(w => w.id === selectedWarehouseId) || warehouses[0]

  const whProducts = products.filter(p => p.warehouseId === activeWarehouse?.id)

  const filteredWhProducts = whProducts.filter(p => {
    const query = searchGridQuery.toLowerCase()
    return (
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.roomName.toLowerCase().includes(query) ||
      p.rowName.toLowerCase().includes(query) ||
      p.shelfName.toLowerCase().includes(query)
    )
  })

  const handleOpenAdd = () => {
    setEditingWh(null)
    setWhName('')
    setWhLocation('')
    setWhCity('')
    setWhState('')
    setWhCapacity('75000')
    setWhManager('Debabrata Banerjee')
    setIsAddModalOpen(true)
  }

  const handleOpenEdit = (wh, e) => {
    e.stopPropagation()
    setEditingWh(wh)
    setWhName(wh.name)
    setWhLocation(wh.location)
    setWhCity(wh.city)
    setWhState(wh.state)
    setWhCapacity(wh.totalCapacity.toString())
    setWhManager(wh.managerName)
    setIsAddModalOpen(true)
  }

  const handleSaveWarehouse = (e) => {
    e.preventDefault()
    if (editingWh) {
      updateWarehouse(editingWh.id, {
        name: whName,
        location: whLocation,
        city: whCity,
        state: whState,
        totalCapacity: Number(whCapacity),
        managerName: whManager
      })
    } else {
      addWarehouse({
        name: whName,
        location: whLocation,
        city: whCity,
        state: whState,
        totalCapacity: Number(whCapacity),
        managerName: whManager,
        managerPhone: '+91 98000 12345'
      })
    }
    setIsAddModalOpen(false)
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this warehouse facility?')) {
      deleteWarehouse(id)
    }
  }

  const handleExportExcel = () => {
    const dataToExport = warehouses.map((wh, idx) => ({
      'SL No': idx + 1,
      'Facility ID': wh.id,
      'Warehouse Name': wh.name,
      'Location / Address': wh.location,
      'City': wh.city,
      'State': wh.state,
      'Occupied Capacity (Units)': wh.occupiedCapacity,
      'Total Capacity (Units)': wh.totalCapacity,
      'Occupancy Rate': `${Math.round((wh.occupiedCapacity / wh.totalCapacity) * 100)}%`,
      'Assigned Manager': wh.managerName || 'Operations Manager',
      'Assigned Staff Count': wh.staffCount || 12
    }))
    exportToExcel(dataToExport, 'fillfree_warehouses_facilities', 'Warehouses')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Warehouse & Spatial Grid Locator</h1>
            <Badge variant="purple">Multi-Warehouse ERP</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track warehouse location, capacity occupancy %, manager/staff assignments, and bin placement (Room, Row, Shelf).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="gap-1.5 text-xs h-9 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            title="Download Warehouses in Excel Format (.xlsx)"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Download Excel</span>
          </Button>

          <Button onClick={handleOpenAdd} variant="default" className="text-xs h-9">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Warehouse Facility
          </Button>
        </div>
      </div>

      {/* Warehouse Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {warehouses.map((wh) => {
          const isSelected = wh.id === activeWarehouse?.id
          const occPct = Math.round((wh.occupiedCapacity / wh.totalCapacity) * 100)

          return (
            <Card
              key={wh.id}
              onClick={() => selectWarehouse(wh.id)}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 ring-1 ring-indigo-500/50'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{wh.code}</span>
                    {isSelected && <Badge variant="default">Selected</Badge>}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{wh.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{wh.location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleOpenEdit(wh, e)}
                    className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Warehouse"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {warehouses.length > 1 && (
                    <button
                      onClick={(e) => handleDelete(wh.id, e)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                      title="Delete Warehouse"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Capacity Progress */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500 dark:text-slate-400">Capacity Occupied</span>
                  <span className="text-slate-900 dark:text-slate-200 font-mono">{wh.occupiedCapacity.toLocaleString()} / {wh.totalCapacity.toLocaleString()} units ({occPct}%)</span>
                </div>
                <ProgressBar value={wh.occupiedCapacity} max={wh.totalCapacity} color={occPct > 80 ? 'amber' : 'indigo'} />
              </div>

              {/* Manager & Staff Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>Manager: <strong className="text-slate-900 dark:text-white">{wh.managerName}</strong></span>
                </div>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                  {wh.staffCount} Staff
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Spatial Grid Explorer */}
      {activeWarehouse && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Room, Row & Shelf Storage Locator - {activeWarehouse.name}</CardTitle>
                <Badge variant="cyan">Bin Grid Map</Badge>
              </div>
              <CardDescription className="mt-1">
                Search any product item to pinpoint exact Room, Row, and Shelf/Cell coordinates.
              </CardDescription>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchGridQuery}
                onChange={(e) => setSearchGridQuery(e.target.value)}
                placeholder="Search product name, SKU, Room, Row or Shelf..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeWarehouse.rooms.map((room) => (
                <div key={room.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Grid className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{room.name}</h4>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      <Thermometer className="h-3 w-3 mr-1 text-cyan-500" />
                      {room.temperature}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {room.rows.map((row) => (
                      <div key={row.id} className="rounded-lg border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-2.5 text-xs space-y-1.5">
                        <div className="flex justify-between text-slate-700 dark:text-slate-300 font-semibold">
                          <span>{row.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{row.shelves.length} Shelf Cells</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {row.shelves.map((shelf) => (
                            <span key={shelf} className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[11px] font-mono text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-700">
                              {shelf}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Box className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Item Locator Directory ({filteredWhProducts.length} items mapped)
              </h3>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-950 uppercase text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Product Name & SKU</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Room Location</th>
                      <th className="px-4 py-3">Row</th>
                      <th className="px-4 py-3">Shelf / Cell</th>
                      <th className="px-4 py-3">Stock Units</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
                    {filteredWhProducts.length > 0 ? (
                      filteredWhProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                            <div>{prod.name}</div>
                            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-400">{prod.sku}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{prod.category}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-indigo-600 dark:text-indigo-300">
                              {prod.roomName}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-200 font-mono">{prod.rowName}</td>
                          <td className="px-4 py-3">
                            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-1 font-mono text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 font-bold">
                              {prod.shelfName}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-white font-mono">{prod.quantity} units</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                          No product items matched your search query in {activeWarehouse.name}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add / Edit Warehouse Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingWh ? 'Edit Warehouse Facility' : 'Add New Warehouse Facility'}
        description="Configure location details, capacity limits, and manager assignment."
      >
        <form onSubmit={handleSaveWarehouse} className="space-y-4">
          <Input
            label="Warehouse Facility Name"
            value={whName}
            onChange={(e) => setWhName(e.target.value)}
            placeholder="e.g. Salt Lake Sector V Warehouse"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={whCity}
              onChange={(e) => setWhCity(e.target.value)}
              placeholder="e.g. Kolkata / New Delhi"
              required
            />
            <Input
              label="State / Province"
              value={whState}
              onChange={(e) => setWhState(e.target.value)}
              placeholder="e.g. West Bengal"
              required
            />
          </div>

          <Input
            label="Complete Address & Location"
            value={whLocation}
            onChange={(e) => setWhLocation(e.target.value)}
            placeholder="Plot number, industrial zone, street..."
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Capacity (Storage Units)"
              type="number"
              value={whCapacity}
              onChange={(e) => setWhCapacity(e.target.value)}
              placeholder="75000"
              required
            />
            <Input
              label="Assigned Warehouse Manager"
              value={whManager}
              onChange={(e) => setWhManager(e.target.value)}
              placeholder="Manager Full Name"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {editingWh ? 'Update Warehouse' : 'Create Warehouse'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
