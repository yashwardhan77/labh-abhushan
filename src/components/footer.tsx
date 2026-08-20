'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()

  // Skip showing footer on admin pages
  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return null

  const WHATSAPP_NUM = '+918449708851'
  const PHONE_NUM = '8449708851'
  const EMAIL = 'info@labhabhushan.com'
  const WA_LINK = `https://wa.me/${WHATSAPP_NUM}?text=Hi%20Labh%20Abhushan,%20I%20am%20interested%20in%20your%20jewellery%20collection.`
  const INSTAGRAM_LINK = 'https://www.instagram.com/_labh_abhushan?igsh=ODFvcm5qaGN4dGp3'

  return (
    <footer className="bg-emerald-950 text-gray-300 border-t border-gold-500/20">
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex flex-col">
              <span className="text-xl sm:text-2xl font-serif tracking-widest text-gold-400 font-semibold uppercase">
                Labh Abhushan
              </span>
              <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-light -mt-1">
                Purity & Trust
              </span>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400 mt-1 sm:mt-2">
              Established with a legacy of providing high-quality, certified gold, silver, and diamond ornaments. We promise 100% purity and outstanding craftsmanship.
            </p>
            <div className="flex items-center gap-3 mt-2 sm:mt-4">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-gold-500/30 bg-emerald-900/50 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 active:scale-[0.95] transition-all cursor-pointer shadow-sm"
                aria-label="WhatsApp Us"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </a>
              <a
                href={`tel:${PHONE_NUM}`}
                className="w-11 h-11 rounded-full border border-gold-500/30 bg-emerald-900/50 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 active:scale-[0.95] transition-all cursor-pointer shadow-sm"
                aria-label="Call Store"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-gold-500/30 bg-emerald-900/50 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 active:scale-[0.95] transition-all cursor-pointer shadow-sm"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-400 font-serif tracking-wider uppercase font-semibold text-sm sm:text-base mb-4 sm:mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold-500">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-gold-300 transition-colors py-0.5 inline-block">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors py-0.5 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-300 transition-colors py-0.5 inline-block">
                  Our Collection
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors py-0.5 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-gold-300 transition-colors py-0.5 inline-block">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections Shortcut */}
          <div>
            <h3 className="text-gold-400 font-serif tracking-wider uppercase font-semibold text-sm sm:text-base mb-4 sm:mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold-500">
              Our Collections
            </h3>
            <ul className="flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <li>
                <Link href="/products?categoryId=all" className="hover:text-gold-300 transition-colors py-0.5 inline-block">
                  All Jewellery
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-300 transition-colors py-0.5 inline-block">
                  Gold Necklace & Sets
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-300 transition-colors py-0.5 inline-block">
                  Bangles & Bracelets
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-300 transition-colors py-0.5 inline-block">
                  Rings & Earrings
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-300 transition-colors py-0.5 inline-block">
                  Silver Utensils & Ornaments
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div>
            <h3 className="text-gold-400 font-serif tracking-wider uppercase font-semibold text-sm sm:text-base mb-4 sm:mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold-500">
              Showroom Info
            </h3>
            <ul className="flex flex-col gap-3.5 sm:gap-4 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Teen Nimbadi ki Gali, Siwana, Barmer, Rajasthan 344044
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4.5 h-4.5 text-gold-400 shrink-0" />
                <a href={`tel:${PHONE_NUM}`} className="hover:text-gold-300 transition-colors">
                  +91 84497 08851
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4.5 h-4.5 text-gold-400 shrink-0" />
                <a href={`mailto:${EMAIL}`} className="hover:text-gold-300 transition-colors">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Sat: 10:30 AM - 8:30 PM</p>
                  <p className="text-gold-500/80">Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lower Footer section */}
      <div className="bg-emerald-950 border-t border-gold-500/10 py-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Labh Abhushan. All Rights Reserved.</p>
          <p className="tracking-wide">
            Designed for <span className="text-gold-400 font-medium">Purity, Quality, and Craftsmanship</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
