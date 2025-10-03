import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/components/ui/breadcrumb'
import { Separator } from '@/components/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/components/ui/sidebar'
import { OrgCreateDialog } from '@/components/org-create-dialog'
import { OrgCard } from '@/components/org-card'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/components/app-sidebar'

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: memberships } = await supabase.from('memberships').select(`*, organizations (id, name, slug)`).eq('user_id', user.id).eq('role', 'owner');

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/organizations">
                    Thư phòng
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 w-full overflow-y-hidden">
          <div className="flex-grow h-full overflow-y-auto">
            <div className="w-full min-h-full flex flex-col items-stretch" >
              <div className="max-w-[1200px] px-4 @lg:px-6 @xl:px-10 w-full mx-auto pt-12">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <h1 className="text-2xl font-bold">Thư phòng của bạn</h1>
                        </div>
                      </div>
                    </div>
                    {
                      memberships && memberships.length === 0 && (
                        <div className="flex items-center gap-2">
                          <OrgCreateDialog />
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[1200px] px-4 @lg:px-6 @xl:px-10">
                <div className="first:pt-12 py-6 w-full flex flex-col gap-y-4">
                  <div className="flex items-center justify-between gap-x-2 md:gap-x-3">
                    <div className="relative group">
                      {/*
                      <input placeholder="Tìm kiếm thư phòng" ... />
                      */}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {
                      memberships && memberships?.length > 0 ? memberships.map((membership: any) => (
                        <OrgCard key={membership.org_id} membership={membership} />
                      )) : (
                        <div className="text-sm text-foreground-light col-span-3 text-center">Bạn chưa có thư phòng nào của mình. Hãy tạo thư phòng mới.</div>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
