import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/components/ui/table'

type Props = { params: { slug: string } }

export default function DashboardPage({ params }: Props) {
  return (
    <main className="container py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard - {params.slug}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Overview of your organization</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">2 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">-3% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$3,240</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { item: 'Project Alpha', actor: 'Jane', date: '2025-09-17' },
                  { item: 'Invite sent', actor: 'Admin', date: '2025-09-16' },
                  { item: 'Bug fixed', actor: 'Tom', date: '2025-09-15' },
                ].map((r) => (
                  <TableRow key={`${r.item}-${r.date}`}>
                    <TableCell className="font-medium">{r.item}</TableCell>
                    <TableCell>{r.actor}</TableCell>
                    <TableCell className="hidden sm:table-cell">{r.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {['Jane Cooper', 'Tom Cook', 'Dev Patel', 'Admin'].map((m) => (
                <li key={m} className="flex items-center justify-between">
                  <span>{m}</span>
                  <span className="text-muted-foreground">Member</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
