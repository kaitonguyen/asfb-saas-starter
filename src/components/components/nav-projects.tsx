"use client"

import {
  File,
  LucideBlocks,
  MoreHorizontal,
  Plus,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useChapter } from "../hooks/use-chapter"

export function NavProjects({
  projectId,
}: {
  projectId: string | string[]
}) {
  const { isMobile } = useSidebar()

  const handleNewChapter = async () => {
    // Tạo chương mới với tên mặc định và order_number cuối cùng
    const { createClient } = await import("@/lib/supabase/component");
    const supabase = createClient();
    // Lấy số chương hiện tại để xác định order_number
    const { data: chapters } = await supabase
      .from('chapters')
      .select('order_number')
      .eq('project_id', projectId);
    const maxOrder = chapters && chapters.length > 0
      ? Math.max(...chapters.map((c: any) => c.order_number)) + 1
      : 0;
    const { error } = await supabase
      .from('chapters')
      .insert({
        project_id: projectId,
        name: 'Chương mới',
        note: '',
        order_number: maxOrder,
      });
    if (error) {
      toast.error('Không thể tạo chương mới. Vui lòng thử lại!');
      console.error('Error creating chapter:', error);
      return;
    }
  }

  const { chapters } = useChapter();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Dự án</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={"Tổng quan"}>
            <LucideBlocks />
            <span>Tổng quan</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={"Bản thảo"}>
            <File />
            <span>Bản thảo</span>
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction
                showOnHover
                className="data-[state=open]:bg-accent rounded-sm"
              >
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              <DropdownMenuItem asChild>
                <Button size={"sm"} variant={"ghost"} className="flex items-center gap-2 w-full" onClick={handleNewChapter}>
                  <Plus size={16} />
                  <span>Chương</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Danh sách chương */}
          <SidebarMenuSub>
            {chapters.length > 0 ? (
              chapters.map((chapter) => (
                <SidebarMenuSubItem key={chapter.id}>
                  <SidebarMenuButton
                    tooltip={chapter.name}
                    asChild
                  >
                    <a href={`/dashboard/project/${projectId}/chapters/${chapter.id}/scence`} className="truncate">
                      {chapter.name}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              ))
            ) : (
              <SidebarMenuSubItem className="text-muted-foreground text-xs">Chưa có chương nào</SidebarMenuSubItem>
            )}
          </SidebarMenuSub>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
