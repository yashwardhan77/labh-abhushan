import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')

  let user = null
  const isMockSession = request.cookies.get('mock-session')?.value === 'true'

  if (isSupabaseConfigured) {
    try {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser()
      user = supabaseUser
    } catch (err) {
      console.error('getUser error, falling back to mock session:', err)
      user = isMockSession ? { email: 'admin@labhabhushan.com' } : null
    }
  } else {
    user = isMockSession ? { email: 'admin@labhabhushan.com' } : null
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute) {
    if (!user && !isLoginRoute) {
      // Redirect unauthenticated user to admin login
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    if (user && isLoginRoute) {
      // Redirect authenticated user to admin dashboard
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
