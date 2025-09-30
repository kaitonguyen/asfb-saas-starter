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
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/auth')
  const isSignOut = pathname.startsWith('/auth/sign-out')
  const isAuthCallback = pathname.startsWith('/auth/callback')

  // Helper to preserve Supabase cookies when redirecting
  const redirectWithCookies = (url: URL) => {
    const res = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
      res.cookies.set(name, value)
    })
    return res
  }

  // Redirect unauthenticated users to /auth/sign-in (allow /auth and /error)
  if (!user && !isAuthRoute && !pathname.startsWith('/error') && pathname !== "/") {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/sign-in'
    return redirectWithCookies(url)
  }

  // If signed-in and hitting auth pages (except sign-out and callback), send to dashboard
  if (user && isAuthRoute && !isSignOut && !isAuthCallback) {
    // Only check if not already on /dashboard/organizations
    if (!pathname.startsWith('/dashboard/organizations')) {
      // Query memberships for this user
      const { data: memberships, error } = await supabase
        .from('memberships')
        .select('org_id')
        .eq('user_id', user.id)
        .limit(1)
      if (!error && (!memberships || memberships.length === 0)) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard/organizations'
        return redirectWithCookies(url)
      }
    }
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard/account/billing'
    return redirectWithCookies(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}