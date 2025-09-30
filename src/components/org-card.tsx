"use client"
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/components/ui/dialog'
import { Input } from '@/components/components/ui/input'
import { Button } from '@/components/components/ui/button'
import { Icons } from '@/components/icons/icons'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { OrgEditDialog } from './org-edit-dialog'

export function OrgCard({ membership }: { membership: any }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmName, setConfirmName] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const orgName = membership.organizations.name
  const orgId = membership.org_id
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.from('organizations').delete().eq('id', orgId)
      if (error) throw new Error(error.message || 'Xóa thất bại')
      setDeleteOpen(false)
      window.location.reload()
    } catch (err: any) {
      setDeleteError(err.message || 'Có lỗi xảy ra')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="relative group">
      <a href={`/dashboard/organizations/${orgId}`}>
        <div className="overflow-hidden rounded-lg text-card-foreground shadow-sm grow bg-surface-100 p-3 transition-colors hover:bg-surface-200 border border-light hover:border-default cursor-pointer flex items-center min-h-[70px] [&_>div]:w-full [&_>div]:items-center">
          <div className="relative flex items-start gap-3">
            <div className="rounded-full bg border w-8 h-8 flex items-center justify-center flex-shrink-0">
              <Icons.brush className="text-foreground" size={18} />
            </div>
            <div className="flex-grow flex flex-col gap-0 min-w-0">
              <h3 title={orgName} className="text-sm text-foreground mb-0 truncate max-w-full">{orgName}</h3>
              <div className="flex items-center justify-between text-xs text-foreground-light font-sans">
                <div className="flex items-center gap-x-1.5">
                  <span>{membership.organizations.length || 0} dự án</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
      {/* Delete button and dialog (only for owner) */}
      <div className="absolute top-2 right-2 z-10">
        <div className='flex items-center gap-2'>
          <OrgEditDialog org={{ id: orgId, name: orgName, slug: membership.organizations.slug }} />
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="destructive" className="w-7 h-7 p-0 text-xs" title="Xóa thư phòng">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Xóa thư phòng</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleDelete} className="space-y-4">
                <div>Bạn chắc chắn muốn xóa <b>{orgName}</b>? Hành động này không thể hoàn tác.<br />Nhập lại tên thư phòng để xác nhận:</div>
                <Input value={confirmName} onChange={e => setConfirmName(e.target.value)} placeholder={orgName} autoFocus disabled={deleteLoading} />
                {deleteError && <div className="text-xs text-red-500 mt-1">{deleteError}</div>}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleteLoading}>Hủy</Button>
                  <Button type="submit" variant="destructive" disabled={deleteLoading || confirmName !== orgName}>{deleteLoading ? 'Đang xóa...' : 'Xóa'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}