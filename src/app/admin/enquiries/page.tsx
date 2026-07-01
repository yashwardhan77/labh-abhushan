import React from 'react'
import { getEnquiries } from '@/lib/actions/enquiries'
import EnquiriesManager from '@/components/admin/enquiries-manager'

export const revalidate = 0 // fetch fresh enquiries on load

export default async function AdminEnquiriesPage() {
  const res = await getEnquiries()
  const enquiries = res.success ? res.data || [] : []

  return (
    <div className="flex flex-col gap-6 w-full text-gray-900">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950">
          Customer Enquiries
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Review general showroom requests, custom ornament orders, and product details callback requests.
        </p>
      </div>

      <EnquiriesManager initialEnquiries={enquiries as any} />
    </div>
  )
}
