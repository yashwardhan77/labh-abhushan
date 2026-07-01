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

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const WHATSAPP_NUM = '+918449708851' // Replace with store WhatsApp number
  const PHONE_NUM = '8449708851'     // Replace with store Call number
  const WA_LINK = `https://wa.me/${WHATSAPP_NUM}?text=Hi%20Labh%20Abhushan,%20I%20am%20interested%20in%20your%20jewellery%20collection.`

  // Skip showing default navbar on admin pages
  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return null

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        scrolled 
          ? 'bg-emerald-950/95 backdrop-blur-md shadow-md py-3 border-b border-gold-500/10' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Branding */}
          <Link href="/" className="flex flex-col group">
            <span className="text-xl sm:text-2xl font-serif tracking-widest text-gold-400 group-hover:text-gold-300 transition-colors uppercase font-semibold">
              Labh Abhushan
            </span>
            <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase font-light -mt-1 group-hover:text-gold-200/80 transition-colors">
              Purity & Trust
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium tracking-wider uppercase transition-colors relative py-1',
                    isActive 
                      ? 'text-gold-400' 
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
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${PHONE_NUM}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gold-500/30 text-gold-400 text-xs font-medium uppercase tracking-wider hover:bg-gold-500/10 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Now
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full gold-gradient text-emerald-950 text-xs font-semibold uppercase tracking-wider hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-gold-500/10"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              WhatsApp
            </a>
            <Link
              href="/admin/dashboard"
              className="text-gray-300 hover:text-gold-400 transition-colors p-1"
              title="Admin Panel"
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/admin/dashboard"
              className="text-gray-300 hover:text-gold-400 transition-colors p-1.5 mr-1"
              title="Admin Panel"
            >
              <Shield className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-gold-400 transition-colors p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Overlay) */}
      <div
        className={cn(
          'fixed inset-0 top-[60px] z-40 w-full h-[calc(100vh-60px)] bg-emerald-950/98 border-t border-gold-500/10 flex flex-col justify-between p-6 transition-all duration-300 md:hidden',
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}
      >
        <div className="flex flex-col gap-6">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-lg font-medium tracking-widest uppercase border-b border-gold-500/5 pb-2 transition-all',
                    isActive 
                      ? 'text-gold-400 pl-2 border-gold-500/20' 
                      : 'text-gray-200 hover:text-gold-300'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-4 pb-12">
          <a
            href={`tel:${PHONE_NUM}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-md border border-gold-500/40 text-gold-400 text-sm font-semibold uppercase tracking-wider hover:bg-gold-500/10 transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            Call: {PHONE_NUM}
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-md gold-gradient text-emerald-950 text-sm font-bold uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}
