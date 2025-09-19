"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/components/ui/card'

export function SubscriptionSummary() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/me')
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Failed to load')
        if (mounted) setData(json)
      } catch (e: any) {
        if (mounted) setError(e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div className="text-sm text-muted-foreground">Loading subscription…</div>
  if (error || data?.error) return <div className="text-sm text-destructive">{error || data?.error || 'Failed to load'}</div>

  const orgs = data?.organizations || []
  if (!orgs.length) return <div className="text-sm text-muted-foreground">You don&apos;t belong to any organizations yet.</div>

  return (
    <div className="grid gap-3">
      {orgs.map((o: any) => (
        <Card key={o.id}>
          <CardContent className="py-4 text-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{o.name}</div>
                <div className="text-muted-foreground">Role: {o.role || 'member'}</div>
              </div>
              <div className="text-right">
                <div>{o.subscription?.plan || 'free'}</div>
                <div className="text-muted-foreground">{o.subscription?.status || 'inactive'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
