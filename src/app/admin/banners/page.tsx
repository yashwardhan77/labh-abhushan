import React from 'react'
import { getBanners } from '@/lib/actions/banners'
import BannersManager from '@/components/admin/banners-manager'

export const revalidate = 0 // fetch fresh banners list

export default async function AdminBannersPage() {
  const res = await getBanners()
  const banners = res.success ? res.data || [] : []

  return (
    <div className="flex flex-col gap-6 w-full text-gray-900">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950">
          Banner Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Add or remove hero slider banners that advertise sales campaigns, wedding seasons, and live gold rate alerts.
        </p>
      </div>

      <BannersManager initialBanners={banners} />
    </div>
  )
}
