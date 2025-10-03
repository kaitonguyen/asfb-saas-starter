
import { AppSidebar } from '@/components/components/organization-sidebar'
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
import { notFound } from 'next/navigation'
import { Card } from '@/components/components/ui/card'
import { WordCountChart } from '@/components/components/word-count-chart'

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
  console.log(project, projectError)
  if (!project || projectError) return notFound();

  // Get org info
  const { data: org } = await supabase.from('organizations').select('id, name, slug').eq('id', project.organization_id).single();

  // Get memberships and subscription for sidebar/context
  const { data: memberships } = await supabase.from('memberships').select(`*, organizations (id, name, slug)`).eq('user_id', user.id).eq('role', 'owner');
  const { data: subscription } = await supabase.from('subscriptions').select('plan').eq('user_id', user.id).eq('status', 'active').single();
  const plan = subscription?.plan || 'free';

  // Mock data for dashboard
  const stats = {
    chapters: 12,
    scenes: 34,
    sections: 78,
    words: 24567,
  };
  // Mock daily word count data
  const today = new Date();
  const wordCountByDay: { [date: string]: number } = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    wordCountByDay[d.toISOString().slice(0, 10)] = Math.floor(Math.random() * 2000);
  }

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
                  <BreadcrumbLink href="/dashboard/organizations">Thư phòng</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="hidden md:block">
                  {org?.name || ''}
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
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            {/* Dashboard cards */}
            <Card className="p-6 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-brand-600">{stats.chapters}</div>
              <div className="text-sm text-gray-500 mt-2">Chương đã viết</div>
            </Card>
            <Card className="p-6 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-brand-600">{stats.scenes}</div>
              <div className="text-sm text-gray-500 mt-2">Cảnh đã viết</div>
            </Card>
            <Card className="p-6 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-brand-600">{stats.sections}</div>
              <div className="text-sm text-gray-500 mt-2">Đoạn đã viết</div>
            </Card>
            <Card className="p-6 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-brand-600">{stats.words.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-2">Số từ đã viết</div>
            </Card>
            {/* Calendar for daily word count */}
            <div className="w-full col-span-4">
              <WordCountChart />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
