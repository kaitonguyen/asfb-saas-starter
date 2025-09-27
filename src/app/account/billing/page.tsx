import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/components/ui/table'
import { Button } from '@/components/components/ui/button'

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

  const { data: plans } = await supabase.from('prices').select('*').eq('is_active', true).order('amount_cents')
  const { data: subscription } = await supabase.from('subscriptions').select('*').eq('org_id', orgId).maybeSingle()
  const { data: invoices } = await supabase.from('invoices').select('*').eq('org_id', orgId).order('issued_at', { ascending: false }).limit(20)
  const { data: credit } = await supabase.from('credit_balances').select('*').eq('org_id', orgId).maybeSingle()
  return { plans: plans || [], subscription, invoices: invoices || [], credit }
}

export default async function BillingPage() {
  const { plans, subscription, invoices, credit } = await getData()

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 @lg:px-6 @xl:px-10 my-8 flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Thanh toán</h1>
      <section className="flex flex-col first:pt-12 py-6 gap-3 lg:grid md:grid-cols-12">

        <div className='col-span-4 xl:col-span-5 prose text-sm'>
          <div className="sticky space-y-6 top-12">
            <div className="space-y-2 mb-4">
              <p className="text-foreground text-base m-0 font-semibold">Gói Đăng Ký</p>
              <p className="text-sm text-foreground-light m-0">Mỗi thư phòng có gói đăng ký, chu kỳ thanh toán, phương thức thanh toán và hạn mức sử dụng riêng.</p>
            </div>
          </div>
        </div>
        <div className='col-span-8 xl:col-span-7 flex flex-col gap-6'>
          <div className="space-y-6">
            <div>
              <p class="text-2xl text-brand">Free Plan</p>
              </div>
              <div>
                <button type="button" class="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground bg-alternative dark:bg-muted hover:bg-selection border-strong hover:border-stronger focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover text-xs px-2.5 py-1 h-[26px] pointer-events-auto" data-state="instant-open" data-sentry-element="TooltipTrigger" data-sentry-source-file="ProjectUpdateDisabledTooltip.tsx" aria-describedby="radix-:ru4:"> <span class="truncate">Change subscription plan</span> </button></div><div role="alert" class="relative w-full text-sm rounded-lg p-4 [&amp;&gt;svg~*]:pl-10 [&amp;&gt;svg+div]:translate-y-[-3px] [&amp;&gt;svg]:absolute [&amp;&gt;svg]:left-4 [&amp;&gt;svg]:top-4 [&amp;&gt;svg]:w-[23px] [&amp;&gt;svg]:h-[23px] [&amp;&gt;svg]:p-1 [&amp;&gt;svg]:flex [&amp;&gt;svg]:rounded text-foreground [&amp;&gt;svg]:text-background mb-2 [&amp;&gt;svg]:bg-foreground-muted bg-surface-200/25 border border-default"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 20" class="w-6 h-6" fill="currentColor" data-sentry-element="svg" data-sentry-component="InfoIcon" data-sentry-source-file="admonition.tsx"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.625 9.8252C0.625 4.44043 4.99023 0.0751953 10.375 0.0751953C15.7598 0.0751953 20.125 4.44043 20.125 9.8252C20.125 15.21 15.7598 19.5752 10.375 19.5752C4.99023 19.5752 0.625 15.21 0.625 9.8252ZM9.3584 4.38135C9.45117 4.28857 9.55518 4.20996 9.66699 4.14648C9.88086 4.02539 10.1245 3.96045 10.375 3.96045C10.5845 3.96045 10.7896 4.00586 10.9766 4.09229C11.1294 4.1626 11.2705 4.26025 11.3916 4.38135C11.6611 4.65088 11.8125 5.0166 11.8125 5.39795C11.8125 5.5249 11.7959 5.6499 11.7637 5.77002C11.6987 6.01172 11.5718 6.23438 11.3916 6.41455C11.1221 6.68408 10.7563 6.83545 10.375 6.83545C9.99365 6.83545 9.62793 6.68408 9.3584 6.41455C9.08887 6.14502 8.9375 5.7793 8.9375 5.39795C8.9375 5.29492 8.94873 5.19287 8.97021 5.09375C9.02783 4.82568 9.16162 4.57812 9.3584 4.38135ZM10.375 15.6899C10.0933 15.6899 9.82275 15.5781 9.62354 15.3789C9.42432 15.1797 9.3125 14.9092 9.3125 14.6274V9.31494C9.3125 9.0332 9.42432 8.7627 9.62354 8.56348C9.82275 8.36426 10.0933 8.25244 10.375 8.25244C10.6567 8.25244 10.9272 8.36426 11.1265 8.56348C11.3257 8.7627 11.4375 9.0332 11.4375 9.31494V14.6274C11.4375 14.7944 11.3979 14.9575 11.3242 15.104C11.2739 15.2046 11.2075 15.2979 11.1265 15.3789C10.9272 15.5781 10.6567 15.6899 10.375 15.6899Z" data-sentry-element="path" data-sentry-source-file="admonition.tsx"></path></svg><h5 class="mb-1 text mt-0.5 flex gap-3 text-sm [&amp;_p]:mb-1.5 [&amp;_p]:mt-0 flex-col">This organization is limited by the included usage</h5><div class="text-sm [&amp;_p]:leading-relaxed text-foreground-light font-normal [&amp;_p]:mb-1.5 [&amp;_p]:mt-0"><div class="[&amp;&gt;p]:!leading-normal prose text-sm">Projects may become unresponsive when this organization exceeds its <a href="/dashboard/org/eulghqazyvmqvjvwfwqe/usage">included usage quota</a>. To scale seamlessly, upgrade to a paid plan.
          </div>
          </div>
          </div>
          </div>
        </div>
        {plans.map((p: any) => {
          const active = subscription?.plan === p.code
          return (
            <Card key={p.id} className={active ? 'border-primary' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{p.name}</span>
                  {active && <span className="text-xs rounded bg-primary/10 px-2 py-1 text-primary">Hiện tại</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="text-2xl font-bold">{p.amount_cents === 0 ? 'Miễn phí' : `$${(p.amount_cents / 100).toFixed(2)}`}</div>
                <p className="text-muted-foreground min-h-[2rem]">{p.description}</p>
                <form action="/api/billing/change-plan" method="post" className="mt-2">
                  <input type="hidden" name="plan" value={p.code} />
                  <Button type="submit" size="sm" disabled={active}>{active ? 'Đang dùng' : 'Chọn gói'}</Button>
                </form>
              </CardContent>
            </Card>
          )
        })}
        {plans.length === 0 && <p className="text-sm text-muted-foreground">Chưa có gói nào.</p>}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 order-2 md:order-1">
          <CardHeader>
            <CardTitle>Hóa đơn gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Gói</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead className="hidden sm:table-cell">Trạng thái</TableHead>
                  <TableHead className="hidden md:table-cell">Ngày xuất</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv: any) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium text-xs">{inv.id.slice(0, 8)}</TableCell>
                    <TableCell className="text-xs">{inv.price_code}</TableCell>
                    <TableCell className="text-xs">{inv.amount_cents === 0 ? '0' : `$${(inv.amount_cents / 100).toFixed(2)}`}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs capitalize">{inv.status}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{inv.issued_at ? new Date(inv.issued_at).toLocaleDateString('vi-VN') : ''}</TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">Chưa có hóa đơn.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="order-1 md:order-2">
          <CardHeader>
            <CardTitle>Số dư tín dụng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-semibold">{(credit?.cents ?? 0) / 100}</span> USD</p>
            <p className="text-muted-foreground">Dùng để trừ vào hóa đơn kỳ sau.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
