import React from 'react'
import { Award, ShieldCheck, HeartHandshake, BadgeCheck, Users } from 'lucide-react'

export const metadata = {
  title: 'About Us | Labh Abhushan - Legacy of Purity',
  description: 'Learn about our 30-year legacy of crafting fine jewellery. Discover our mission, values, and why we are trusted for hallmarked gold and fine silver ornaments.',
}

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col pt-24 pb-16 bg-gold-50/20">
      {/* 1. Header Hero */}
      <section className="bg-emerald-950 text-white py-16 px-4 text-center border-b border-gold-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-emerald-950 to-emerald-950" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-gold-400 font-serif tracking-[0.25em] uppercase text-xs sm:text-sm font-semibold mb-2 block animate-fade-in-up">
            Our Journey
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-wider mb-4">
            About Labh Abhushan
          </h1>
          <div className="h-0.5 w-24 gold-gradient mx-auto mb-6" />
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Crafting elegance and defining purity since 1995. Learn about the legacy, values, and dedication that go into every ornament we create.
          </p>
        </div>
      </section>

      {/* 2. Legacy and History */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story Image */}
            <div className="relative h-[350px] sm:h-[450px] rounded-2xl overflow-hidden shadow-xl border border-gold-500/10">
              <img
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop"
                alt="Craftsman designing jewelry"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent" />
            </div>

            {/* Story Text */}
            <div className="flex flex-col gap-6">
              <span className="text-gold-600 font-serif tracking-widest uppercase text-xs font-semibold">
                Established 1995
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-emerald-950 font-bold uppercase">
                A Thirty-Year Tradition of Crafting Beauty
              </h2>
              <div className="h-0.5 w-16 gold-gradient" />
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Labh Abhushan was founded in 1995 by Shri Pankaj Soni with a simple mission: to provide certified, high-purity gold and silver ornaments with transparent pricing. From a modest single-room counter, we have grown into one of the city's most trusted premium jewellery showrooms.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We believe that jewellery is not just metal and stones, but an emotion passed down through generations. Our custom bridal necklaces, diamond engagement rings, and fine silver collectibles are crafted with the utmost devotion and absolute accuracy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Statistics Grid */}
      <section className="py-16 gold-gradient text-emerald-950 font-bold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-serif text-3xl sm:text-5xl font-bold tracking-wide">30+</p>
              <p className="text-xs uppercase tracking-widest mt-1 text-emerald-900/80 font-semibold">Years Experience</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-5xl font-bold tracking-wide">10,000+</p>
              <p className="text-xs uppercase tracking-widest mt-1 text-emerald-900/80 font-semibold">Happy Families</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-5xl font-bold tracking-wide">100%</p>
              <p className="text-xs uppercase tracking-widest mt-1 text-emerald-900/80 font-semibold">BIS Hallmarked</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-5xl font-bold tracking-wide">50+</p>
              <p className="text-xs uppercase tracking-widest mt-1 text-emerald-900/80 font-semibold">Master Karigars</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="bg-gold-50/10 rounded-2xl p-8 border border-gold-500/10 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-emerald-950 flex items-center justify-center text-gold-400">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-emerald-950 uppercase tracking-wide">Our Vision</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                To remain the leading symbol of trust and luxury, where generations of families can purchase certified gold and silver ornaments with complete confidence and total satisfaction.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-gold-50/10 rounded-2xl p-8 border border-gold-500/10 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-emerald-950 flex items-center justify-center text-gold-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-emerald-950 uppercase tracking-wide">Our Mission</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                To present exceptional, handcrafted, HUID-certified gold and silver jewellery designs while maintaining 100% price transparency and delivering unparalleled, personalized service to each client.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Values */}
      <section className="py-20 bg-gold-100/5 border-t border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold-600 font-serif tracking-[0.2em] uppercase text-sm font-semibold mb-2 block">
              Our Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-emerald-950 font-bold uppercase tracking-wider">
              Why Families Trust Us
            </h2>
            <div className="h-0.5 w-16 gold-gradient mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gold-500/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center text-emerald-950 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-emerald-950 mb-2">BIS Certified Ornaments</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Every product is laser-marked with standard BIS HUID stamps, verifying exact gold content and purity weight.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gold-500/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center text-emerald-950 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-emerald-950 mb-2">Complete Buyback Guarantee</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We offer a full 100% buyback exchange policy on our gold items, calculated on the exact rate on the day of exchange.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gold-500/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center text-emerald-950 shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-emerald-950 mb-2">Lifetime Free Cleaning</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We provide free ultrasonic cleaning and polishing services for all jewellery bought from our showroom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
