'use client'

import React, { useState } from 'react'
import { MessageCircle, Info, BadgeCheck, CheckCircle } from 'lucide-react'
import ProductImageGallery from './product-image-gallery'
import ProductEnquiryModal from './product-enquiry-modal'
import { formatWeight } from '@/lib/utils'

interface ProductDetailsClientProps {
  product: any
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const isOutOfStock = product.status === 'Out of Stock'
  const WHATSAPP_NUM = '+918449708851'
  const WA_LINK = `https://wa.me/${WHATSAPP_NUM}?text=Hi%20Labh%20Abhushan,%20I%20am%20interested%20in%20"${encodeURIComponent(
    product.product_name
  )}"%20(Purity:%20${product.purity},%20Weight:%20${product.weight}g).`

  const weightStr = formatWeight(product.weight)

  return (
    <div className="bg-white rounded-2xl border border-gold-500/15 p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6">
          <ProductImageGallery
            primaryUrl={product.image_url}
            additionalUrls={product.images || []}
            productName={product.product_name}
          />
        </div>

        {/* Right Column: Metadata Details */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            {/* Category & Status */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-gold-600 bg-gold-100/50 px-3 py-1 rounded-full uppercase">
                {product.categories?.name || 'Collection'}
              </span>
              
              <span
                className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wide ${
                  isOutOfStock ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}
              >
                {product.status}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-serif text-emerald-950 font-bold uppercase tracking-wide leading-tight">
              {product.product_name}
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description || 'This beautifully designed ornament showcases traditional artistry combined with modern elegance. Ideal for weddings, anniversaries, and high-profile celebrations.'}
            </p>

            {/* Details Table */}
            <div className="border border-gold-500/10 rounded-xl overflow-hidden mt-2 bg-gold-50/5">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gold-500/10">
                    <td className="px-4 py-3 text-gray-500 font-medium">Purity (Standard)</td>
                    <td className="px-4 py-3 text-emerald-950 font-bold uppercase">{product.purity}</td>
                  </tr>
                  <tr className="border-b border-gold-500/10">
                    <td className="px-4 py-3 text-gray-500 font-medium">Net Weight</td>
                    <td className="px-4 py-3 text-emerald-950 font-bold">{weightStr}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-500 font-medium">HUID Stamped</td>
                    <td className="px-4 py-3 text-emerald-950 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Yes (BIS Hallmarked)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Showroom Trust Guarantees */}
            <div className="flex flex-col gap-2 mt-4 bg-emerald-50/50 border border-emerald-900/10 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wide">
                <BadgeCheck className="w-4 h-4 text-gold-500" />
                Labh Abhushan Purity Assured
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                We guarantee 100% genuine HUID laser marking on this ornament. Bill details exact weight breakdowns and current rate indices.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {!isOutOfStock && (
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full gold-gradient text-emerald-950 font-bold uppercase tracking-wider text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <MessageCircle className="w-4.5 h-4.5 fill-current" />
                Enquire on WhatsApp
              </a>
            )}
            
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full border-2 border-gold-500 text-gold-600 font-bold uppercase tracking-wider text-xs hover:bg-gold-500 hover:text-emerald-950 transition-all cursor-pointer"
            >
              <Info className="w-4.5 h-4.5" />
              Request Callback / Price
            </button>
          </div>
        </div>
      </div>

      {/* Product Enquiry Form Modal */}
      <ProductEnquiryModal
        productName={product.product_name}
        purity={product.purity}
        weight={weightStr}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
