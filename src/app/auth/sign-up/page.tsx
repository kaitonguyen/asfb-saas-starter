"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/components/ui/card'
import { Input } from '@/components/components/ui/input'
import { Label } from '@/components/components/ui/label'
import { Button } from '@/components/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createSupabaseBrowserClient()

  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      const origin = window.location.origin
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      })
      if (error) setError(error.message)
      else setMessage('Đăng ký thành công. Kiểm tra email của bạn để xác nhận.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tạo tài khoản</CardTitle>
            <CardDescription>Nhập email và mật khẩu của bạn để đăng ký</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className='flex items-center relative'>
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Mật khẩu" className='pr-10' required value={password} onChange={(e) => setPassword(e.target.value)} />
                  {
                    showPassword ?
                      <Eye className='absolute right-3 h-4 w-4 text-muted-foreground' onClick={() => setShowPassword(true)} />
                      :
                      <EyeOff className='absolute right-3 h-4 w-4 text-muted-foreground' onClick={() => setShowPassword(false)} />
                  }
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Đăng ký'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Bạn đã có tài khoản? <Link className="underline underline-offset-4" href="/auth/sign-in">Đăng nhập</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
