import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Gem, Mail, Tags, PlusCircle, DollarSign, ArrowRight, Eye, Phone } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { isSupabaseConfigured, mockDb } from '@/lib/actions/mockDb'

export const revalidate = 0 // always fetch fresh analytics

export default async function DashboardPage() {
  let totalProducts = 0
  let totalEnquiries = 0
  let totalCategories = 0
  let latestEnquiries: any[] = []

  if (!isSupabaseConfigured()) {
    totalProducts = mockDb.getProducts().count
    totalCategories = mockDb.getCategories().length
    const enquiries = mockDb.getEnquiries()
    totalEnquiries = enquiries.length
    latestEnquiries = enquiries.slice(0, 5)
  } else {
    const supabase = await createClient()

    // Fetch counts and latest enquiries in parallel
    const [productsCountRes, enquiriesCountRes, categoriesCountRes, latestEnquiriesRes] = 
      await Promise.all([
        supabase.from('products').select('*', { head: true, count: 'exact' }),
        supabase.from('enquiries').select('*', { head: true, count: 'exact' }),
        supabase.from('categories').select('*', { head: true, count: 'exact' }),
        supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(5),
      ])

    totalProducts = productsCountRes.count || 0
    totalEnquiries = enquiriesCountRes.count || 0
    totalCategories = categoriesCountRes.count || 0
    latestEnquiries = latestEnquiriesRes.data || []
  }

  return (
    <div className="flex flex-col gap-8 w-full text-gray-900">
      
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950">
          Dashboard Overview
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Welcome back. Here is the current showroom status and customer enquiries.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Card 1: Products */}
        <div className="bg-white rounded-xl border border-gold-500/10 p-6 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Total Products
            </span>
            <span className="text-3xl font-serif font-bold text-emerald-950">
              {totalProducts}
            </span>
            <Link
              href="/admin/products"
              className="text-[11px] text-gold-600 hover:text-gold-500 font-medium inline-flex items-center gap-1 mt-2"
            >
              Manage Products <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-500/20 flex items-center justify-center text-gold-600">
            <Gem className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Enquiries */}
        <div className="bg-white rounded-xl border border-gold-500/10 p-6 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Total Enquiries
            </span>
            <span className="text-3xl font-serif font-bold text-emerald-950">
              {totalEnquiries}
            </span>
            <Link
              href="/admin/enquiries"
              className="text-[11px] text-gold-600 hover:text-gold-500 font-medium inline-flex items-center gap-1 mt-2"
            >
              View All Enquiries <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-500/20 flex items-center justify-center text-gold-600">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Categories */}
        <div className="bg-white rounded-xl border border-gold-500/10 p-6 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Total Categories
            </span>
            <span className="text-3xl font-serif font-bold text-emerald-950">
              {totalCategories}
            </span>
            <Link
              href="/admin/categories"
              className="text-[11px] text-gold-600 hover:text-gold-500 font-medium inline-flex items-center gap-1 mt-2"
            >
              Manage Categories <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-500/20 flex items-center justify-center text-gold-600">
            <Tags className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="bg-white rounded-xl border border-gold-500/10 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/products"
            className="flex items-center justify-center gap-2 p-4 rounded-lg border border-gold-500/20 hover:border-gold-500/50 hover:bg-gold-50/5 text-sm font-semibold text-emerald-950 transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-gold-600" />
            Add New Product
          </Link>
          <Link
            href="/admin/rates"
            className="flex items-center justify-center gap-2 p-4 rounded-lg border border-gold-500/20 hover:border-gold-500/50 hover:bg-gold-50/5 text-sm font-semibold text-emerald-950 transition-all cursor-pointer"
          >
            <DollarSign className="w-5 h-5 text-gold-600" />
            Update Metal Rates
          </Link>
          <Link
            href="/admin/enquiries"
            className="flex items-center justify-center gap-2 p-4 rounded-lg border border-gold-500/20 hover:border-gold-500/50 hover:bg-gold-50/5 text-sm font-semibold text-emerald-950 transition-all cursor-pointer"
          >
            <Mail className="w-5 h-5 text-gold-600" />
            Review Enquiries
          </Link>
        </div>
      </div>

      {/* Latest Enquiries */}
      <div className="bg-white rounded-xl border border-gold-500/10 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-gold-500/10">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Latest Enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            className="text-xs text-gold-600 hover:text-gold-500 font-bold uppercase tracking-wider flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {latestEnquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No customer enquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gold-50/10 border-b border-gold-500/10 text-gray-500 font-semibold">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Message Snippet</th>
                  <th className="p-4">Date Submittted</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {latestEnquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    className="border-b border-gold-500/5 hover:bg-gold-50/5 transition-colors"
                  >
                    <td className="p-4 font-semibold text-emerald-950">{enq.name}</td>
                    <td className="p-4 text-gray-600">
                      <a href={`tel:${enq.mobile}`} className="hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gold-600" />
                        {enq.mobile}
                      </a>
                    </td>
                    <td className="p-4 text-gray-500 max-w-xs truncate">{enq.message}</td>
                    <td className="p-4 text-gray-400 text-xs">{formatDate(enq.created_at)}</td>
                    <td className="p-4 text-right">
                      <Link
                        href="/admin/enquiries"
                        className="inline-flex items-center gap-1 text-gold-600 hover:text-gold-500 text-xs font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
