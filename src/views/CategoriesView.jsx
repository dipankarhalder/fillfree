import React, { useState } from 'react'
import {
  Layers,
  Plus,
  Tag,
  Edit,
  Trash2,
  Package,
  FolderTree,
  X,
  Search,
  CheckCircle2
} from 'lucide-react'
import { useDataStore } from '@/store/useDataStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

export const CategoriesView = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, addSubcategory, deleteSubcategory } = useDataStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState(null)

  // Form State
  const [catName, setCatName] = useState('')
  const [catDescription, setCatDescription] = useState('')
  const [subcatList, setSubcatList] = useState([])
  const [newSubcatInput, setNewSubcatInput] = useState('')

  // Inline Subcategory Adding State for cards
  const [activeInlineCatId, setActiveInlineCatId] = useState(null)
  const [inlineSubcatInput, setInlineSubcatInput] = useState('')

  const filteredCategories = categories.filter(c => {
    const query = searchQuery.toLowerCase()
    return (
      c.name.toLowerCase().includes(query) ||
      c.subcategories.some(s => s.toLowerCase().includes(query))
    )
  })

  const getCategoryProductCount = (categoryName) => {
    return products.filter(p => p.category === categoryName).length
  }

  const handleOpenAdd = () => {
    setEditingCat(null)
    setCatName('')
    setCatDescription('')
    setSubcatList([])
    setNewSubcatInput('')
    setIsCategoryModalOpen(true)
  }

  const handleOpenEdit = (cat) => {
    setEditingCat(cat)
    setCatName(cat.name)
    setCatDescription(cat.description || '')
    setSubcatList(cat.subcategories || [])
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
    if (editingCat) {
      updateCategory(editingCat.id, {
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

  const handleDeleteCat = (id) => {
    if (confirm('Are you sure you want to delete this Category & its Subcategories?')) {
      deleteCategory(id)
    }
  }

  const handleAddInlineSubcat = (catId) => {
    if (!inlineSubcatInput.trim()) return
    addSubcategory(catId, inlineSubcatInput.trim())
    setInlineSubcatInput('')
    setActiveInlineCatId(null)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Categories & Subcategories Management
            </h1>
            <Badge variant="purple">Catalog Taxonomy ERP</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, View, Edit, and Delete product categories and subcategory taxonomies.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default">
          <Plus className="h-4 w-4 mr-1.5" />
          Create New Category
        </Button>
      </div>

      {/* Search & Overview Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-4 py-2 flex items-center gap-2 font-medium">
            <FolderTree className="h-4 w-4 text-indigo-500" />
            <span>Total Categories: <strong className="text-slate-900 dark:text-white">{categories.length}</strong></span>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-4 py-2 flex items-center gap-2 font-medium">
            <Tag className="h-4 w-4 text-purple-500" />
            <span>
              Total Subcategories:{' '}
              <strong className="text-slate-900 dark:text-white">
                {categories.reduce((sum, c) => sum + c.subcategories.length, 0)}
              </strong>
            </span>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category or subcategory..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const productCount = getCategoryProductCount(cat.name)

          return (
            <Card
              key={cat.id}
              className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      <FolderTree className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Package className="h-3 w-3 text-emerald-500" />
                        <span>{productCount} Products Assigned</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Category"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCat(cat.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {cat.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {cat.description}
                  </p>
                )}

                {/* Subcategories Chips */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    <span>Subcategories ({cat.subcategories.length})</span>
                    <button
                      onClick={() => {
                        setActiveInlineCatId(activeInlineCatId === cat.id ? null : cat.id)
                        setInlineSubcatInput('')
                      }}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="h-3 w-3" /> Add Subcategory
                    </button>
                  </div>

                  {activeInlineCatId === cat.id && (
                    <div className="flex items-center gap-1.5 py-1">
                      <input
                        type="text"
                        value={inlineSubcatInput}
                        onChange={(e) => setInlineSubcatInput(e.target.value)}
                        placeholder="Subcategory name..."
                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                      />
                      <Button size="sm" onClick={() => handleAddInlineSubcat(cat.id)} className="h-7 text-xs px-2">
                        Add
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cat.subcategories.length > 0 ? (
                      cat.subcategories.map((subcat) => (
                        <span
                          key={subcat}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          <Tag className="h-3 w-3 text-indigo-500" />
                          {subcat}
                          <button
                            onClick={() => deleteSubcategory(cat.id, subcat)}
                            className="hover:text-rose-500 transition-colors ml-0.5"
                            title="Remove Subcategory"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No subcategories defined</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCat ? 'Edit Product Category' : 'Create New Product Category'}
        description="Define category name, description, and list of subcategories."
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Category Name"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="e.g. Automotive & Power Storage"
            required
          />

          <Input
            label="Category Description"
            value={catDescription}
            onChange={(e) => setCatDescription(e.target.value)}
            placeholder="Brief explanation of products under this category..."
          />

          {/* Subcategories Manager inside Modal */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Subcategories List
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubcatInput}
                onChange={(e) => setNewSubcatInput(e.target.value)}
                placeholder="Add subcategory (e.g. Lithium Packs)..."
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              />
              <Button type="button" onClick={handleAddSubcatToModal} variant="outline" size="sm">
                Add Subcategory
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {subcatList.map((subcat) => (
                <span
                  key={subcat}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/30 px-2.5 py-1 text-xs text-indigo-700 dark:text-indigo-300 font-medium"
                >
                  {subcat}
                  <button
                    type="button"
                    onClick={() => handleRemoveSubcatFromModal(subcat)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {editingCat ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
