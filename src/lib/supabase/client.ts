import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.includes('your-project-id')) {
    // Return a dummy client during build/prerender to prevent crashes
    return createBrowserClient(
      'https://placeholder-url.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-token'
    )
  }

  return createBrowserClient(url, key)
}
