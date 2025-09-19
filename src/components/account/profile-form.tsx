"use client"
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card'
import { Input } from '@/components/components/ui/input'
import { Label } from '@/components/components/ui/label'
import { Button } from '@/components/components/ui/button'

export function ProfileForm() {
  const supabase = createSupabaseBrowserClient()
  const [fullName, setFullName] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus(null)
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setStatus('You must be signed in to update your profile.')
        return
      }
      const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } })
      if (error) setStatus(error.message)
      else setStatus('Profile updated!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 max-w-md">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
          </div>
          {status && <p className="text-sm text-muted-foreground">{status}</p>}
          <Button type="submit" disabled={loading} className="w-fit">{loading ? 'Saving...' : 'Save changes'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}
