import React from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, AlertTriangle } from 'lucide-react'
import { getProductById, getProducts } from '@/lib/actions/products'
import ProductDetailsClient from '@/components/product-details-client'
import { formatWeight } from '@/lib/utils'

export const revalidate = 0 // fetch fresh details on each load

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailsPage({ params }: Props) {
  const resolvedParams = await params
  const { id } = resolvedParams

  // Fetch product
  const productRes = await getProductById(id)

  if (!productRes.success || !productRes.data) {
    return (
      <div className="w-full pt-32 pb-24 bg-gold-50/20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gold-500/10 p-8 text-center shadow-md">
          <AlertTriangle className="w-12 h-12 text-gold-500 mx-auto mb-4" />
          <h1 className="text-xl font-serif font-bold text-emerald-950 mb-2">Product Not Found</h1>
          <p className="text-gray-500 text-sm mb-6">
            The ornament you are looking for might have been sold or removed from our catalog.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full gold-gradient text-emerald-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Link>
        </div>
      </div>
    )
  }

  const product = productRes.data

  // Fetch related products (same category)
  const relatedRes = await getProducts({
    categoryId: product.category_id,
    limit: 5,
    status: 'Available',
  })

  // Filter out the current product
  const relatedProducts = relatedRes.success
    ? (relatedRes.data || []).filter((p: any) => p.id !== product.id).slice(0, 4)
    : []

  const WHATSAPP_NUM = '+918449708851'

  return (
    <div className="w-full pt-24 pb-16 bg-gold-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-600 hover:text-gold-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Collection
          </Link>
          
          <span className="text-xs text-gray-500 font-medium">
            Collection / {product.categories?.name} / {product.product_name}
          </span>
        </div>

        {/* Client Product View */}
        <ProductDetailsClient product={product} />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl sm:text-2xl font-serif text-emerald-950 font-bold uppercase tracking-wider mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gold-500">
              Related Ornaments
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {relatedProducts.map((p: any) => {
                const productWaLink = `https://wa.me/${WHATSAPP_NUM}?text=Hi%20Labh%20Abhushan,%20I%20am%20interested%20in%20"${encodeURIComponent(
                  p.product_name
                )}"%20(Purity:%20${p.purity},%20Weight:%20${p.weight}g).`

                return (
                  <div
                    key={p.id}
                    className="group bg-white rounded-xl overflow-hidden border border-gold-500/10 hover:border-gold-500/30 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
                  >
                    <Link href={`/products/${p.id}`} className="relative aspect-square overflow-hidden block">
                      <img
                        src={p.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'}
                        alt={p.product_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-emerald-950/90 text-gold-400 text-[10px] tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full border border-gold-500/20">
                        {p.purity}
                      </span>
                    </Link>

                    <div className="p-4 flex flex-col justify-between flex-grow gap-3">
                      <div>
                        <Link href={`/products/${p.id}`} className="hover:text-gold-600 transition-colors">
                          <h3 className="font-serif text-sm font-semibold text-emerald-950 line-clamp-1">
                            {p.product_name}
                          </h3>
                        </Link>
                        <p className="text-[10px] text-gray-500 mt-1">Weight: {formatWeight(p.weight)}</p>
                      </div>

                      <div className="flex gap-2 border-t border-gold-500/5 pt-3">
                        <Link
                          href={`/products/${p.id}`}
                          className="flex-1 text-center py-1.5 rounded border border-gold-500 text-gold-600 text-[10px] font-semibold hover:bg-gold-500 hover:text-emerald-950 transition-colors cursor-pointer"
                        >
                          Details
                        </Link>
                        <a
                          href={productWaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded gold-gradient text-emerald-950 text-[10px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3 fill-current" />
                          Enquire
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
