import { ReactNode } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/components/ui/sidebar'
import { AppSidebar } from '@/components/components/app-sidebar'

export default function TenantLayout({ children, params }: { children: ReactNode; params: { slug: string } }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-[100svh]">
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
