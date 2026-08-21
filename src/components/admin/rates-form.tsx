'use client'

import React, { useState, FormEvent, useCallback } from 'react'
import { Save, Clock, RefreshCw, ArrowRight, Info, TrendingUp } from 'lucide-react'
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

interface MarketRate {
  gold_per_10g: number | null
  silver_per_kg: number | null
  fetchedAt: string | null
  loading: boolean
  error: string | null
}

// Fetches today's gold & silver reference price using goldprice.org public widget data
async function fetchMarketRates(): Promise<{ gold_per_10g: number; silver_per_kg: number }> {
  // goldprice.org provides free public JSON endpoint for current spot prices
  // XAU = Gold, XAG = Silver (troy oz in USD)
  const [spotRes, fxRes] = await Promise.all([
    fetch('https://data-asg.goldprice.org/dbXRates/USD', { cache: 'no-store' }),
    fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' }),
  ])

  if (!spotRes.ok || !fxRes.ok) {
    throw new Error('Could not fetch market data. Please check manually.')
  }

  const spotData = await spotRes.json()
  const fxData = await fxRes.json()

  // USD to INR exchange rate
  const usdToInr: number = fxData?.rates?.INR ?? 83.5

  // goldprice.org returns price per troy oz in USD
  // 1 troy oz = 31.1035 grams
  const goldUsdPerOz: number = spotData?.xauPrice ?? 0
  const silverUsdPerOz: number = spotData?.xagPrice ?? 0

  if (!goldUsdPerOz || !silverUsdPerOz) {
    throw new Error('Market data unavailable. Please enter rates manually.')
  }

  // Convert to INR per gram
  const goldInrPerGram = (goldUsdPerOz / 31.1035) * usdToInr
  // Per 10g (like Indian jewellery market standard)
  const goldPer10g = Math.round(goldInrPerGram * 10)
  // Silver: per kg = per gram * 1000
  const silverInrPerGram = (silverUsdPerOz / 31.1035) * usdToInr
  const silverPerKg = Math.round(silverInrPerGram * 1000)

  return { gold_per_10g: goldPer10g, silver_per_kg: silverPerKg }
}

