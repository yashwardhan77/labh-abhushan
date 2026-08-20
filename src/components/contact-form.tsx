'use client'

import React, { useState, FormEvent } from 'react'
import { Send, User, Phone, Mail, MessageSquare } from 'lucide-react'
import { createEnquiry } from '@/lib/actions/enquiries'
import { useToast } from '@/components/ui/toast'

export default function ContactForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!name || name.trim() === '') {
      toast('Please enter your name', 'warning')
      return
    }
    if (!mobile || mobile.trim() === '') {
      toast('Please enter your mobile number', 'warning')
      return
    }
    if (!message || message.trim() === '') {
      toast('Please enter your message', 'warning')
      return
    }

    setLoading(true)
    try {
      const res = await createEnquiry(name, mobile, email, message)

      if (res.success) {
        toast('Thank you! Your enquiry has been received. We will contact you soon.', 'success')
        // Reset form
        setName('')
        setMobile('')
        setEmail('')
        setMessage('')
      } else {
        toast(res.error || 'Failed to submit enquiry', 'error')
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gold-500/15 p-6 sm:p-8 shadow-sm flex flex-col gap-5 text-gray-900"
    >
      <div className="border-b border-gold-500/10 pb-4">
        <h2 className="font-serif text-lg sm:text-xl font-bold text-emerald-950 uppercase tracking-wide">
          Send Us A Message
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Have an ornament request or looking for custom designs? Submit your details.
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1" htmlFor="contact-name">
          Your Name *
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full pl-11 pr-4 py-2.5 border border-gold-500/20 rounded-xl text-base sm:text-sm focus:outline-none focus:border-gold-500 bg-gold-50/5 text-gray-800 min-h-[44px]"
          />
        </div>
      </div>

      {/* Mobile */}
      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1" htmlFor="contact-mobile">
          Mobile Number *
        </label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            id="contact-mobile"
            type="tel"
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter 10-digit mobile number"
            className="w-full pl-11 pr-4 py-2.5 border border-gold-500/20 rounded-xl text-base sm:text-sm focus:outline-none focus:border-gold-500 bg-gold-50/5 text-gray-800 min-h-[44px]"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1" htmlFor="contact-email">
          Email Address (Optional)
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full pl-11 pr-4 py-2.5 border border-gold-500/20 rounded-xl text-base sm:text-sm focus:outline-none focus:border-gold-500 bg-gold-50/5 text-gray-800 min-h-[44px]"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1" htmlFor="contact-message">
          Message / Requirement Details *
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
          <textarea
            id="contact-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe what you are looking for (e.g. customized 22K gold bangle designs, silver items availability)..."
            className="w-full pl-11 pr-4 py-2.5 border border-gold-500/20 rounded-xl text-base sm:text-sm focus:outline-none focus:border-gold-500 min-h-[100px] bg-gold-50/5 text-gray-800"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl gold-gradient text-emerald-950 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-gold-500/10 min-h-[48px]"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-950"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending Message...
          </>
        ) : (
          <>
            <Send className="w-4.5 h-4.5" />
            Send Enquiry
          </>
        )}
      </button>
    </form>
  )
}
