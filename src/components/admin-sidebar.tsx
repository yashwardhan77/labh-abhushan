'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Gem,
  Tags,
  DollarSign,
  Images,
  Mail,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Gem },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/rates', label: 'Metal Rates', icon: DollarSign },
  { href: '/admin/banners', label: 'Banners', icon: Images },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Mail },
]

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // Skip showing sidebar on non-admin pages or login page
  const isAdmin = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'
  if (!isAdmin || isLoginPage) return null

  const handleLogout = async () => {
    try {
      const isConfigured = !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')
      )

      if (!isConfigured) {
        document.cookie = 'mock-session=; path=/; max-age=0'
        toast('Logged out successfully (Demo Mode)', 'success')
        router.refresh()
        router.push('/admin/login')
        return
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast('Logged out successfully', 'success')
      router.refresh()
      router.push('/admin/login')
    } catch (err: any) {
      toast(err.message || 'Logout failed', 'error')
    }
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-emerald-950 text-white px-4 py-3 fixed top-0 left-0 w-full z-40 border-b border-gold-500/20">
        <Link href="/admin/dashboard" className="flex flex-col">
          <span className="text-base font-serif tracking-wider text-gold-400 font-semibold uppercase">
            Labh Admin
          </span>
          <span className="text-[8px] tracking-[0.2em] text-gray-400 uppercase">
            Showroom Control
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-200 hover:text-gold-400 p-1 cursor-pointer"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-[53px] lg:top-0 left-0 z-30 h-[calc(100vh-53px)] lg:h-screen w-64 bg-emerald-950 text-gray-200 border-r border-gold-500/10 flex flex-col justify-between py-6 transition-all duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col gap-8">
          {/* Brand header for desktop */}
          <div className="hidden lg:flex flex-col px-6">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-serif tracking-widest text-gold-400 font-semibold uppercase">
                Labh Abhushan
              </span>
              <span className="text-[10px] tracking-[0.3em] text-gold-500/75 uppercase font-light -mt-1">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col px-3 gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all group',
                    isActive
                      ? 'bg-gold-500/10 text-gold-400 border-l-4 border-gold-500 pl-3'
                      : 'hover:bg-gold-500/5 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-gold-400' : 'text-gray-400 group-hover:text-gold-400'
                      )}
                    />
                    {item.label}
                  </div>
                  <ChevronRight
                    className={cn(
                      'w-3.5 h-3.5 opacity-0 -translate-x-2 transition-all',
                      isActive ? 'opacity-100 translate-x-0' : 'group-hover:opacity-50 group-hover:translate-x-0'
                    )}
                  />
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Admin Actions */}
        <div className="px-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium tracking-wide text-red-300 hover:bg-red-950/30 hover:text-red-200 transition-all cursor-pointer border border-transparent hover:border-red-900/30"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
      
      {/* Background Overlay for mobile menu */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 top-[53px] bg-black/40 backdrop-blur-sm z-20 lg:hidden"
        />
      )}
    </>
  )
}
