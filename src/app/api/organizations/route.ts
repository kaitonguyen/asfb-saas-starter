import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('organizations')
    .select('id, slug, name, memberships!inner(user_id)')
    .eq('memberships.user_id', user.id)
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ organizations: (data as any[])?.map((o: any) => ({ id: o.id, slug: o.slug, name: o.name })) ?? [] })
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const { name, slug } = body as { name?: string; slug?: string }
  if (!name || !slug) return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })

  const { data, error } = await supabase.rpc('create_org_with_owner', {
    p_name: name,
    p_slug: slug,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ organization: data })
}
