import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-bold">Multi-tenant SaaS Starter</h1>
      <p className="mt-2 text-muted-foreground">
        Next.js + Supabase + shadcn/ui with subdomain & path tenants.
      </p>
      <div className="mt-6 flex gap-3">
        <Link className="underline" href="/auth/sign-in">
          Sign in
        </Link>
        <Link className="underline" href="/o/example/dashboard">
          Example tenant dashboard
        </Link>
      </div>
    </main>
  )
}
