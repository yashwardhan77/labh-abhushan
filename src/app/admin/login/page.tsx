'use client'

import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ShieldAlert, LogIn, Lock, Mail } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')
  )

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      if (!isConfigured) {
        // Set mock-session cookie valid for 1 day
        document.cookie = 'mock-session=true; path=/; max-age=86400'
        toast('Logged in successfully (Demo Mode)!', 'success')
        router.refresh()
        router.push('/admin/dashboard')
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        throw error
      }

      toast('Logged in successfully!', 'success')
      router.refresh()
      // Redirect to dashboard
      router.push('/admin/dashboard')
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Invalid login credentials. Please try again.')
      toast(err.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-emerald-950 p-4"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(11, 34, 30, 0.9) 0%, rgba(18, 18, 18, 0.95) 100%), url("https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1600&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Login Card */}
      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-gold-500/20 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 animate-fade-in-up text-white">
        
        {/* Header */}
        <div className="text-center">
          <span className="text-gold-400 font-serif tracking-[0.2em] uppercase text-xs font-semibold block mb-1">
            Labh Abhushan
          </span>
          <h1 className="text-2xl font-serif font-bold uppercase tracking-wider text-white">
            Staff Portal
          </h1>
          <div className="h-0.5 w-16 gold-gradient mx-auto mt-3" />
        </div>

        {/* Demo Mode Alert */}
        {!isConfigured && (
          <div className="bg-emerald-950/60 border border-gold-500/30 text-gold-200 text-xs p-3.5 rounded-lg flex items-start gap-2.5">
            <LogIn className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-gold-400">Demo/Mock Mode Active</span>
              <span className="leading-relaxed text-[11px] text-gray-300">
                Supabase URL is not configured. Enter any email and password to log in and manage the store in-memory.
              </span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-950/40 border border-red-500/30 text-red-200 text-xs p-3 rounded-lg flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300 tracking-wide" htmlFor="login-email">
              Email Address
            </label>
            <div className="relative text-gray-900">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@labhabhushan.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gold-500/20 rounded-lg text-sm bg-black/25 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300 tracking-wide" htmlFor="login-password">
              Password
            </label>
            <div className="relative text-gray-900">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-gold-500/20 rounded-lg text-sm bg-black/25 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg gold-gradient text-emerald-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-opacity mt-2 cursor-pointer shadow-lg shadow-gold-500/10"
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
                Authenticating...
              </>
            ) : (
              <>
                <LogIn className="w-4.5 h-4.5" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="text-center mt-2 border-t border-white/5 pt-4">
          <a href="/" className="text-xs text-gold-400 hover:underline hover:text-gold-300">
            ← Back to Showroom
          </a>
        </div>
      </div>
    </div>
  )
}