export default function RatesForm({ initialRates }: RatesFormProps) {
  const { toast } = useToast()
  const [goldRate, setGoldRate] = useState(initialRates.gold_rate.toString())
  const [silverRate, setSilverRate] = useState(initialRates.silver_rate.toString())
  const [updatedAt, setUpdatedAt] = useState(initialRates.updated_at)
  const [loading, setLoading] = useState(false)

  const [market, setMarket] = useState<MarketRate>({
    gold_per_10g: null,
    silver_per_kg: null,
    fetchedAt: null,
    loading: false,
    error: null,
  })

  const handleFetchMarket = useCallback(async () => {
    setMarket((m) => ({ ...m, loading: true, error: null }))
    try {
      const data = await fetchMarketRates()
      setMarket({
        gold_per_10g: data.gold_per_10g,
        silver_per_kg: data.silver_per_kg,
        fetchedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        loading: false,
        error: null,
      })
      toast('Market reference rates fetched!', 'success')
    } catch (err: any) {
      setMarket((m) => ({ ...m, loading: false, error: err.message || 'Failed to fetch market rates.' }))
      toast(err.message || 'Could not fetch market rates', 'error')
    }
  }, [toast])

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
    <div className="flex flex-col gap-6 max-w-2xl w-full">

      {/* ─── STEP 1: Reference Rate Fetcher Card ─── */}
      <div className="bg-emerald-950 text-white rounded-xl border border-gold-500/20 p-5 sm:p-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(180,140,60,0.07)_0%,_transparent_60%)] pointer-events-none" />
        
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-gold-400" />
              <h2 className="text-sm font-bold text-gold-400 uppercase tracking-wider">
                Step 1 — Today's Market Reference
              </h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Fetch today's global gold & silver spot price as a starting point. Add your margin before saving.
            </p>
          </div>
          <button
            type="button"
            onClick={handleFetchMarket}
            disabled={market.loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg gold-gradient text-emerald-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer shadow-md shrink-0 min-h-[40px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${market.loading ? 'animate-spin' : ''}`} />
            {market.loading ? 'Fetching...' : 'Fetch Rates'}
          </button>
        </div>

        {/* Error */}
        {market.error && (
          <div className="bg-red-950/40 border border-red-500/20 text-red-300 text-xs p-3 rounded-lg mb-3">
            ⚠️ {market.error}
          </div>
        )}

        {/* Results */}
        {market.gold_per_10g && market.silver_per_kg ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Gold Reference */}
            <div className="bg-white/5 border border-gold-500/15 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Gold 24K (per 10g) — Market</p>
              <p className="text-2xl font-serif font-bold text-gold-400">
                ₹{market.gold_per_10g.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-gray-500 mt-1 mb-3">
                Global spot price in INR. Add your margin ↓
              </p>
              <button
                type="button"
                onClick={() => setGoldRate(market.gold_per_10g!.toString())}
                className="flex items-center gap-1.5 text-xs text-gold-400 border border-gold-500/30 rounded-lg px-3 py-1.5 hover:bg-gold-500/10 active:scale-[0.97] transition-all cursor-pointer"
              >
                <ArrowRight className="w-3 h-3" />
                Use this rate
              </button>
            </div>

            {/* Silver Reference */}
            <div className="bg-white/5 border border-gold-500/15 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Silver (per 1 kg) — Market</p>
              <p className="text-2xl font-serif font-bold text-gray-200">
                ₹{market.silver_per_kg.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-gray-500 mt-1 mb-3">
                Global spot price in INR. Add your margin ↓
              </p>
              <button
                type="button"
                onClick={() => setSilverRate(market.silver_per_kg!.toString())}
                className="flex items-center gap-1.5 text-xs text-gray-300 border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/5 active:scale-[0.97] transition-all cursor-pointer"
              >
                <ArrowRight className="w-3 h-3" />
                Use this rate
              </button>
            </div>
          </div>
        ) : !market.loading && !market.error ? (
          <div className="text-center py-4 text-gray-500 text-xs border border-dashed border-white/10 rounded-xl">
            Click "Fetch Rates" to see today's global market reference price
          </div>
        ) : null}

        {market.fetchedAt && (
          <p className="text-[10px] text-gray-500 mt-3 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Fetched at {market.fetchedAt} today
          </p>
        )}

        <div className="mt-4 flex items-start gap-2 bg-white/5 border border-white/5 rounded-lg px-3 py-2.5">
          <Info className="w-3.5 h-3.5 text-gold-500/70 shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-400 leading-relaxed">
            <span className="text-gold-400 font-semibold">Tip:</span> This is the global market (MCX) spot price. Your actual showroom rate should include import duty, GST (3%), and your making margin. Typically your rate is <span className="text-white">5–8% higher</span> than this reference.
          </p>
        </div>
      </div>

      {/* ─── STEP 2: Update Showroom Rates Form ─── */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gold-500/10 p-5 sm:p-8 shadow-sm flex flex-col gap-6 text-gray-900">
        <div className="border-b border-gold-500/10 pb-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-gold-400 text-[10px] font-bold flex items-center justify-center">2</span>
              <h2 className="text-sm font-bold text-emerald-950 uppercase tracking-wide">
                Set Your Showroom Rates
              </h2>
            </div>
            <p className="text-xs text-gray-400 font-light">
              These values appear live on your website homepage.
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-gold-50/50 border border-gold-500/10 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs text-gray-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-gold-600" />
            Last saved: {formatDate(updatedAt)}
          </div>
        </div>

        {/* Gold Rate */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1.5" htmlFor="rates-gold">
            Gold Rate — 24K (per 10 grams) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gold-600">₹</span>
            <input
              id="rates-gold"
              type="number"
              step="1"
              required
              value={goldRate}
              onChange={(e) => setGoldRate(e.target.value)}
              placeholder="e.g. 77500"
              className="w-full pl-8 pr-4 py-3 border border-gold-500/20 rounded-xl text-base sm:text-sm font-medium focus:outline-none focus:border-gold-500 text-gray-800 min-h-[44px]"
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 flex items-start gap-1">
            <Info className="w-3 h-3 text-gold-500/60 shrink-0 mt-0.5" />
            22K Gold rate is auto-calculated on homepage as 91.66% of this value.
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
              step="1"
              required
              value={silverRate}
              onChange={(e) => setSilverRate(e.target.value)}
              placeholder="e.g. 93000"
              className="w-full pl-8 pr-4 py-3 border border-gold-500/20 rounded-xl text-base sm:text-sm font-medium focus:outline-none focus:border-gold-500 text-gray-800 min-h-[44px]"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto self-start px-8 py-3.5 rounded-xl gold-gradient text-emerald-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-gold-500/10 min-h-[48px]"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving to Website...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save & Go Live on Website
            </>
          )}
        </button>
      </form>

      {/* Useful Links */}
      <div className="bg-white rounded-xl border border-gold-500/10 p-5 shadow-sm">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-gold-600" />
          Useful Rate Reference Websites
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {[
            { label: '📊 Dwarika Jewellers Live Rate', url: 'https://www.dwarikajewellers.com/liverate.aspx' },
            { label: '📈 MCX Gold Price (India)', url: 'https://www.mcxindia.com/market-data/commodity-rates' },
            { label: '🏛 IBJA Official Rates', url: 'https://www.ibja.co/pdf/IBJARATES.pdf' },
            { label: '💹 GoodReturns Gold Rate', url: 'https://www.goodreturns.in/gold-rates/' },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-50/10 text-gray-600 hover:text-emerald-950 transition-all"
            >
              <span>{link.label}</span>
              <ArrowRight className="w-3 h-3 ml-auto text-gold-500/60" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
