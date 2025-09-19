import 'server-only'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'

async function getOrganizations() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return [] as { id: string; name: string; slug: string }[]
  const { data } = await supabase
    .from('organizations')
    .select('id, name, slug, memberships!inner(user_id)')
    .eq('memberships.user_id', user.id)
    .order('name')
  return (data ?? []).map((o: any) => ({ id: o.id, name: o.name, slug: o.slug }))
}

export default async function OrganizationsPage() {
  const orgs = await getOrganizations()
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold">Organizations</h1>
      <ul className="mt-4 space-y-2">
        {orgs.length === 0 && <li className="text-sm text-muted-foreground">No organizations yet.</li>}
        {orgs.map((o: { id: string; name: string; slug: string }) => (
          <li key={o.id}>
            <Link href={`/o/${o.slug}/dashboard`} className="underline">
              {o.name}
            </Link>
          </li>
        ))}
      </ul>
      <CreateOrganizationForm />
    </main>
  )
}

function CreateOrganizationForm() {
  return (
    <form className="mt-8 grid max-w-md gap-3" action={createOrg}>
      <input className="border p-2" name="name" placeholder="Organization name" required />
      <input className="border p-2" name="slug" placeholder="org-slug" pattern="[a-z0-9-]+" required />
      <button className="border px-3 py-2" type="submit">Create</button>
    </form>
  )
}

async function createOrg(formData: FormData) {
  'use server'
  const name = String(formData.get('name') || '')
  const slug = String(formData.get('slug') || '')
  if (!name || !slug) return
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/organizations`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, slug }),
  })
}
