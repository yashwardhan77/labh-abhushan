import React from 'react'
import { getProducts } from '@/lib/actions/products'
import { getCategories } from '@/lib/actions/categories'
import ProductsManager from '@/components/admin/products-manager'

export const revalidate = 0 // fetch fresh catalog inventory on each search/filter change

interface SearchParams {
  search?: string
  categoryId?: string
  page?: string
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedParams = await searchParams
  const search = resolvedParams.search || ''
  const categoryId = resolvedParams.categoryId || ''
  const currentPage = parseInt(resolvedParams.page || '1', 10)
  const limit = 10

  // Fetch products and categories concurrently
  const [productsRes, categoriesRes] = await Promise.all([
    getProducts({
      search,
      categoryId,
      page: currentPage,
      limit,
    }),
    getCategories(),
  ])

  const productsResult = productsRes.success 
    ? productsRes 
    : { data: [], count: 0, totalPages: 0, currentPage: 1 }

  const categories = categoriesRes.success ? categoriesRes.data || [] : []
  const products = productsResult.data || []
  const count = productsResult.count || 0
  const totalPages = productsResult.totalPages || 0

  return (
    <div className="flex flex-col gap-6 w-full text-gray-900">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950">
          Product Inventory Catalog
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage showroom products, description, weights, purity standards, and image assets.
        </p>
      </div>

      <ProductsManager
        products={products as any}
        categories={categories}
        count={count}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  )
}
