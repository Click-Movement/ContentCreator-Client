import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  const pathname = request.nextUrl.pathname
  
  // Check if the route is an admin route
  const isAdminRoute = pathname.startsWith('/admin')
  
  // If trying to access admin routes, check if user exists and has admin role
  if (isAdminRoute) {
    if (!user) {
      // User not signed in, redirect to sign in page
      const url = request.nextUrl.clone()
      url.pathname = '/auth/signin'
      url.searchParams.set('redirectTo', pathname)
      url.searchParams.set('error', 'admin_auth_required')
      return NextResponse.redirect(url)
    }
    
    // User exists, now check if they have admin role
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (error || !userData || userData.role !== 'admin') {
        // User doesn't have admin role, redirect to home page
        const url = request.nextUrl.clone()
        url.pathname = '/'
        url.searchParams.set('error', 'admin_access_denied')
        url.searchParams.set('message', 'Only administrators can access this page')
        return NextResponse.redirect(url)
      }
    } catch (err) {
      console.error('Error checking user role:', err)
      // If there's an error checking the role, redirect to home as a precaution
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('error', 'admin_check_failed')
      return NextResponse.redirect(url)
    }
  }
  
  // Standard authentication check for non-admin routes
  if (
    !user &&
    !pathname.startsWith('/auth/signin') &&
    !pathname.startsWith('/auth/signup') &&
    !pathname.startsWith('/auth/forget-password') &&
    !pathname.startsWith('/auth/update-password') && 
    !pathname.startsWith('/pricing')
  ) {
    // No user, redirect to login page
    const url = request.nextUrl.clone()
    url.pathname = '/auth/signin'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as is.
  return supabaseResponse
}