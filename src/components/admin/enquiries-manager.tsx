'use client'

import React, { useState } from 'react'
import { Search, Download, Trash2, Eye, X, Mail, Phone, Clock, Loader2, AlertCircle } from 'lucide-react'
import * as XLSX from 'xlsx'
import { deleteEnquiry } from '@/lib/actions/enquiries'
import { useToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Enquiry {
  id: string
  name: string
  mobile: string
  email: string | null
  message: string
  created_at: string
}

interface EnquiriesManagerProps {
  initialEnquiries: Enquiry[]
}

export default function EnquiriesManager({ initialEnquiries }: EnquiriesManagerProps) {
  const { toast } = useToast()
  const router = useRouter()

  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filter enquiries locally based on search
  const filteredEnquiries = enquiries.filter((enq) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      enq.name.toLowerCase().includes(q) ||
      enq.mobile.toLowerCase().includes(q) ||
      (enq.email && enq.email.toLowerCase().includes(q)) ||
      enq.message.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    try {
      if (filteredEnquiries.length === 0) {
        toast('No enquiries to export', 'warning')
        return
      }

      // Format data for Excel rows
      const rows = filteredEnquiries.map((enq) => ({
        'Customer Name': enq.name,
        'Mobile Number': enq.mobile,
        'Email Address': enq.email || 'N/A',
        'Message / Enquiry Details': enq.message,
        'Submitted Date': formatDate(enq.created_at),
      }))

      const worksheet = XLSX.utils.json_to_sheet(rows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer Enquiries')

      // Auto-fit column widths
      const maxLens = rows.reduce((acc: any, row: any) => {
        Object.keys(row).forEach((key) => {
          const val = String(row[key])
          acc[key] = Math.max(acc[key] || 10, val.length)
        })
        return acc
      }, {})
      worksheet['!cols'] = Object.keys(maxLens).map((key) => ({ wch: maxLens[key] + 3 }))

      // Trigger download
      XLSX.writeFile(workbook, `Labh_Abhushan_Enquiries_${new Date().toISOString().split('T')[0]}.xlsx`)
      toast('Enquiries exported to Excel successfully!', 'success')
    } catch (err: any) {
      console.error(err)
      toast('Failed to export enquiries', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer enquiry permanently?')) return

    setDeletingId(id)
    try {
      const res = await deleteEnquiry(id)
      if (res.success) {
        toast('Enquiry deleted successfully!', 'success')
        setEnquiries((prev) => prev.filter((e) => e.id !== id))
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null)
        router.refresh()
      } else {
        toast(res.error || 'Failed to delete enquiry', 'error')
      }
    } catch (err: any) {
      toast(err.message || 'An error occurred', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 text-gray-900 w-full">
      {/* Search & Export bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-xl border border-gold-500/10 p-5 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enquiries locally..."
            className="w-full pl-9 pr-4 py-2 border border-gold-500/20 rounded-lg text-sm focus:outline-none focus:border-gold-500 bg-gold-50/5 text-gray-850"
          />
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="w-full sm:w-auto px-5 py-2 rounded-lg gold-gradient text-emerald-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:scale-[1.01] transition-transform cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      {/* Enquiries Grid / Table */}
      <div className="bg-white rounded-xl border border-gold-500/10 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gold-500/10">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Customer Enquiries Inbox ({filteredEnquiries.length})
          </h2>
        </div>

        {filteredEnquiries.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 text-gold-400 mx-auto mb-4" />
            <p className="text-sm font-medium">No customer enquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gold-50/10 border-b border-gold-500/10 text-gray-500 font-semibold">
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Message Summary</th>
                  <th className="p-4">Received Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enq) => {
                  const isDeleting = deletingId === enq.id

                  return (
                    <tr
                      key={enq.id}
                      className="border-b border-gold-500/5 hover:bg-gold-50/5 transition-colors"
                    >
                      <td className="p-4 font-semibold text-emerald-950">{enq.name}</td>
                      <td className="p-4">
                        <a href={`tel:${enq.mobile}`} className="text-gray-750 hover:underline hover:text-gold-600 inline-flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gold-600" />
                          {enq.mobile}
                        </a>
                      </td>
                      <td className="p-4">
                        {enq.email ? (
                          <a href={`mailto:${enq.email}`} className="text-gray-700 hover:underline hover:text-gold-600 inline-flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-gold-600" />
                            {enq.email}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500 max-w-xs truncate">{enq.message}</td>
                      <td className="p-4 text-gray-400 text-xs">{formatDate(enq.created_at)}</td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2.5 justify-end items-center">
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="p-1 text-gold-600 hover:text-gold-500 cursor-pointer"
                            title="View enquiry details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(enq.id)}
                            disabled={isDeleting}
                            className="p-1 text-red-500 hover:text-red-400 disabled:opacity-50 cursor-pointer"
                            title="Delete enquiry"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enquiry View Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedEnquiry(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative z-10 border border-gold-500/20 shadow-2xl animate-fade-in-up flex flex-col">
            {/* Header */}
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-gold-500/20">
              <div>
                <h3 className="font-serif text-lg font-bold tracking-wide uppercase text-gold-400">
                  Enquiry Details
                </h3>
                <p className="text-[10px] text-gray-300 mt-0.5 font-light">
                  Submitted on: {formatDate(selectedEnquiry.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Body */}
            <div className="p-6 flex flex-col gap-5 text-gray-900 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-gold-50/20 border border-gold-500/10 p-4 rounded-xl">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Client Name</span>
                  <p className="font-bold text-emerald-950 mt-0.5">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Submitted At</span>
                  <p className="font-medium text-gray-600 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    {formatDate(selectedEnquiry.created_at).split(',')[0]}
                  </p>
                </div>
                <div className="border-t border-gold-500/10 pt-3 mt-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Mobile Number</span>
                  <p className="font-bold text-emerald-950 mt-0.5">
                    <a href={`tel:${selectedEnquiry.mobile}`} className="hover:underline hover:text-gold-600 inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gold-600" />
                      {selectedEnquiry.mobile}
                    </a>
                  </p>
                </div>
                <div className="border-t border-gold-500/10 pt-3 mt-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Email Address</span>
                  <p className="font-medium text-gray-600 mt-0.5">
                    {selectedEnquiry.email ? (
                      <a href={`mailto:${selectedEnquiry.email}`} className="hover:underline hover:text-gold-600 inline-flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gold-600" />
                        {selectedEnquiry.email}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-1.5">
                  Message / Requirement:
                </span>
                <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl text-gray-700 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-150">
                <button
                  onClick={() => {
                    if (selectedEnquiry) {
                      handleDelete(selectedEnquiry.id)
                    }
                  }}
                  className="px-4 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Enquiry
                </button>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-6 py-2 rounded-lg gold-gradient text-emerald-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
