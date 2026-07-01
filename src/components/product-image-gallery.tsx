'use client'

import React, { useState } from 'react'

interface ProductImageGalleryProps {
  primaryUrl: string
  additionalUrls: string[]
  productName: string
}

export default function ProductImageGallery({
  primaryUrl,
  additionalUrls,
  productName,
}: ProductImageGalleryProps) {
  // Combine all images into an array, filtering out empty ones
  const allImages = [primaryUrl, ...additionalUrls].filter(Boolean)
  const [selectedImage, setSelectedImage] = useState(allImages[0] || '')

  if (allImages.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-gold-100/10 border border-gold-500/15 flex items-center justify-center text-gray-400">
        No image available
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div className="aspect-square w-full rounded-2xl overflow-hidden border border-gold-500/15 bg-white relative shadow-sm">
        <img
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {allImages.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(imgUrl)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 bg-white transition-all cursor-pointer ${
                selectedImage === imgUrl ? 'border-gold-500 shadow-md' : 'border-gold-500/10 hover:border-gold-500/30'
              }`}
            >
              <img
                src={imgUrl}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
