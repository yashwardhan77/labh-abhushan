import { NextResponse } from 'next/server'

// Server-side API route — fetches gold/silver prices server-to-server
// This bypasses CORS/403 restrictions that browser requests face
export async function GET() {
  try {
    // Try goldprice.org first (server-side request bypasses CORS block)
    const [spotRes, fxRes] = await Promise.all([
      fetch('https://data-asg.goldprice.org/dbXRates/USD', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://goldprice.org/',
        },
        next: { revalidate: 300 }, // cache for 5 minutes
      }),
      fetch('https://open.er-api.com/v6/latest/USD', {
        next: { revalidate: 3600 }, // cache exchange rate for 1 hour
      }),
    ])

    if (!spotRes.ok) {
      throw new Error(`goldprice.org returned ${spotRes.status}`)
    }

    const spotData = await spotRes.json()
    const fxData = await fxRes.json()

    // USD → INR exchange rate (fallback to 83.5 if API fails)
    const usdToInr: number = fxData?.rates?.INR ?? 83.5

    // goldprice.org returns price per troy oz in USD
    // 1 troy oz = 31.1035 grams
    const goldUsdPerOz: number = spotData?.xauPrice ?? 0
    const silverUsdPerOz: number = spotData?.xagPrice ?? 0

    if (!goldUsdPerOz || !silverUsdPerOz) {
      throw new Error('Spot price data missing from goldprice.org response')
    }

    // Gold: USD/oz → INR/gram → INR per 10g
    const goldInrPerGram = (goldUsdPerOz / 31.1035) * usdToInr
    const goldPer10g = Math.round(goldInrPerGram * 10)

    // Silver: USD/oz → INR/gram → INR per kg
    const silverInrPerGram = (silverUsdPerOz / 31.1035) * usdToInr
    const silverPerKg = Math.round(silverInrPerGram * 1000)

    return NextResponse.json({
      success: true,
      gold_per_10g: goldPer10g,
      silver_per_kg: silverPerKg,
      usd_to_inr: Math.round(usdToInr * 100) / 100,
      gold_usd_per_oz: goldUsdPerOz,
      silver_usd_per_oz: silverUsdPerOz,
      source: 'goldprice.org',
      fetched_at: new Date().toISOString(),
    })
  } catch (err: any) {
    // Fallback: try metals.live (completely free, no key needed)
    try {
      const fallbackRes = await fetch('https://metals.live/api/spot', {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 300 },
      })

      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json()
        // metals.live returns array: [{metal: 'gold', price: ...}, ...]
        const goldEntry = Array.isArray(fallbackData)
          ? fallbackData.find((m: any) => m.metal === 'gold')
          : null
        const silverEntry = Array.isArray(fallbackData)
          ? fallbackData.find((m: any) => m.metal === 'silver')
          : null

        // Fetch exchange rate separately
        const fxRes2 = await fetch('https://open.er-api.com/v6/latest/USD', {
          next: { revalidate: 3600 },
        })
        const fxData2 = await fxRes2.json()
        const usdToInr2: number = fxData2?.rates?.INR ?? 83.5

        if (goldEntry && silverEntry) {
          const goldPer10g = Math.round((goldEntry.price / 31.1035) * usdToInr2 * 10)
          const silverPerKg = Math.round((silverEntry.price / 31.1035) * usdToInr2 * 1000)

          return NextResponse.json({
            success: true,
            gold_per_10g: goldPer10g,
            silver_per_kg: silverPerKg,
            usd_to_inr: Math.round(usdToInr2 * 100) / 100,
            source: 'metals.live',
            fetched_at: new Date().toISOString(),
          })
        }
      }
    } catch (_err) {
      // both sources failed — fall through to error response
    }

    return NextResponse.json(
      {
        success: false,
        error: err.message || 'All market data sources unavailable. Please enter rates manually.',
      },
      { status: 503 }
    )
  }
}
