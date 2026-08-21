import { NextResponse } from 'next/server'

// Fetches live gold & silver spot prices from Yahoo Finance (free, no API key needed)
// GC=F = Gold Futures, SI=F = Silver Futures, USDINR=X = USD to INR rate

async function fetchYahooPrice(symbol: string): Promise<number> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      'Accept': 'application/json',
    },
    next: { revalidate: 300 }, // cache 5 minutes
  })

  if (!res.ok) throw new Error(`Yahoo Finance error for ${symbol}: ${res.status}`)

  const data = await res.json()
  const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice
  if (!price) throw new Error(`No price data for ${symbol}`)
  return price
}

export async function GET() {
  try {
    // Fetch gold (USD/oz), silver (USD/oz), and USD→INR rate in parallel
    const [goldUsdPerOz, silverUsdPerOz, usdToInr] = await Promise.all([
      fetchYahooPrice('GC=F'),    // Gold Futures in USD per troy oz
      fetchYahooPrice('SI=F'),    // Silver Futures in USD per troy oz
      fetchYahooPrice('USDINR=X'), // USD to INR exchange rate
    ])

    // 1 troy oz = 31.1035 grams
    const goldInrPerGram = (goldUsdPerOz / 31.1035) * usdToInr
    const silverInrPerGram = (silverUsdPerOz / 31.1035) * usdToInr

    // Indian jewellery standard: Gold per 10g, Silver per kg
    const goldPer10g = Math.round(goldInrPerGram * 10)
    const silverPerKg = Math.round(silverInrPerGram * 1000)

    return NextResponse.json({
      success: true,
      gold_per_10g: goldPer10g,
      silver_per_kg: silverPerKg,
      usd_to_inr: Math.round(usdToInr * 100) / 100,
      gold_usd_per_oz: Math.round(goldUsdPerOz * 100) / 100,
      silver_usd_per_oz: Math.round(silverUsdPerOz * 100) / 100,
      source: 'Yahoo Finance (GC=F, SI=F, USDINR=X)',
      fetched_at: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('market-rates API error:', err.message)

    // Fallback: try alternate Yahoo Finance endpoint
    try {
      const [goldRes, inrRes] = await Promise.all([
        fetch('https://query2.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=1d', {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          next: { revalidate: 300 },
        }),
        fetch('https://query2.finance.yahoo.com/v8/finance/chart/USDINR=X?interval=1d&range=1d', {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          next: { revalidate: 3600 },
        }),
      ])

      const silverRes2 = await fetch('https://query2.finance.yahoo.com/v8/finance/chart/SI=F?interval=1d&range=1d', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 300 },
      })

      if (goldRes.ok && inrRes.ok && silverRes2.ok) {
        const [goldData, inrData, silverData] = await Promise.all([
          goldRes.json(),
          inrRes.json(),
          silverRes2.json(),
        ])

        const goldUsd = goldData?.chart?.result?.[0]?.meta?.regularMarketPrice
        const silverUsd = silverData?.chart?.result?.[0]?.meta?.regularMarketPrice
        const inrRate = inrData?.chart?.result?.[0]?.meta?.regularMarketPrice

        if (goldUsd && silverUsd && inrRate) {
          return NextResponse.json({
            success: true,
            gold_per_10g: Math.round((goldUsd / 31.1035) * inrRate * 10),
            silver_per_kg: Math.round((silverUsd / 31.1035) * inrRate * 1000),
            usd_to_inr: Math.round(inrRate * 100) / 100,
            source: 'Yahoo Finance query2 (fallback)',
            fetched_at: new Date().toISOString(),
          })
        }
      }
    } catch (fallbackErr: any) {
      console.error('Fallback also failed:', fallbackErr.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Market data temporarily unavailable. Please enter rates manually or check MCX India.',
      },
      { status: 503 }
    )
  }
}
