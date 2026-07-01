import React from 'react'
import Link from 'next/link'
import { Search, Filter, RefreshCw, MessageCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { getProducts } from '@/lib/actions/products'
import { getCategories } from '@/lib/actions/categories'
import { formatWeight } from '@/lib/utils'
import CategorySelect from '@/components/category-select'

export const revalidate = 0 // get live products on each search/filter change

interface SearchParams {
  search?: string
  categoryId?: string
  page?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedParams = await searchParams
  const search = resolvedParams.search || ''
  const categoryId = resolvedParams.categoryId || ''
  const currentPage = parseInt(resolvedParams.page || '1', 10)
  const limit = 12

  // Fetch products and categories in parallel
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
  const totalPages = productsResult.totalPages || 0

  const WHATSAPP_NUM = '+918449708851'

  return (
    <div className="w-full pt-24 pb-16 bg-gold-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-gold-500 font-serif tracking-[0.25em] uppercase text-xs sm:text-sm font-semibold mb-2 block">
            Our Legacy Ornaments
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-emerald-950 font-bold uppercase tracking-wider mb-3">
            Jewellery Collection
          </h1>
          <div className="h-0.5 w-24 gold-gradient mx-auto mb-4" />
          <p className="text-gray-600 text-xs sm:text-sm">
            Browse through our extensive showroom collection of BIS hallmarked gold bangles, necklaces, rings, and fine silver utensils.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-white rounded-xl border border-gold-500/10 p-5 mb-10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <form className="w-full md:w-auto flex-1 flex gap-2 relative" method="GET" action="/products">
            <input type="hidden" name="categoryId" value={categoryId} />
            <input type="hidden" name="page" value="1" />
            
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search necklace, bangles, purity..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gold-500/20 focus:outline-none focus:border-gold-500 text-gray-900 bg-gold-50/5"
              />
            </div>
            
            <button
              type="submit"
              className="px-5 py-2 rounded-lg gold-gradient text-emerald-950 font-semibold text-sm hover:opacity-95 cursor-pointer shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Categories dropdown and Reset */}
          <div className="w-full md:w-auto flex flex-wrap gap-2.5 items-center justify-end">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-950 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-gold-500" />
              Filter By:
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <CategorySelect
                categories={categories}
                initialCategoryId={categoryId}
                search={search}
              />

              {(search || categoryId) && (
                <Link
                  href="/products"
                  className="p-2.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  title="Clear Filters"
                >
                  <RefreshCw className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gold-500/10 shadow-sm">
            <AlertCircle className="w-12 h-12 text-gold-400 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-emerald-950 mb-2">No Ornaments Found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto px-4">
              We couldn't find any products matching your search criteria. Try removing filters or searching for something else.
            </p>
            {(search || categoryId) && (
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 mt-6 px-6 py-2.5 rounded-full gold-gradient text-emerald-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Clear All Filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => {
                const isOutOfStock = product.status === 'Out of Stock'
                const productWaLink = `https://wa.me/${WHATSAPP_NUM}?text=Hi%20Labh%20Abhushan,%20I%20am%20interested%20in%20"${encodeURIComponent(
                  product.product_name
                )}"%20(Purity:%20${product.purity},%20Weight:%20${product.weight}g).`

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl overflow-hidden border border-gold-500/10 hover:border-gold-500/30 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg"
                  >
                    {/* Image */}
                    <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden block">
                      <img
                        src={product.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'}
                        alt={product.product_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Purity Badge */}
                      <span className="absolute top-3 left-3 bg-emerald-950/90 text-gold-400 text-[10px] tracking-wider font-semibold uppercase px-2.5 py-1 rounded-full border border-gold-500/30">
                        {product.purity}
                      </span>

                      {/* Stock Status Badge */}
                      {isOutOfStock && (
                        <span className="absolute bottom-3 right-3 bg-red-600/90 text-white text-[10px] tracking-wider font-semibold uppercase px-2.5 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                      <div>
                        <p className="text-[10px] tracking-widest text-gold-600 font-medium uppercase mb-1">
                          {product.categories?.name || 'Jewellery'}
                        </p>
                        
                        <Link href={`/products/${product.id}`} className="hover:text-gold-600 transition-colors">
                          <h3 className="font-serif text-base font-semibold text-emerald-950 line-clamp-1">
                            {product.product_name}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-500 text-xs line-clamp-2 mt-1 min-h-[2rem]">
                          {product.description || 'Stunning handcraft ornament.'}
                        </p>
                        
                        <div className="flex gap-4 mt-3 text-xs border-t border-gold-500/5 pt-3 text-emerald-950 font-medium">
                          <span className="bg-gold-100/50 px-2 py-0.5 rounded">
                            Weight: {formatWeight(product.weight)}
                          </span>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-grow text-center py-2 rounded border border-gold-500 text-gold-600 text-xs font-semibold hover:bg-gold-500 hover:text-emerald-950 transition-colors cursor-pointer"
                        >
                          Details
                        </Link>
                        
                        {!isOutOfStock && (
                          <a
                            href={productWaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-grow flex items-center justify-center gap-1.5 py-2 rounded gold-gradient text-emerald-950 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            Enquire
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Link
                  href={`/products?page=${currentPage - 1}${search ? `&search=${search}` : ''}${
                    categoryId ? `&categoryId=${categoryId}` : ''
                  }`}
                  className={`p-2 rounded-lg border border-gold-500/20 text-emerald-950 hover:bg-gold-500/10 transition-colors ${
                    currentPage <= 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer'
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>

                <span className="text-sm font-medium text-emerald-950">
                  Page <strong className="text-gold-600">{currentPage}</strong> of <strong>{totalPages}</strong>
                </span>

                <Link
                  href={`/products?page=${currentPage + 1}${search ? `&search=${search}` : ''}${
                    categoryId ? `&categoryId=${categoryId}` : ''
                  }`}
                  className={`p-2 rounded-lg border border-gold-500/20 text-emerald-950 hover:bg-gold-500/10 transition-colors ${
                    currentPage >= totalPages ? 'pointer-events-none opacity-40' : 'cursor-pointer'
                  }`}
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
