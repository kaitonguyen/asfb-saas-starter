import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/'
  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(new URL(`/auth/sign-in?error=${encodeURIComponent(error.message)}`, url.origin))
    }
  } else {
    // Touch session
    await supabase.auth.getUser()
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
