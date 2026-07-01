'use client'

import React, { useState, FormEvent } from 'react'
import { Save, Clock } from 'lucide-react'
import { updateMetalRates } from '@/lib/actions/rates'
import { useToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'

interface RatesFormProps {
  initialRates: {
    gold_rate: number
    silver_rate: number
    updated_at: string
  }
}

export default function RatesForm({ initialRates }: RatesFormProps) {
  const { toast } = useToast()
  const [goldRate, setGoldRate] = useState(initialRates.gold_rate.toString())
  const [silverRate, setSilverRate] = useState(initialRates.silver_rate.toString())
  const [updatedAt, setUpdatedAt] = useState(initialRates.updated_at)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const goldVal = parseFloat(goldRate)
    const silverVal = parseFloat(silverRate)

    if (isNaN(goldVal) || goldVal <= 0) {
      toast('Please enter a valid positive gold rate', 'warning')
      return
    }
    if (isNaN(silverVal) || silverVal <= 0) {
      toast('Please enter a valid positive silver rate', 'warning')
      return
    }

    setLoading(true)
    try {
      const res = await updateMetalRates(goldVal, silverVal)
      if (res.success && res.data) {
        toast('Metal rates updated successfully!', 'success')
        setUpdatedAt(res.data.updated_at)
      } else {
        toast(res.error || 'Failed to update rates', 'error')
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gold-500/10 p-6 sm:p-8 shadow-sm flex flex-col gap-6 text-gray-900 max-w-xl">
      <div className="border-b border-gold-500/10 pb-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-base font-semibold text-emerald-950 uppercase tracking-wide">
            Update Showroom Metal Rates
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-light">
            These values appear live on the website home page rates card.
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 bg-gold-50/50 border border-gold-500/10 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs text-gray-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-gold-600" />
          Updated: {formatDate(updatedAt)}
        </div>
      </div>

      {/* Gold Rate */}
      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1.5" htmlFor="rates-gold">
          Gold Rate (24K per 10 grams) *
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gold-600">₹</span>
          <input
            id="rates-gold"
            type="number"
            step="0.01"
            required
            value={goldRate}
            onChange={(e) => setGoldRate(e.target.value)}
            placeholder="e.g. 72500"
            className="w-full pl-8 pr-4 py-2.5 border border-gold-500/20 rounded-lg text-sm font-medium focus:outline-none focus:border-gold-500 text-gray-800"
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">
          * 22K Gold rate (91.6% purity) is automatically calculated on the homepage as 91.66% of this rate.
        </p>
      </div>

      {/* Silver Rate */}
      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1.5" htmlFor="rates-silver">
          Silver Rate (per 1 Kilogram) *
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gold-600">₹</span>
          <input
            id="rates-silver"
            type="number"
            step="0.01"
            required
            value={silverRate}
            onChange={(e) => setSilverRate(e.target.value)}
            placeholder="e.g. 89000"
            className="w-full pl-8 pr-4 py-2.5 border border-gold-500/20 rounded-lg text-sm font-medium focus:outline-none focus:border-gold-500 text-gray-800"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto self-start px-8 py-3 rounded-lg gold-gradient text-emerald-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer shadow-md"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-950" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </button>
    </form>
  )
}
