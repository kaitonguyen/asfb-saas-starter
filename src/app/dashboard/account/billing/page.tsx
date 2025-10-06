import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/components/ui/table'
import { Button } from '@/components/components/ui/button'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/components/ui/sidebar'
import { AppSidebar } from '@/components/components/app-sidebar'
import { Separator } from '@/components/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/components/ui/breadcrumb'

async function getData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { plans: [], subscription: null, invoices: [], credit: null }

  const { data: membership } = await supabase
    .from('memberships')
    .select('org_id, role')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (!membership) return { plans: [], subscription: null, invoices: [], credit: null }
  const orgId = membership.org_id

  // Fetch all active plans
  const { data: plansRaw } = await supabase.from('plans').select('*').eq('is_active', true).order('amount_cents')

  // Fetch current subscription and join with plan
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, plan:price_id(*)')
    .eq('org_id', orgId)
    .maybeSingle()

  // Check if org has ever used trial plan
  const { data: trialInvoice } = await supabase
    .from('invoices')
    .select('plan_code')
    .eq('org_id', orgId)
    .eq('plan_code', 'trial')
    .limit(1)
    .maybeSingle()

  // Only show trial plan if org has never used trial
  let plans = plansRaw || [];
  if (plans.some((p: any) => p.code === 'trial')) {
    if (trialInvoice) {
      plans = plans.filter((p: any) => p.code !== 'trial');
    }
  }

  const { data: invoices } = await supabase.from('invoices').select('*').eq('org_id', orgId).order('issued_at', { ascending: false }).limit(20)
  const { data: credit } = await supabase.from('credit_balances').select('*').eq('org_id', orgId).maybeSingle()
  return { plans, subscription, invoices: invoices || [], credit }
}

export default async function Page() {
  const { plans, subscription, invoices, credit } = await getData()
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
                <BreadcrumbItem>
                  <BreadcrumbPage>Thanh toán</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 max-w-[1200px] mx-auto">
          <h1 className="text-2xl font-semibold">Thanh toán</h1>
          <section className="flex flex-col first:pt-12 py-6 gap-3 lg:grid md:grid-cols-12">
            <div className='col-span-2 xl:col-span-4 prose text-sm'>
              <div className="sticky space-y-6 top-12">
                <div className="space-y-2 mb-4">
                  <p className="text-foreground text-base m-0 font-semibold">Gói Đăng Ký</p>
                </div>
              </div>
            </div>
            <div className='col-span-10 xl:col-span-8 flex flex-col gap-6'>
              <div className="space-y-6">
                <div>
                  <p className="text-2xl text-brand">Gói Cơ Bản</p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col first:pt-12 py-6 gap-3 lg:grid md:grid-cols-12">
            <div className='col-span-2 xl:col-span-4 prose text-sm'>
              <div className="sticky space-y-6 top-12">
                <div className="space-y-2 mb-4">
                  <p className="text-foreground text-base m-0 font-semibold">Bảng giá</p>
                </div>
              </div>
            </div>
            <div className='col-span-10 xl:col-span-8 flex flex-col gap-6'>
              <div className="grid grid-cols-4 gap-4">
                {plans.map((p: any) => {
                  // Determine if this plan is the active one for the current subscription
                  const active = subscription?.plan?.id === p.id
                  return (
                    <Card key={p.id} className={active ? 'border-primary' : ''}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{p.name}</span>
                          {active && <span className="text-xs rounded bg-primary/10 px-2 py-1 text-primary">Hiện tại</span>}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-3 text-sm">
                        <div className="text-2xl font-bold">{p.amount_cents === 0 ? 'Miễn phí' : `${(p.amount_cents / 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}</div>
                        <p className="text-muted-foreground min-h-[2rem] whitespace-pre-wrap">{p.description}</p>
                        <form action="/api/billing/change-plan" method="post" className="mt-2">
                          <input type="hidden" name="plan_id" value={p.id} />
                          <Button type="submit" size="sm" disabled={active}>{active ? 'Đang dùng' : 'Chọn gói'}</Button>
                        </form>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
