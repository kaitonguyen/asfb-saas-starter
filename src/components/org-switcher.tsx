import 'server-only'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { OrgSwitcherClient } from './org-switcher-client'

export async function OrgSwitcher() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('organizations')
    .select('name, slug, memberships!inner(user_id)')
    .eq('memberships.user_id', user.id)
    .order('name')

  const orgs = (data as any[])?.map((o: any) => ({ name: o.name, slug: o.slug })) ?? []
  if (orgs.length === 0) return null
  return <OrgSwitcherClient orgs={orgs} />
}
