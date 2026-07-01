import React from 'react'
import { getCategories } from '@/lib/actions/categories'
import CategoriesManager from '@/components/admin/categories-manager'

export const revalidate = 0 // fetch fresh categories list

export default async function AdminCategoriesPage() {
  const res = await getCategories()
  const categories = res.success ? res.data || [] : []

  return (
    <div className="flex flex-col gap-6 w-full text-gray-900">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950">
          Category Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Organize your showroom products into custom collections (e.g. Gold Bangles, Silver Articles).
        </p>
      </div>

      <CategoriesManager initialCategories={categories} />
    </div>
  )
}
