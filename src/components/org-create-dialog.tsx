"use client"
import { Input } from '@/components/components/ui/input'
import { Button } from '@/components/components/ui/button'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
// Simple slugify: lowercase, remove accents, replace spaces/invalids with dash, remove leading/trailing dashes
function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const orgSchema = z.object({
  name: z.string().min(1, 'Tên thư phòng là bắt buộc').max(100, 'Tên thư phòng quá dài'),
  slug: z.string().min(1, 'Slug là bắt buộc').regex(/^[a-z0-9-]+$/, 'Slug chỉ gồm a-z, 0-9, -'),
})

type OrgForm = z.infer<typeof orgSchema>

export function OrgCreateDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugValue, setSlugValue] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<OrgForm>({
    resolver: zodResolver(orgSchema),
  })

  const onSubmit = async (data: OrgForm) => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.rpc('create_org_with_owner', {
        p_name: data.name,
        p_slug: data.slug,
      })
      if (error) throw new Error(error.message || 'Tạo thư phòng thất bại')
      setOpen(false)
      reset()
      window.location.reload()
    } catch (e: any) {
      setError(e.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-400 dark:bg-brand-500 hover:bg-brand/80 dark:hover:bg-brand/50 text-foreground border-brand-500/75 dark:border-brand/30 hover:border-brand-600 dark:hover:border-brand focus-visible:outline-brand-600 data-[state=open]:bg-brand-400/80 dark:data-[state=open]:bg-brand-500/80 data-[state=open]:outline-brand-600 text-xs px-2.5 py-1 h-[26px] w-min">
          <div className="[&_svg]:h-[14px] [&_svg]:w-[14px] text-brand-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </div>
          <span className="truncate">Tạo thư phòng</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo thư phòng mới</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="org_name" className="block text-sm font-medium mb-1">Tên thư phòng</label>
            <Input
              id="org_name"
              {...register('name', {
                onChange: (e) => {
                  // Auto-slugify as user types name if slug is empty or matches previous slugified name
                  const nameVal = e.target.value
                  setTimeout(() => {
                    setValue('slug', slugify(nameVal))
                    setSlugValue(slugify(nameVal))
                  }, 0)
                },
              })}
              placeholder="Nhập tên thư phòng"
              disabled={loading}
            />
            {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name.message}</div>}
          </div>
          <div>
            <label htmlFor="org_slug" className="block text-sm font-medium mb-1">Slug</label>
            <Input
              id="org_slug"
              {...register('slug', {
                onChange: (e) => {
                  const val = slugify(e.target.value)
                  setValue('slug', val)
                  setSlugValue(val)
                },
              })}
              value={slugValue}
              onChange={(e) => {
                const val = slugify(e.target.value)
                setValue('slug', val)
                setSlugValue(val)
              }}
              placeholder="vi-du-slug"
              disabled={loading}
            />
            {errors.slug && <div className="text-xs text-red-500 mt-1">{errors.slug.message}</div>}
          </div>
          {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
