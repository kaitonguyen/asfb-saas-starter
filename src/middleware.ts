import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

// Basic multi-tenant routing support:
// - If subdomain like org.example.com -> rewrite to /o/org
// - Path based: /o/[slug]/... is allowed as-is
export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const host = req.headers.get('host') || ''

  // Adjust this for your production base domain
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost:3000'

  if (host !== baseDomain && host.endsWith(baseDomain)) {
    const subdomain = host.replace(`.${baseDomain}`, '')
    if (subdomain && subdomain !== 'www') {
      // Only rewrite root to the tenant path
      if (url.pathname === '/') {
        const rewriteUrl = new URL(`/o/${subdomain}`, req.url)
        const res = NextResponse.rewrite(rewriteUrl)
        res.headers.set('x-tenant', subdomain)
        return res
      }
    }
  }

  return await updateSession(req)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
