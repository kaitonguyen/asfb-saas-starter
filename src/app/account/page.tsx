import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/components/ui/tabs'
import { ProfileForm } from '@/components/account/profile-form'
import { getOrgConfig } from '@/lib/org-config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card'
import { SubscriptionSummary } from '@/components/account/subscription-summary'

export default function AccountPage() {
  const org = getOrgConfig()
  return (
    <main className="container py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, {org.labelPlural.toLowerCase()}, and subscription</p>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orgs">{org.labelPlural}</TabsTrigger>
          <TabsTrigger value="billing">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="orgs">
          <Card>
            <CardHeader>
              <CardTitle>{org.labelPlural}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">View and create {org.labelPlural.toLowerCase()}.</p>
                <Link className="underline" href={org.route as any}>Go to {org.labelPlural.toLowerCase()}</Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Your organizations and their current plan/status.</p>
              <SubscriptionSummary />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
