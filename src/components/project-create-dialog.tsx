"use client"
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/components/ui/dialog'
import { Input } from '@/components/components/ui/input'
import { Button } from '@/components/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const getPlanName = (plan: string) => {
  if (plan === 'trial') return 'Dùng thử'
  if (plan === 'free') return 'Cơ bản'
  if (plan === 'pro') return 'Chuyên nghiệp'
  if (plan === 'pre') return 'Cao cấp'
  return plan
}

export function ProjectCreateDialog({ orgId, currentCount, maxProjects, plan }: { orgId: string, currentCount: number, maxProjects: number, plan: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const canCreate = currentCount < maxProjects;
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from('projects').insert({ name, organization_id: orgId });
      if (error) throw new Error(error.message || 'Tạo project thất bại');
      setOpen(false);
      window.location.reload();
    } catch (e: any) {
      setError(e.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };
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
          <span className="truncate">Tạo dự án</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo dự án mới</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleCreate} noValidate>
          <div>
            <label htmlFor="project_name" className="block text-sm font-medium mb-1">Tên dự án</label>
            <Input id="project_name" value={name} onChange={e => setName(e.target.value)} placeholder="Nhập tên dự án" disabled={loading} />
          </div>
          {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={loading || !name}>{loading ? 'Đang tạo...' : 'Tạo'}</Button>
          </div>
          {!canCreate && <div className="text-xs text-yellow-600 mt-2">Bạn đã đạt giới hạn số dự án cho gói <b>{getPlanName(plan)}</b>.</div>}
        </form>
      </DialogContent>
    </Dialog>
  );
}