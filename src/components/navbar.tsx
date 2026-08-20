'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, MessageCircle, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/products', label: 'Our Collection' },
  { href: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const isHome = pathname === '/'

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on path changes & lock body scroll when open
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const WHATSAPP_NUM = '+918449708851'
  const PHONE_NUM = '8449708851'
  const WA_LINK = `https://wa.me/${WHATSAPP_NUM}?text=Hi%20Labh%20Abhushan,%20I%20am%20interested%20in%20your%20jewellery%20collection.`

  // Skip showing default navbar on admin pages
  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return null

  // On non-home pages, always show solid background so text is readable
  const showSolidNav = scrolled || !isHome || isOpen

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        showSolidNav 
          ? 'bg-emerald-950/95 backdrop-blur-md shadow-lg py-3 sm:py-3.5 border-b border-gold-500/20' 
          : 'bg-gradient-to-b from-emerald-950/80 via-emerald-950/30 to-transparent py-4 sm:py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Branding */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group py-1">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gold-500/40 shadow-sm shrink-0 bg-emerald-950">
              <img
                src="/logo.png"
                alt="Labh Abhushan Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-serif tracking-widest text-gold-400 group-hover:text-gold-300 transition-colors uppercase font-semibold">
                Labh Abhushan
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.25em] text-gray-300 uppercase font-light -mt-1 group-hover:text-gold-200/80 transition-colors">
                Purity & Trust
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-xs lg:text-sm font-medium tracking-wider uppercase transition-colors relative py-1.5',
                    isActive 
                      ? 'text-gold-400 font-semibold' 
                      : 'text-gray-200 hover:text-gold-300'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 gold-gradient rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions (Call, WhatsApp, Admin Login Shortcut) */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <a
              href={`tel:${PHONE_NUM}`}
              className="flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-full border border-gold-500/40 text-gold-400 text-xs font-medium uppercase tracking-wider hover:bg-gold-500/10 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 lg:px-4 py-1.5 rounded-full gold-gradient text-emerald-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-gold-500/10"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
            <Link
              href="/admin/dashboard"
              className="text-gray-400 hover:text-gold-400 transition-colors p-1.5 rounded-full hover:bg-white/5"
              title="Admin Panel"
              aria-label="Admin Panel"
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center space-x-1 sm:space-x-2">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full gold-gradient text-emerald-950 text-xs font-bold"
              aria-label="WhatsApp Us"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-gold-400 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="w-6 h-6 text-gold-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer (Full height responsive overlay) */}
      <div
        className={cn(
          'fixed inset-x-0 top-[57px] sm:top-[61px] z-40 w-full h-[calc(100dvh-57px)] sm:h-[calc(100dvh-61px)] bg-emerald-950/98 backdrop-blur-xl border-t border-gold-500/20 flex flex-col justify-between p-6 transition-all duration-300 ease-in-out md:hidden overflow-y-auto',
          isOpen 
            ? 'translate-y-0 opacity-100 pointer-events-auto' 
            : '-translate-y-4 opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col gap-6">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-base sm:text-lg font-serif font-medium tracking-wider uppercase py-3.5 px-4 rounded-xl border transition-all flex items-center justify-between',
                    isActive 
                      ? 'text-gold-400 bg-gold-500/10 border-gold-500/30' 
                      : 'text-gray-200 border-transparent hover:bg-white/5 hover:text-gold-300'
                  )}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full gold-gradient" />}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Mobile Drawer Bottom Action CTA */}
        <div className="flex flex-col gap-3 pt-6 border-t border-gold-500/15 pb-8">
          <a
            href={`tel:${PHONE_NUM}`}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl border border-gold-500/40 text-gold-400 text-sm font-semibold uppercase tracking-wider hover:bg-gold-500/10 active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
          >
            <Phone className="w-4 h-4" />
            <span>Call Showroom ({PHONE_NUM})</span>
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl gold-gradient text-emerald-950 text-sm font-bold uppercase tracking-wider hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer min-h-[48px] shadow-lg shadow-gold-500/20"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>

          <div className="flex items-center justify-between pt-2 px-2 text-xs text-gray-400">
            <p>Mon - Sat: 10:30 AM - 8:30 PM</p>
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="text-gold-400/80 hover:text-gold-300 underline font-medium"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
