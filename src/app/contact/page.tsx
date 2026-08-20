import React from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import ContactForm from '@/components/contact-form'

export const metadata = {
  title: 'Contact Us | Labh Abhushan - Certified Ornaments Showroom',
  description: 'Get in touch with Labh Abhushan. Visit our showroom, call us, or send an enquiry for gold, silver, and diamond designs. Location map and contact form included.',
}

export default function ContactPage() {
  const WHATSAPP_NUM = '+918449708851'
  const PHONE_NUM = '8449708851'
  const EMAIL = 'info@labhabhushan.com'
  const WA_LINK = `https://wa.me/${WHATSAPP_NUM}?text=Hi%20Labh%20Abhushan,%20I%20am%20interested%20in%20your%20jewellery%20collection.`

  return (
    <div className="w-full flex flex-col pt-24 pb-16 bg-gold-50/20">
      {/* 1. Header Section */}
      <section className="bg-emerald-950 text-white py-16 px-4 text-center border-b border-gold-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-emerald-950 to-emerald-950" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-gold-400 font-serif tracking-[0.25em] uppercase text-xs sm:text-sm font-semibold mb-2 block">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-wider mb-4">
            Contact Labh Abhushan
          </h1>
          <div className="h-0.5 w-24 gold-gradient mx-auto mb-6" />
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Have questions about our custom ornaments, gold purity, or store timings? Reach out to us via the contact form or call our showroom directly.
          </p>
        </div>
      </section>

      {/* 2. Form & Details Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Showroom Details Column */}
            <div className="lg:col-span-5 flex flex-col gap-8 text-gray-800">
              <div>
                <span className="text-gold-600 font-serif tracking-widest uppercase text-xs font-semibold block mb-1">
                  Showroom Location
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-emerald-950 font-bold uppercase">
                  Come Visit Us
                </h2>
                <div className="h-0.5 w-16 gold-gradient mt-3" />
                <p className="text-gray-500 text-sm leading-relaxed mt-4">
                  Experience the exquisite craft first-hand. Our showroom displays an array of bridal collections, gold bangles, silver articles, and investment coins.
                </p>
              </div>

              {/* Details List */}
              <div className="flex flex-col gap-6 text-sm">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-50 border border-gold-500/20 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-emerald-950 mb-1">Store Address</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Teen Nimbadi ki Gali, Siwana, Barmer, Rajasthan 344044
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-50 border border-gold-500/20 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-emerald-950 mb-1">Phone Number</h3>
                    <p className="text-gray-600 mb-0.5">{PHONE_NUM}</p>
                    <p className="text-[10px] text-gray-400">Available during showroom timings</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-50 border border-gold-500/20 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-emerald-950 mb-1">Email Address</h3>
                    <a href={`mailto:${EMAIL}`} className="text-gray-600 hover:text-gold-600 transition-colors">
                      {EMAIL}
                    </a>
                  </div>
                </div>

                {/* Timings */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-50 border border-gold-500/20 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-emerald-950 mb-1">Showroom Timings</h3>
                    <p className="text-gray-600">Mon - Sat: 10:30 AM - 8:30 PM</p>
                    <p className="text-red-500 font-semibold text-xs mt-0.5">Sunday: Showroom Closed</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 border-t border-gold-500/10 pt-6">
                <a
                  href={`tel:${PHONE_NUM}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-gold-500 text-gold-600 text-xs font-semibold uppercase tracking-wider hover:bg-gold-500 hover:text-emerald-950 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full gold-gradient text-emerald-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  Chat WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* 3. Embedded Map Section */}
      <section className="relative w-full h-[450px] border-t border-gold-500/10">
        <iframe
          title="Labh Abhushan Store Location Map"
          src="https://maps.google.com/maps?q=Labh%20abhushan%20pvt%20Ltd,%20Siwana,%20Rajasthan&t=&z=17&ie=UTF8&iwloc=&output=embed"
          className="absolute inset-0 w-full h-full border-none"
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  )
}
