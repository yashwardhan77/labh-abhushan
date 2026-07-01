'use client'

import React, { useState, useRef, ChangeEvent } from 'react'
import { UploadCloud, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { createBanner, toggleBannerActive, deleteBanner } from '@/lib/actions/banners'
import { useToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Banner {
  id: string
  title: string
  image_url: string
  active: boolean
  created_at: string
}

interface BannersManagerProps {
  initialBanners: Banner[]
}

export default function BannersManager({ initialBanners }: BannersManagerProps) {
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [title, setTitle] = useState('')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [submitting, setSubmitting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast('Please select an image file', 'warning')
      return
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast('Image must be less than 5MB', 'warning')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setImageBase64(result)
      setImagePreview(result)
    }
    reader.onerror = () => {
      toast('Failed to read file', 'error')
    }
    reader.readAsDataURL(file)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || title.trim() === '') {
      toast('Please enter a banner title', 'warning')
      return
    }
    if (!imageBase64) {
      toast('Please select a banner image', 'warning')
      return
    }

    setSubmitting(true)
    try {
      const res = await createBanner(title, imageBase64)
      if (res.success && res.data) {
        toast('Banner uploaded and saved successfully!', 'success')
        setBanners((prev) => [res.data, ...prev])
        // Reset form
        setTitle('')
        setImageBase64(null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        router.refresh()
      } else {
        toast(res.error || 'Failed to create banner', 'error')
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setTogglingId(id)
    try {
      const newActive = !currentActive
      const res = await toggleBannerActive(id, newActive)
      if (res.success && res.data) {
        toast(
          `Banner set to ${newActive ? 'Active (shows on home page)' : 'Inactive'}`,
          'success'
        )
        setBanners((prev) =>
          prev.map((b) => (b.id === id ? { ...b, active: newActive } : b))
        )
        router.refresh()
      } else {
        toast(res.error || 'Failed to toggle status', 'error')
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner slide?')) return

    setDeletingId(id)
    try {
      const res = await deleteBanner(id)
      if (res.success) {
        toast('Banner deleted successfully!', 'success')
        setBanners((prev) => prev.filter((b) => b.id !== id))
        router.refresh()
      } else {
        toast(res.error || 'Failed to delete banner', 'error')
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-gray-900 w-full">
      {/* Left Column: Upload Form */}
      <div className="lg:col-span-5">
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-gold-500/10 p-5 sm:p-6 shadow-sm flex flex-col gap-4"
        >
          <div className="border-b border-gold-500/10 pb-3">
            <h2 className="text-sm font-semibold text-emerald-950 uppercase tracking-wide flex items-center gap-2">
              <UploadCloud className="w-4.5 h-4.5 text-gold-600" />
              Upload Hero Banner
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Add a promo slide banner with text to display on the home screen hero carousel.
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5" htmlFor="banner-title">
              Banner Title / Headline *
            </label>
            <input
              id="banner-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Traditional Bridal Ornaments Collection"
              className="w-full px-3 py-2.5 border border-gold-500/20 rounded-lg text-sm focus:outline-none focus:border-gold-500 text-gray-800"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Banner Image *
            </label>
            
            <div className="flex flex-col gap-3">
              {imagePreview ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gold-500/25 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageBase64(null)
                      setImagePreview(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gold-500/20 hover:border-gold-500/40 rounded-xl py-8 px-4 text-center cursor-pointer hover:bg-gold-50/5 transition-all flex flex-col items-center justify-center gap-2"
                >
                  <UploadCloud className="w-8 h-8 text-gold-500/60" />
                  <p className="text-xs font-semibold text-gray-700">Click to upload image file</p>
                  <p className="text-[10px] text-gray-400">JPG, PNG, WebP up to 5MB (Recomend ratio: 16:9)</p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg gold-gradient text-emerald-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 disabled:opacity-50 transition-opacity cursor-pointer shadow-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Uploading Banner...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Publish Banner
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right Column: Banners Grid */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Manage Banner Slides ({banners.length})
        </h2>

        {banners.length === 0 ? (
          <div className="bg-white rounded-xl border border-gold-500/10 p-8 text-center text-gray-500 text-sm shadow-sm">
            No banners uploaded yet. Upload your first slide using the form on the left.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {banners.map((banner) => {
              const isToggling = togglingId === banner.id
              const isDeleting = deletingId === banner.id

              return (
                <div
                  key={banner.id}
                  className="bg-white rounded-xl border border-gold-500/10 overflow-hidden shadow-sm flex flex-col sm:flex-row gap-4 p-4 items-center justify-between"
                >
                  {/* Banner Image Preview */}
                  <div className="w-full sm:w-36 aspect-video sm:h-20 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gold-500/10">
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Banner Info & Actions */}
                  <div className="flex-1 flex flex-col gap-1 w-full text-center sm:text-left">
                    <h3 className="font-serif text-sm font-bold text-emerald-950 leading-snug line-clamp-2">
                      {banner.title}
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      Uploaded on: {formatDate(banner.created_at)}
                    </p>
                  </div>

                  {/* Status Toggle & Delete */}
                  <div className="flex items-center gap-4 shrink-0 justify-end w-full sm:w-auto border-t border-gray-100 sm:border-t-0 pt-3 sm:pt-0">
                    {/* Active toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={banner.active}
                        disabled={isToggling}
                        onChange={() => handleToggleActive(banner.id, banner.active)}
                        className="w-4 h-4 text-gold-500 border-gold-500/30 rounded focus:ring-gold-500 accent-emerald-800 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-gray-700">
                        {banner.active ? (
                          <span className="text-emerald-600">Active</span>
                        ) : (
                          <span className="text-gray-400">Inactive</span>
                        )}
                      </span>
                    </label>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(banner.id)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                      title="Delete banner"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
