'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Phone, MessageCircle } from 'lucide-react'

interface Banner {
  id: string
  title: string
  image_url: string
  active: boolean
}

interface HeroCarouselProps {
  banners: Banner[]
}

const DEFAULT_BANNERS = [
  {
    id: 'default-1',
    title: 'Exquisite Gold Ornaments Crafted to Perfection',
    image_url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'default-2',
    title: 'Celebrate Life\'s Golden Moments With Us',
    image_url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'default-3',
    title: 'Certified HUID 22K Gold & Fine Silver Ornaments',
    image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop',
  },
]

export default function HeroCarousel({ banners }: HeroCarouselProps) {
  const activeBanners = banners.length > 0 ? banners : DEFAULT_BANNERS
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [activeBanners.length])

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
  }

  const WHATSAPP_NUM = '+918449708851'
  const PHONE_NUM = '8449708851'
  const WA_LINK = `https://wa.me/${WHATSAPP_NUM}?text=Hi%20Labh%20Abhushan,%20I%20am%20interested%20in%20your%20collection.`

  return (
    <div className="relative w-full h-[85vh] sm:h-screen overflow-hidden bg-emerald-950">
      {/* Slides */}
      {activeBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with dark overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out scale-105"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(11, 34, 30, 0.4) 0%, rgba(18, 18, 18, 0.7) 100%), url(${banner.image_url})` 
            }}
          />

          {/* Banner Contents */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 z-20 mt-16">
            <span className="text-gold-400 font-serif tracking-[0.2em] uppercase text-xs sm:text-sm font-semibold mb-3 animate-fade-in-up">
              Labh Abhushan
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white max-w-4xl leading-tight font-medium tracking-wide mb-8 drop-shadow-md">
              {banner.title}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a
                href={`tel:${PHONE_NUM}`}
                className="flex items-center justify-center gap-2 w-48 sm:w-auto px-8 py-3.5 rounded-full border-2 border-gold-500 text-gold-400 font-semibold tracking-wider uppercase text-sm hover:bg-gold-500 hover:text-emerald-950 transition-all duration-300 cursor-pointer shadow-lg"
              >
                <Phone className="w-4 h-4" />
                Call Showroom
              </a>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-48 sm:w-auto px-8 py-3.5 rounded-full gold-gradient text-emerald-950 font-bold tracking-wider uppercase text-sm hover:opacity-90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-lg shadow-gold-500/10"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full border border-white/20 bg-black/30 text-white flex items-center justify-center hover:bg-gold-500 hover:border-gold-500 hover:text-emerald-950 transition-all duration-300 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full border border-white/20 bg-black/30 text-white flex items-center justify-center hover:bg-gold-500 hover:border-gold-500 hover:text-emerald-950 transition-all duration-300 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                index === currentIndex ? 'bg-gold-400 w-8' : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
