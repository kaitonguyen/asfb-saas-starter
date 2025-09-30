
import { AppSidebar } from '@/components/components/organization-sidebar'
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
import { ProjectCreateDialog } from '@/components/project-create-dialog'
import { createClient } from '@/lib/supabase/server'
import { Project } from '@/lib/constants/project'

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  // Get memberships and orgs
  const { data: memberships } = await supabase.from('memberships').select(`*, organizations (id, name, slug)`).eq('user_id', user.id).eq('role', 'owner');
  // Get subscription info for user (assume 1 active subscription per user)
  const { data: subscription } = await supabase.from('subscriptions').select('plan').eq('user_id', user.id).eq('status', 'active').single();
  // Get projects for the first org (for demo, real app should support multi-org)
  let orgId = memberships?.[0]?.organizations?.id;

  let orgProjects: Project[] = [];
  if (orgId) {
    const { data: projects } = await supabase.from('projects').select('id, name, organization_id').eq('organization_id', orgId);
    orgProjects = projects || [];
  }

  // Project creation limits by plan
  const plan = subscription?.plan || 'free';
  let maxProjects = 1;
  if (plan === 'pro') maxProjects = 5;
  if (plan === 'pre') maxProjects = 9999;

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
                  <BreadcrumbLink href="/organizations">
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
                          <h1 className="">Thư phòng của bạn: <span className='text-xl font-bold'>{memberships?.[0]?.organizations?.name}</span></h1>
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
              {/* Project section */}
              {orgId && (
                <div className="mx-auto w-full max-w-[1200px] px-4 @lg:px-6 @xl:px-10 mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">Dự án</h2>
                    <ProjectCreateDialog orgId={orgId} currentCount={orgProjects.length} maxProjects={maxProjects} plan={plan} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {orgProjects.length > 0 ? orgProjects.map((project: any) => (
                      <div key={project.id} className="rounded border p-4 bg-white shadow-sm">
                        <div className="font-medium text-base">{project.name}</div>
                        <div className="text-xs text-gray-500">ID: {project.id}</div>
                      </div>
                    )) : (
                      <div className="text-sm text-foreground-light col-span-3 text-center">Chưa có dự án nào.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
