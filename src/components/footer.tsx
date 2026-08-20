'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram } from 'lucide-react'

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex flex-col">
              <span className="text-2xl font-serif tracking-widest text-gold-400 font-semibold uppercase">
                Labh Abhushan
              </span>
              <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-light -mt-1">
                Purity & Trust
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mt-2">
              Established with a legacy of providing high-quality, certified gold, silver, and diamond ornaments. We promise 100% purity and outstanding craftsmanship.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold-500/20 bg-emerald-900/50 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 transition-all cursor-pointer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </a>
              <a
                href={`tel:${PHONE_NUM}`}
                className="w-10 h-10 rounded-full border border-gold-500/20 bg-emerald-900/50 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 transition-all cursor-pointer"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold-500/20 bg-emerald-900/50 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-400 font-serif tracking-wider uppercase font-semibold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold-500">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/" className="hover:text-gold-300 transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-300 transition-colors">
                  Our Collection
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-gold-300 transition-colors">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections Shortcut */}
          <div>
            <h3 className="text-gold-400 font-serif tracking-wider uppercase font-semibold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold-500">
              Our Collections
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/products?categoryId=all" className="hover:text-gold-300 transition-colors">
                  All Jewellery
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-300 transition-colors">
                  Gold Necklace & Sets
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-300 transition-colors">
                  Bangles & Bracelets
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-300 transition-colors">
                  Rings & Earrings
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-300 transition-colors">
                  Silver Utensils & Ornaments
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div>
            <h3 className="text-gold-400 font-serif tracking-wider uppercase font-semibold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold-500">
              Showroom Info
            </h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Teen Nimbadi ki Gali, Siwana, Barmer, Rajasthan 344044
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                <span>+91 84497 08851</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-400 shrink-0" />
                <a href={`mailto:${EMAIL}`} className="hover:text-gold-300 transition-colors">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
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
      <div className="bg-emerald-950 border-t border-gold-500/10 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Labh Abhushan. All Rights Reserved.</p>
          <p className="tracking-wide">
            Designed for <span className="text-gold-400">Purity, Quality, and Craftsmanship</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
