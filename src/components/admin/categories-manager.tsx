'use client'

import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, Tags, Loader2 } from 'lucide-react'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories'
import { useToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  created_at: string
}

interface CategoriesManagerProps {
  initialCategories: Category[]
}

export default function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const { toast } = useToast()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [newCatName, setNewCatName] = useState('')
  const [adding, setAdding] = useState(false)

  // Editing state
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [updating, setUpdating] = useState(false)

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName || newCatName.trim() === '') {
      toast('Please enter a category name', 'warning')
      return
    }

    setAdding(true)
    try {
      const res = await createCategory(newCatName)
      if (res.success && res.data) {
        toast(`Category "${res.data.name}" created successfully!`, 'success')
        setCategories((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)))
        setNewCatName('')
        router.refresh()
      } else {
        toast(res.error || 'Failed to create category', 'error')
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred', 'error')
    } finally {
      setAdding(false)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editName || editName.trim() === '') {
      toast('Please enter a category name', 'warning')
      return
    }

    setUpdating(true)
    try {
      const res = await updateCategory(id, editName)
      if (res.success && res.data) {
        toast('Category updated successfully!', 'success')
        setCategories((prev) =>
          prev
            .map((c) => (c.id === id ? res.data : c))
            .sort((a, b) => a.name.localeCompare(b.name))
        )
        setEditId(null)
        setEditName('')
        router.refresh()
      } else {
        toast(res.error || 'Failed to update category', 'error')
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await deleteCategory(id)
      if (res.success) {
        toast('Category deleted successfully!', 'success')
        setCategories((prev) => prev.filter((c) => c.id !== id))
        router.refresh()
      } else {
        toast(res.error || 'Failed to delete category', 'error')
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-gray-900 w-full">
      {/* Left Column: Create Form */}
      <div className="lg:col-span-4">
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-gold-500/10 p-5 sm:p-6 shadow-sm flex flex-col gap-4"
        >
          <div className="border-b border-gold-500/10 pb-3">
            <h2 className="text-sm font-semibold text-emerald-950 uppercase tracking-wide flex items-center gap-2">
              <Tags className="w-4 h-4 text-gold-600" />
              Add New Category
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Create a new category folder for showroom ornaments.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5" htmlFor="cat-name">
              Category Name *
            </label>
            <input
              id="cat-name"
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Gold Bangles, Silver Coins"
              className="w-full px-3 py-2 border border-gold-500/20 rounded-lg text-sm focus:outline-none focus:border-gold-500 text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={adding}
            className="w-full py-2.5 rounded-lg gold-gradient text-emerald-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 disabled:opacity-50 transition-opacity cursor-pointer shadow-sm"
          >
            {adding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            Add Category
          </button>
        </form>
      </div>

      {/* Right Column: Categories List */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-gold-500/10 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gold-500/10">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Available Categories ({categories.length})
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No product categories created yet. Create one on the left.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gold-50/10 border-b border-gold-500/10 text-gray-500 font-semibold">
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Date Created</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const isEditing = editId === cat.id
                  const isDeleting = deletingId === cat.id

                  return (
                    <tr
                      key={cat.id}
                      className="border-b border-gold-500/5 hover:bg-gold-50/5 transition-colors"
                    >
                      <td className="p-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-2 py-1 text-sm border border-gold-500 rounded focus:outline-none w-full max-w-xs text-gray-800"
                            autoFocus
                          />
                        ) : (
                          <span className="font-semibold text-emerald-950">{cat.name}</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-400 text-xs">
                        {formatDate(cat.created_at)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end items-center">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleUpdate(cat.id)}
                                disabled={updating}
                                className="p-1 text-emerald-600 hover:text-emerald-500 disabled:opacity-55 cursor-pointer"
                                title="Save changes"
                              >
                                {updating ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setEditId(null)
                                  setEditName('')
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                                title="Cancel editing"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditId(cat.id)
                                  setEditName(cat.name)
                                }}
                                className="p-1 text-gold-600 hover:text-gold-500 cursor-pointer"
                                title="Edit category"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Are you sure you want to delete category "${cat.name}"? All products inside this category will be deleted.`
                                    )
                                  ) {
                                    handleDelete(cat.id)
                                  }
                                }}
                                disabled={isDeleting}
                                className="p-1 text-red-500 hover:text-red-400 disabled:opacity-55 cursor-pointer"
                                title="Delete category"
                              >
                                {isDeleting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
