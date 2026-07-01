'use client'

import React from 'react'

interface CategorySelectProps {
  categories: { id: string; name: string }[]
  initialCategoryId: string
  search: string
}

export default function CategorySelect({
  categories,
  initialCategoryId,
  search,
}: CategorySelectProps) {
  return (
    <div className="relative flex-grow sm:flex-grow-0">
      <select
        name="categoryId"
        defaultValue={initialCategoryId || 'all'}
        onChange={(e) => {
          const value = e.target.value
          const querySearch = search ? `&search=${encodeURIComponent(search)}` : ''
          const catParam = value !== 'all' ? `&categoryId=${value}` : ''
          window.location.href = `/products?page=1${querySearch}${catParam}`
        }}
        className="w-full sm:w-48 text-xs py-2.5 pl-3 pr-8 rounded-lg border border-gold-500/20 bg-white text-gray-800 focus:outline-none focus:border-gold-500 appearance-none cursor-pointer font-medium"
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
  )
}
