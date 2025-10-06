"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  CreditCard,
  DoorOpen,
  Files,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  LucideBlocks,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavProjects } from "@/components/components/nav-projects"
import { NavUser } from "@/components/components/nav-user"
import { TeamSwitcher } from "@/components/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/components/ui/sidebar"
import { createClient } from "@/lib/supabase/component"
import { NavAccounts } from "./nav-account"
import { useParams } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient()
  const [user, setUser] = React.useState<any>(null)
  const params = useParams();
  const projectId = params?.id;

  const data = {
    project: [
      {
        name: "Tổng quan",
        url: "/dashboard/project/" + projectId,
        icon: LucideBlocks,
      },
    ],
    accounts: [
      {
        name: "Thư phòng",
        url: "/dashboard/organizations",
        icon: DoorOpen,
      },
      {
        name: "Thanh toán",
        url: "/dashboard/account/billing",
        icon: CreditCard,
      },
    ]
  }

  React.useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [supabase])

  if (!user) return null
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg ">
            <img src="/logo_color.png" alt="Skripter" className="h-5 w-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              Skripter
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projectId={projectId} />
        <NavAccounts accounts={data.accounts} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
