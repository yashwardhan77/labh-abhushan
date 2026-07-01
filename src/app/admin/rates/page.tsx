import React from 'react'
import { getMetalRates } from '@/lib/actions/rates'
import RatesForm from '@/components/admin/rates-form'

export const revalidate = 0 // fetch fresh metal rates

export default async function AdminRatesPage() {
  const res = await getMetalRates()

  const rates = res.success && res.data
    ? res.data
    : { gold_rate: 72500.00, silver_rate: 89000.00, updated_at: new Date().toISOString() }

  return (
    <div className="flex flex-col gap-6 w-full text-gray-900">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950">
          Metal Rates Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Adjust the daily showroom indices for Gold and Silver ornaments.
        </p>
      </div>

      <RatesForm initialRates={rates} />
    </div>
  )
}
