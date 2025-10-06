
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/components/ui/breadcrumb'
import { Separator } from '@/components/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/components/ui/sidebar'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/components/organization-sidebar'
import ChapterList from '@/components/components/chapter-list'
import { notFound } from 'next/navigation'
import { ChapterProvider } from '@/components/hooks/use-chapter'

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get project id from params
  const projectId = typeof window === 'undefined' ? undefined : window.location.pathname.split('/').pop();
  // If using Next.js dynamic route, get from params
  // @ts-ignore
  const params = (typeof window === 'undefined' && typeof arguments !== 'undefined' && arguments[0]) ? arguments[0] : {};
  const id = params?.params?.id || projectId;
  if (!id) return notFound();

  // Get project info
  const { data: project, error: projectError } = await supabase.from('projects').select('id, name, description, organization_id, created_at, updated_at').eq('id', id).single();
  if (!project || projectError) return notFound();

  // Get org info
  const { data: org } = await supabase.from('organizations').select('id, name, slug').eq('id', project.organization_id).single();

  return (
    <ChapterProvider>
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
                    <BreadcrumbLink href="/dashboard/organizations">Thư phòng</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={`/dashboard/organizations/${org?.id}`}>{org?.name || ''}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="hidden md:block">
                    <span className="font-bold">{project.name}</span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <ChapterList />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ChapterProvider>
  )
}
