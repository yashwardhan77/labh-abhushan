'use client'

import React, { useState, useRef, ChangeEvent } from 'react'
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight, X, Check, AlertCircle } from 'lucide-react'
import { createProduct, updateProduct, deleteProduct } from '@/lib/actions/products'
import { useToast } from '@/components/ui/toast'
import { formatWeight } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  category_id: string
  product_name: string
  description: string
  weight: number
  purity: string
  image_url: string
  images: string[]
  featured: boolean
  status: 'Available' | 'Out of Stock'
  created_at: string
  categories?: {
    id: string
    name: string
  }
}

interface ProductsManagerProps {
  products: Product[]
  categories: Category[]
  count: number
  totalPages: number
  currentPage: number
}

export default function ProductsManager({
  products,
  categories,
  count,
  totalPages,
  currentPage,
}: ProductsManagerProps) {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '')
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('categoryId') || 'all')

  // Form states
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  const [name, setName] = useState('')
  const [catId, setCatId] = useState('')
  const [desc, setDesc] = useState('')
  const [weight, setWeight] = useState('')
  const [purity, setPurity] = useState('22K')
  const [status, setStatus] = useState<'Available' | 'Out of Stock'>('Available')
  const [featured, setFeatured] = useState(false)

  // Image Upload states
  const [primaryBase64, setPrimaryBase64] = useState<string | null>(null)
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(null)
  const [secondaryBase64List, setSecondaryBase64List] = useState<string[]>([])
  const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>([])
  const [retainedSecondaryImages, setRetainedSecondaryImages] = useState<string[]>([])
  
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const primaryFileInputRef = useRef<HTMLInputElement>(null)
  const secondaryFileInputRef = useRef<HTMLInputElement>(null)

  const handleFilterChange = (search: string, catId: string) => {
    const searchParam = search.trim() ? `&search=${encodeURIComponent(search.trim())}` : ''
    const catParam = catId !== 'all' ? `&categoryId=${catId}` : ''
    router.push(`/admin/products?page=1${searchParam}${catParam}`)
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setName('')
    setCatId(categories[0]?.id || '')
    setDesc('')
    setWeight('')
    setPurity('22K')
    setStatus('Available')
    setFeatured(false)
    setPrimaryBase64(null)
    setPrimaryPreview(null)
    setSecondaryBase64List([])
    setSecondaryPreviews([])
    setRetainedSecondaryImages([])
    setModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setName(product.product_name)
    setCatId(product.category_id)
    setDesc(product.description || '')
    setWeight(product.weight.toString())
    setPurity(product.purity)
    setStatus(product.status)
    setFeatured(product.featured)
    setPrimaryBase64(null)
    setPrimaryPreview(product.image_url || null)
    setSecondaryBase64List([])
    setSecondaryPreviews([])
    setRetainedSecondaryImages(product.images || [])
    setModalOpen(true)
  }

  const handlePrimaryFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setPrimaryBase64(reader.result as string)
      setPrimaryPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSecondaryFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setSecondaryBase64List((prev) => [...prev, result])
        setSecondaryPreviews((prev) => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const weightVal = parseFloat(weight)
    if (!name || name.trim() === '') return toast('Product name is required', 'warning')
    if (!catId) return toast('Category is required', 'warning')
    if (isNaN(weightVal) || weightVal <= 0) return toast('Please enter a valid weight', 'warning')
    if (!purity) return toast('Purity is required', 'warning')

    setSubmitting(true)
    try {
      if (editingProduct) {
        // Edit Action
        const res = await updateProduct(editingProduct.id, {
          category_id: catId,
          product_name: name,
          description: desc,
          weight: weightVal,
          purity,
          featured,
          status,
          imageBase64: primaryBase64 || undefined,
          additionalImagesBase64: secondaryBase64List,
          retainedImages: retainedSecondaryImages,
          retainedPrimaryUrl: primaryPreview || undefined,
        })

        if (res.success) {
          toast('Product updated successfully!', 'success')
          setModalOpen(false)
          router.refresh()
        } else {
          toast(res.error || 'Failed to update product', 'error')
        }
      } else {
        // Create Action
        const res = await createProduct({
          category_id: catId,
          product_name: name,
          description: desc,
          weight: weightVal,
          purity,
          featured,
          status,
          imageBase64: primaryBase64 || undefined,
          additionalImagesBase64: secondaryBase64List,
        })

        if (res.success) {
          toast('Product created successfully!', 'success')
          setModalOpen(false)
          router.refresh()
        } else {
          toast(res.error || 'Failed to create product', 'error')
        }
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete product "${name}"?`)) return

    setDeletingId(id)
    try {
      const res = await deleteProduct(id)
      if (res.success) {
        toast('Product deleted successfully!', 'success')
        router.refresh()
      } else {
        toast(res.error || 'Failed to delete product', 'error')
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 text-gray-900 w-full">
      {/* Upper Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-xl border border-gold-500/10 p-5 shadow-sm">
        {/* Search Form */}
        <div className="w-full sm:w-auto flex-grow max-w-md flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search product inventory..."
              className="w-full pl-9 pr-4 py-2 border border-gold-500/20 rounded-lg text-sm focus:outline-none focus:border-gold-500 bg-gold-50/5 text-gray-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFilterChange(searchVal, categoryFilter)
              }}
            />
          </div>
          <button
            onClick={() => handleFilterChange(searchVal, categoryFilter)}
            className="px-4 py-2 rounded-lg gold-gradient text-emerald-950 text-xs font-semibold uppercase tracking-wider hover:opacity-95 cursor-pointer shadow-sm"
          >
            Find
          </button>
        </div>

        {/* Category Filters & Add */}
        <div className="w-full sm:w-auto flex flex-wrap gap-3 items-center justify-end">
          <div className="relative">
            <select
              name="categoryId admin-select"
              value={categoryFilter}
              onChange={(e) => {
                const value = e.target.value
                setCategoryFilter(value)
                handleFilterChange(searchVal, value)
              }}
              className="w-full sm:w-48 text-xs py-2 pl-3 pr-8 rounded-lg border border-gold-500/20 bg-white text-gray-750 focus:outline-none focus:border-gold-500 appearance-none cursor-pointer font-medium"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500" />
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-2 rounded-lg gold-gradient text-emerald-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:scale-[1.01] transition-transform cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Catalog list */}
      <div className="bg-white rounded-xl border border-gold-500/10 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gold-500/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Product Catalog Inventory ({count} items)
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 text-gold-400 mx-auto mb-4" />
            <p className="text-sm font-medium">No products found matching the criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gold-50/10 border-b border-gold-500/10 text-gray-500 font-semibold">
                  <th className="p-4">Image</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Purity</th>
                  <th className="p-4">Weight</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => {
                  const isDeleting = deletingId === prod.id

                  return (
                    <tr
                      key={prod.id}
                      className="border-b border-gold-500/5 hover:bg-gold-50/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gold-500/10 bg-gray-50 shrink-0">
                          <img
                            src={prod.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'}
                            alt={prod.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-emerald-950">{prod.product_name}</span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {prod.categories?.name || 'Unassigned'}
                      </td>
                      <td className="p-4 uppercase text-gray-600 font-semibold">{prod.purity}</td>
                      <td className="p-4 font-mono text-gray-700">{formatWeight(prod.weight)}</td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            prod.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {prod.featured ? (
                          <span className="inline-flex items-center gap-0.5 text-xs text-gold-600 font-semibold bg-gold-50 px-2 py-0.5 rounded border border-gold-500/20">
                            <Check className="w-3.5 h-3.5" /> Featured
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2.5 justify-end items-center">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1 text-gold-600 hover:text-gold-500 cursor-pointer"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.product_name)}
                            disabled={isDeleting}
                            className="p-1 text-red-500 hover:text-red-400 disabled:opacity-50 cursor-pointer"
                            title="Delete product"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gold-500/10 p-5 bg-gold-50/5">
            <span className="text-xs text-gray-500">
              Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({count} total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const s = searchVal ? `&search=${searchVal}` : ''
                  const c = categoryFilter !== 'all' ? `&categoryId=${categoryFilter}` : ''
                  router.push(`/admin/products?page=${currentPage - 1}${s}${c}`)
                }}
                disabled={currentPage <= 1}
                className="p-1.5 rounded border border-gold-500/20 hover:bg-gold-500/10 text-emerald-950 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const s = searchVal ? `&search=${searchVal}` : ''
                  const c = categoryFilter !== 'all' ? `&categoryId=${categoryFilter}` : ''
                  router.push(`/admin/products?page=${currentPage + 1}${s}${c}`)
                }}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded border border-gold-500/20 hover:bg-gold-500/10 text-emerald-950 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden relative z-10 border border-gold-500/20 shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-gold-500/20 shrink-0">
              <div>
                <h3 className="font-serif text-lg font-bold tracking-wide uppercase text-gold-400">
                  {editingProduct ? 'Edit Product Item' : 'Add Product Item'}
                </h3>
                <p className="text-[10px] text-gray-300 mt-0.5">
                  Update inventory metadata and image assets
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto text-gray-900">
              {/* Product Name */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5" htmlFor="prod-name">
                  Product Name *
                </label>
                <input
                  id="prod-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Navratna Gold Necklace Set"
                  className="w-full px-3 py-2 border border-gold-500/20 rounded-lg text-sm focus:outline-none focus:border-gold-500 text-gray-800"
                />
              </div>

              {/* Category & Purity Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5" htmlFor="prod-cat">
                    Category *
                  </label>
                  <select
                    id="prod-cat"
                    required
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                    className="w-full px-3 py-2 border border-gold-500/20 rounded-lg text-sm focus:outline-none focus:border-gold-500 text-gray-800 bg-white"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5" htmlFor="prod-purity">
                    Purity / Standard *
                  </label>
                  <input
                    id="prod-purity"
                    type="text"
                    required
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    placeholder="e.g. 22K (916), 18K, 925 Sterling Silver"
                    className="w-full px-3 py-2 border border-gold-500/20 rounded-lg text-sm focus:outline-none focus:border-gold-500 text-gray-800"
                  />
                </div>
              </div>

              {/* Weight & Status & Featured Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5" htmlFor="prod-weight">
                    Net Weight (Grams) *
                  </label>
                  <input
                    id="prod-weight"
                    type="number"
                    step="0.001"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 12.450"
                    className="w-full px-3 py-2 border border-gold-500/20 rounded-lg text-sm focus:outline-none focus:border-gold-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5" htmlFor="prod-status">
                    Availability Status *
                  </label>
                  <select
                    id="prod-status"
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gold-500/20 rounded-lg text-sm focus:outline-none focus:border-gold-500 text-gray-800 bg-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div className="pt-5 pl-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4.5 h-4.5 text-gold-500 border-gold-500/30 rounded focus:ring-gold-500 accent-emerald-800 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Featured Product
                    </span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5" htmlFor="prod-desc">
                  Product Description
                </label>
                <textarea
                  id="prod-desc"
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Detailed specs or description of craftsmanship..."
                  className="w-full px-3 py-2 border border-gold-500/20 rounded-lg text-sm focus:outline-none focus:border-gold-500 text-gray-800 min-h-[60px]"
                />
              </div>

              {/* Primary Image Upload */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Primary Image *
                </label>
                <div className="flex items-center gap-4">
                  {primaryPreview ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gold-500/20 bg-gray-50 shrink-0">
                      <img src={primaryPreview} alt="Primary preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gold-500/20 flex items-center justify-center text-gray-400 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <input
                    ref={primaryFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePrimaryFile}
                    className="text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100 cursor-pointer"
                  />
                </div>
              </div>

              {/* Additional Secondary Images Upload */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Additional Ornaments Images (Optional)
                </label>
                
                {/* Retained images for editing */}
                {retainedSecondaryImages.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mb-3 bg-gold-50/20 border border-gold-500/10 p-3 rounded-lg">
                    <p className="text-[10px] text-gray-400 w-full mb-1">Existing uploads:</p>
                    {retainedSecondaryImages.map((url, idx) => (
                      <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gold-500/10 bg-gray-55">
                        <img src={url} alt="Retained" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setRetainedSecondaryImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 p-0.5 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {secondaryPreviews.length > 0 && (
                    <div className="flex gap-2 max-w-xs overflow-x-auto pb-1">
                      {secondaryPreviews.map((preview, idx) => (
                        <div key={idx} className="w-12 h-12 rounded overflow-hidden border shrink-0 bg-gray-50">
                          <img src={preview} alt="Secondary preview" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    ref={secondaryFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleSecondaryFiles}
                    className="text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100 cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit / Cancel Footer */}
              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-150 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-lg gold-gradient text-emerald-950 font-bold text-sm flex items-center gap-1.5 hover:opacity-95 disabled:opacity-50 transition-opacity cursor-pointer shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Item...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
