import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch organizations with the current user's membership role
  const { data: orgs, error: orgsError } = await supabase
    .from('organizations')
    .select('id, slug, name, memberships!inner(user_id, role)')
    .eq('memberships.user_id', user.id)
    .order('name')

  if (orgsError) return NextResponse.json({ error: orgsError.message }, { status: 500 })

  const organizations = (orgs as any[])?.map((o: any) => ({
    id: o.id,
    slug: o.slug,
    name: o.name,
    role: Array.isArray(o.memberships) && o.memberships[0]?.role ? o.memberships[0].role : undefined,
  })) ?? []

  // Fetch subscriptions for organizations the user belongs to
  const orgIds = organizations.map((o) => o.id)
  let subscriptionsByOrg: Record<string, any> = {}
  if (orgIds.length > 0) {
    const { data: subs, error: subsError } = await supabase
      .from('subscriptions')
      .select('org_id, plan, status, provider, price_id, subscription_id, current_period_end, cancel_at_period_end')
      .in('org_id', orgIds)

    if (subsError) return NextResponse.json({ error: subsError.message }, { status: 500 })
    subscriptionsByOrg = (subs || []).reduce((acc: Record<string, any>, s: any) => {
      acc[s.org_id] = s
      return acc
    }, {})
  }

  const result = {
    user: {
      id: user.id,
      email: user.email,
      full_name: (user.user_metadata as any)?.full_name ?? null,
    },
    organizations: organizations.map((o) => ({
      ...o,
      subscription: subscriptionsByOrg[o.id] || null,
    })),
  }

  return NextResponse.json(result)
}
