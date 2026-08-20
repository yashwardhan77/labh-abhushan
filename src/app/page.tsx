import React from 'react'
import Link from 'next/link'
import { Shield, Sparkles, Award, Scale, Star, ArrowRight, MapPin, Phone, Clock, MessageCircle } from 'lucide-react'
import HeroCarousel from '@/components/hero-carousel'
import { getBanners } from '@/lib/actions/banners'
import { getMetalRates } from '@/lib/actions/rates'
import { getProducts } from '@/lib/actions/products'
import { formatCurrency, formatWeight, formatDate } from '@/lib/utils'

export const revalidate = 0 // always fetch live rates and banners

export default async function HomePage() {
  // Fetch data concurrently on the server
  const [bannersRes, ratesRes, productsRes] = await Promise.all([
    getBanners(true),
    getMetalRates(),
    getProducts({ featured: true, limit: 4, status: 'Available' }),
  ])

  const banners = bannersRes.success ? bannersRes.data || [] : []
  const rates = ratesRes.success 
    ? ratesRes.data 
    : { gold_rate: 72500.00, silver_rate: 89000.00, updated_at: new Date().toISOString() }

  const featuredProducts = productsRes.success ? productsRes.data || [] : []

  // Gold rates calculations
  const gold24k = rates.gold_rate // rate for 10g 24k
  const gold22k = rates.gold_rate * 0.9166 // rate for 10g 22k

  const WHATSAPP_NUM = '+918449708851'
  const PHONE_NUM = '8449708851'
  const WA_LINK = `https://wa.me/${WHATSAPP_NUM}?text=Hi%20Labh%20Abhushan,%20I%20am%20interested%20in%20your%20jewellery%20collection.`

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {/* 1. Hero Carousel */}
      <HeroCarousel banners={banners} />

      {/* 2. Live Metal Rates Bar */}
      <section className="relative z-20 pt-8 sm:pt-12 pb-6 sm:pb-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-2xl border border-gold-500/30 p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Gold Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 border-b border-gold-500/15 pb-4 mb-4 sm:mb-6 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
              </span>
              <h2 className="font-serif text-base sm:text-lg md:text-xl tracking-wider text-gold-400 font-semibold uppercase">
                Today's Live Showroom Rates
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 tracking-wide">
              Updated: {rates.updated_at ? formatDate(rates.updated_at) : 'Just now'}
            </p>
          </div>

          {/* Rates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 md:gap-6 text-center">
            {/* 24K Gold */}
            <div className="bg-emerald-900/30 rounded-xl p-3.5 sm:p-4 border border-gold-500/10 flex flex-col justify-center">
              <p className="text-[11px] sm:text-xs tracking-widest text-gold-400 uppercase font-medium mb-1">
                Gold 24K <span className="text-[10px] text-gray-300 font-sans">(per 10g)</span>
              </p>
              <p className="text-2xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
                {formatCurrency(gold24k)}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">99.9% Pure Gold Ornaments</p>
            </div>

            {/* 22K Gold */}
            <div className="bg-emerald-900/30 rounded-xl p-3.5 sm:p-4 border border-gold-500/10 flex flex-col justify-center">
              <p className="text-[11px] sm:text-xs tracking-widest text-gold-400 uppercase font-medium mb-1">
                Gold 22K <span className="text-[10px] text-gray-300 font-sans">(per 10g)</span>
              </p>
              <p className="text-2xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
                {formatCurrency(gold22k)}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">91.6% Pure Ornaments (HUID Hallmarked)</p>
            </div>

            {/* Silver */}
            <div className="bg-emerald-900/30 rounded-xl p-3.5 sm:p-4 border border-gold-500/10 flex flex-col justify-center">
              <p className="text-[11px] sm:text-xs tracking-widest text-gold-400 uppercase font-medium mb-1">
                Silver <span className="text-[10px] text-gray-300 font-sans">(per 1 kg)</span>
              </p>
              <p className="text-2xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
                {formatCurrency(rates.silver_rate)}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">99.9% Pure Fine Silver Articles</p>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 text-center mt-4 sm:mt-6 tracking-wide">
            * Rates are indicative and subject to change based on market conditions. Visit showroom for final calculation.
          </p>
        </div>
      </section>

      {/* 3. Featured Collection */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-gold-500 font-serif tracking-[0.2em] uppercase text-xs sm:text-sm font-semibold mb-2 block">
              Curated Masterpieces
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-emerald-950 font-bold uppercase tracking-wider mb-3 sm:mb-4">
              Featured Ornaments
            </h2>
            <div className="h-0.5 w-20 sm:w-24 gold-gradient mx-auto mb-4 sm:mb-6" />
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed px-2">
              Explore our hand-picked masterpieces of stunning necklaces, bangles, and bridal jewellery designed to make you sparkle.
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gold-500/20 rounded-xl bg-gold-50/5">
              <Sparkles className="w-8 h-8 text-gold-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm">New collection launching soon. Stay tuned!</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-gold-600 hover:text-gold-500 font-semibold text-sm mt-4 cursor-pointer"
              >
                Browse All Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
                {featuredProducts.map((product) => {
                  const productWaLink = `https://wa.me/${WHATSAPP_NUM}?text=Hi%20Labh%20Abhushan,%20I%20am%20interested%20in%20the%20featured%20product%20"${encodeURIComponent(
                    product.product_name
                  )}"%20(Purity:%20${product.purity},%20Weight:%20${product.weight}g).`

                  return (
                    <div
                      key={product.id}
                      className="group bg-gold-50/5 rounded-2xl overflow-hidden border border-gold-500/10 hover:border-gold-500/30 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg"
                    >
                      {/* Product Image */}
                      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden block bg-white">
                        <img
                          src={product.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'}
                          alt={product.product_name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Purity Badge */}
                        <span className="absolute top-3 left-3 bg-emerald-950/90 text-gold-400 text-[10px] tracking-wider font-semibold uppercase px-2.5 py-1 rounded-full border border-gold-500/30">
                          {product.purity}
                        </span>
                      </Link>

                      {/* Details */}
                      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3 sm:gap-4">
                        <div>
                          <p className="text-[10px] tracking-widest text-gold-600 font-medium uppercase mb-1">
                            {product.categories?.name || 'Jewellery'}
                          </p>
                          <Link href={`/products/${product.id}`} className="hover:text-gold-600 transition-colors">
                            <h3 className="font-serif text-base font-semibold text-emerald-950 line-clamp-1">
                              {product.product_name}
                            </h3>
                          </Link>
                          <p className="text-gray-500 text-xs line-clamp-2 mt-1 min-h-[2rem]">
                            {product.description || 'Stunning handcraft ornament.'}
                          </p>
                          <div className="flex gap-4 mt-3 text-xs border-t border-gold-500/5 pt-3 text-emerald-950 font-medium">
                            <span className="bg-gold-100/50 px-2 py-0.5 rounded text-[11px] sm:text-xs">
                              Weight: {formatWeight(product.weight)}
                            </span>
                          </div>
                        </div>

                        {/* CTA Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/products/${product.id}`}
                            className="flex-1 text-center py-2.5 rounded-lg border border-gold-500 text-gold-600 text-xs font-semibold hover:bg-gold-500 hover:text-emerald-950 active:scale-[0.98] transition-colors cursor-pointer min-h-[40px] flex items-center justify-center"
                          >
                            Details
                          </Link>
                          <a
                            href={productWaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg gold-gradient text-emerald-950 text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-opacity cursor-pointer min-h-[40px]"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            Enquire
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="text-center mt-10 sm:mt-12">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full gold-gradient text-emerald-950 font-bold uppercase tracking-wider text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
                >
                  View Complete Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. Customer Trust (Why Choose Us) */}
      <section className="py-12 sm:py-16 md:py-20 bg-gold-100/10 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-gold-500 font-serif tracking-[0.2em] uppercase text-xs sm:text-sm font-semibold mb-2 block">
              Our Legacy
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-emerald-950 font-bold uppercase tracking-wider mb-3 sm:mb-4">
              A Legacy of Purity & Trust
            </h2>
            <div className="h-0.5 w-20 sm:w-24 gold-gradient mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Item 1 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gold-500/10 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-emerald-950 mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-emerald-950 mb-2">100% Certified HUID</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                All our gold ornaments are HUID hallmarked by BIS laboratories, assuring correct purity and weight standards.
              </p>
            </div>

            {/* Item 2 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gold-500/10 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-emerald-950 mx-auto mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-emerald-950 mb-2">Craftsmanship Legacy</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Over 30 years of exquisite jewellery designing experience with master karigars from across India.
              </p>
            </div>

            {/* Item 3 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gold-500/10 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-emerald-950 mx-auto mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-emerald-950 mb-2">100% Transparent Price</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Exact breaking of Gold rates, stones value, and making charges. No hidden rates or unbilled charges.
              </p>
            </div>

            {/* Item 4 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gold-500/10 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-emerald-950 mx-auto mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-emerald-950 mb-2">Custom Ornament Orders</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Share your designs or catalog images with us, and we will custom craft the ornament exactly to your requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-gold-500 font-serif tracking-[0.2em] uppercase text-xs sm:text-sm font-semibold mb-2 block">
              Client Stories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-emerald-950 font-bold uppercase tracking-wider mb-3 sm:mb-4">
              What Our Customers Say
            </h2>
            <div className="h-0.5 w-20 sm:w-24 gold-gradient mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {/* Quote 1 */}
            <div className="bg-gold-50/10 rounded-2xl p-5 sm:p-6 border border-gold-500/10 relative flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex text-gold-500 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm italic leading-relaxed">
                  "Bought my daughter's bridal set from Labh Abhushan. The staff was extremely patient, explained the hallmarking and breakups transparently, and delivered outstanding design. Highly recommended!"
                </p>
              </div>
              <div className="border-t border-gold-500/10 pt-4 mt-4 flex items-center justify-between">
                <p className="font-serif text-sm font-bold text-emerald-950">Sunita Sharma</p>
                <span className="text-[10px] uppercase tracking-wider text-gold-600 font-semibold bg-gold-100/50 px-2 py-0.5 rounded">
                  Verified Buyer
                </span>
              </div>
            </div>

            {/* Quote 2 */}
            <div className="bg-gold-50/10 rounded-2xl p-5 sm:p-6 border border-gold-500/10 relative flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex text-gold-500 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm italic leading-relaxed">
                  "Perfect destination for silver utensils and custom gold coins. Their live rate board is updated daily, which makes me feel secure doing business. Very polite behaviour and pure billing."
                </p>
              </div>
              <div className="border-t border-gold-500/10 pt-4 mt-4 flex items-center justify-between">
                <p className="font-serif text-sm font-bold text-emerald-950">Rajesh Mehta</p>
                <span className="text-[10px] uppercase tracking-wider text-gold-600 font-semibold bg-gold-100/50 px-2 py-0.5 rounded">
                  Regular Customer
                </span>
              </div>
            </div>

            {/* Quote 3 */}
            <div className="bg-gold-50/10 rounded-2xl p-5 sm:p-6 border border-gold-500/10 relative flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex text-gold-500 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm italic leading-relaxed">
                  "I was looking for a specific customized lightweight gold bangle design. They accepted the catalog image and made it identical in record time. Craftsmanship and finish is absolutely premium!"
                </p>
              </div>
              <div className="border-t border-gold-500/10 pt-4 mt-4 flex items-center justify-between">
                <p className="font-serif text-sm font-bold text-emerald-950">Priya Kulkarni</p>
                <span className="text-[10px] uppercase tracking-wider text-gold-600 font-semibold bg-gold-100/50 px-2 py-0.5 rounded">
                  Design Client
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Showroom Information & Map */}
      <section className="py-12 sm:py-16 md:py-20 bg-emerald-950 text-white border-t border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Showroom Details */}
            <div className="flex flex-col gap-5 sm:gap-6">
              <span className="text-gold-400 font-serif tracking-[0.2em] uppercase text-xs sm:text-sm font-semibold">
                Visit Our Showroom
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold uppercase tracking-wider">
                We'd Love To Welcome You
              </h2>
              <div className="h-0.5 w-20 sm:w-24 gold-gradient" />
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4">
                Experience the luxury collection in person. Our sales executives will gladly show you our extensive collection of bangles, necklaces, rings, and premium silver articles.
              </p>

              <div className="flex flex-col gap-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 sm:gap-4">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif font-semibold text-white mb-1">Showroom Address</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Teen Nimbadi ki Gali, Siwana, Barmer, Rajasthan 344044
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif font-semibold text-white mb-1">Call Showroom</h3>
                    <p className="text-gray-300">{PHONE_NUM}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif font-semibold text-white mb-1">Timings</h3>
                    <p className="text-gray-300">Mon - Sat: 10:30 AM - 8:30 PM (Sunday Closed)</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
                <a
                  href={`tel:${PHONE_NUM}`}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full border border-gold-500 text-gold-400 text-xs font-semibold uppercase tracking-wider hover:bg-gold-500 hover:text-emerald-950 active:scale-[0.98] transition-colors cursor-pointer min-h-[48px]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full gold-gradient text-emerald-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-opacity cursor-pointer min-h-[48px] shadow-lg shadow-gold-500/20"
                >
                  <MessageCircle className="w-4.5 h-4.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Map Embed */}
            <div className="h-72 sm:h-96 lg:h-[450px] w-full rounded-2xl overflow-hidden border-2 border-gold-500/20 shadow-2xl relative">
              <iframe
                title="Labh Abhushan Store Location Map"
                src="https://maps.google.com/maps?q=Labh%20abhushan%20pvt%20Ltd,%20Siwana,%20Rajasthan&t=&z=17&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full border-none"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
