'use client'

import React, { useState, FormEvent } from 'react'
import { X, User, Phone, Mail, MessageSquare, Send } from 'lucide-react'
import { createEnquiry } from '@/lib/actions/enquiries'
import { useToast } from '@/components/ui/toast'

interface ProductEnquiryModalProps {
  productName: string
  purity: string
  weight: string
  isOpen: boolean
  onClose: () => void
}

export default function ProductEnquiryModal({
  productName,
  purity,
  weight,
  isOpen,
  onClose,
}: ProductEnquiryModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(
    `Hi Labh Abhushan, I would like to inquire about the "${productName}" (${purity}, Weight: ${weight}). Please share price estimates and showroom availability.`
  )

  if (!isOpen) return null

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
        toast('Enquiry submitted successfully! We will contact you soon.', 'success')
        // Reset form
        setName('')
        setMobile('')
        setEmail('')
        onClose()
      } else {
        toast(res.error || 'Failed to submit enquiry', 'error')
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative z-10 border border-gold-500/20 shadow-2xl animate-fade-in-up flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="bg-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-gold-500/20 shrink-0">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide uppercase text-gold-400">
              Product Enquiry
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-300 mt-0.5 font-light">
              Send details to our showroom to request price & availability
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col gap-3.5 sm:gap-4 text-gray-900 overflow-y-auto">
          <div className="bg-gold-50/20 p-3 rounded-xl border border-gold-500/10">
            <p className="text-[11px] text-gray-500 mb-0.5">Inquiring for:</p>
            <p className="text-xs sm:text-sm font-serif font-bold text-emerald-950">
              {productName} <span className="text-xs text-gold-600 font-sans">({purity}, {weight})</span>
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1" htmlFor="name">
              Your Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-9 pr-3.5 py-2.5 border border-gold-500/20 rounded-xl text-base sm:text-sm focus:outline-none focus:border-gold-500 bg-gold-50/5 min-h-[44px]"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1" htmlFor="mobile">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="mobile"
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-9 pr-3.5 py-2.5 border border-gold-500/20 rounded-xl text-base sm:text-sm focus:outline-none focus:border-gold-500 bg-gold-50/5 min-h-[44px]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1" htmlFor="email">
              Email Address (Optional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full pl-9 pr-3.5 py-2.5 border border-gold-500/20 rounded-xl text-base sm:text-sm focus:outline-none focus:border-gold-500 bg-gold-50/5 min-h-[44px]"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1" htmlFor="message">
              Message / Request Details *
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                id="message"
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 border border-gold-500/20 rounded-xl text-base sm:text-sm focus:outline-none focus:border-gold-500 min-h-[80px] bg-gold-50/5"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 sm:gap-3 justify-end mt-2 pt-2 border-t border-gold-500/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-xs sm:text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-colors cursor-pointer min-h-[42px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl gold-gradient text-emerald-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:opacity-95 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer shadow-md min-h-[42px]"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-950"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
