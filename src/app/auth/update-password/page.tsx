"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) setError(error.message)
      else {
        setMessage('Password updated. You can now log in.')
        setTimeout(() => router.push('/auth/sign-in'), 1200)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container max-w-md py-12">
      <h1 className="text-xl font-semibold">Set new password</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="New password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button className="border px-3 py-2 rounded" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </main>
  )
}
