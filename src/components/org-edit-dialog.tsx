"use client"
import { Input } from '@/components/components/ui/input'
import { Button } from '@/components/components/ui/button'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Edit, Edit2, Edit3 } from 'lucide-react'
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

// OrgEditDialog: edit name/slug for an existing org
export function OrgEditDialog({ org }: { org: { id: string, name: string, slug: string } }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugValue, setSlugValue] = useState(org.slug)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<OrgForm>({
    resolver: zodResolver(orgSchema),
    defaultValues: { name: org.name, slug: org.slug },
  })

  const onSubmit = async (data: OrgForm) => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.from('organizations').update({ name: data.name, slug: data.slug }).eq('id', org.id)
      if (error) throw new Error(error.message || 'Cập nhật thất bại')
      setOpen(false)
      reset({ name: data.name, slug: data.slug })
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
        <Button size="icon" variant="outline" className="text-xs w-7 h-7 p-0">
          <Edit3 className="text-sm" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật thư phòng</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="org_name" className="block text-sm font-medium mb-1">Tên thư phòng</label>
            <Input
              id="org_name"
              {...register('name', {
                onChange: (e) => {
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
            <Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
