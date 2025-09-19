"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/components/lib/utils"

// Sidebar state and context
type SidebarContextValue = {
  open: boolean
  setOpen: (v: boolean) => void
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)')
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile('matches' in e ? e.matches : (e as MediaQueryList).matches)
    onChange(mql)
    const handler = (e: MediaQueryListEvent) => onChange(e)
    mql.addEventListener?.('change', handler as any)
    return () => mql.removeEventListener?.('change', handler as any)
  }, [])
  const value = React.useMemo(() => ({ open, setOpen, isMobile }), [open, isMobile])
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}

// Layout primitives
type SidebarProps = React.HTMLAttributes<HTMLElement> & { collapsible?: "icon" | "off" }
export function Sidebar({ className, children }: React.PropsWithChildren<SidebarProps>) {
  const { open } = useSidebar()
  return (
    <aside
      data-collapsible={"icon"}
      data-state={open ? 'open' : 'collapsed'}
      className={cn(
        "hidden md:flex flex-col border-r bg-background text-foreground",
        open ? "w-64 lg:w-72" : "w-14",
        className
      )}
    >
      {children}
    </aside>
  )
}

export function SidebarHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("h-14 px-3 flex items-center border-b", className)}>{children}</div>
}

export function SidebarFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mt-auto border-t px-2 py-2", className)}>{children}</div>
}

export function SidebarContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex-1 overflow-y-auto px-2 py-3", className)}>{children}</div>
}

export function SidebarRail({ className }: { className?: string }) {
  return <div className={cn("hidden md:block w-px bg-border", className)} />
}

export function SidebarInset({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex-1", className)}>{children}</div>
}

export function SidebarTrigger({ className, asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  const { open, setOpen } = useSidebar()
  return (
    <Comp
      className={cn("inline-flex items-center rounded-md border px-2 py-1 text-sm", className)}
      onClick={(e: any) => { setOpen(!open); props.onClick?.(e) }}
      {...props}
    />
  )
}

// Menu/group primitives used by nav components
export function SidebarGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mb-3", className)}>{children}</div>
}

export function SidebarGroupLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-2 pb-1 text-xs font-medium text-muted-foreground", className)}>{children}</div>
}

export function SidebarMenu({ className, children }: { className?: string; children: React.ReactNode }) {
  return <ul className={cn("flex flex-col gap-1", className)}>{children}</ul>
}

export function SidebarMenuItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return <li className={cn("", className)}>{children}</li>
}

type AsChildProps = { asChild?: boolean }
export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & AsChildProps
>(function SidebarMenuButton({ className, asChild, children, ...props }, ref) {
  const Comp: any = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      className={cn(
        "w-full inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-sm hover:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
})

export function SidebarMenuAction({ className, children, showOnHover }: { className?: string; children: React.ReactNode; showOnHover?: boolean }) {
  return <div className={cn("ml-auto inline-flex items-center", showOnHover && "group-hover:flex hidden", className)}>{children}</div>
}

export function SidebarMenuSub({ className, children }: { className?: string; children: React.ReactNode }) {
  return <ul className={cn("ml-6 mt-1 flex flex-col gap-1", className)}>{children}</ul>
}

export function SidebarMenuSubItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return <li className={cn("", className)}>{children}</li>
}

export const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & AsChildProps
>(function SidebarMenuSubButton({ className, asChild, children, ...props }, ref) {
  const Comp: any = asChild ? Slot : 'a'
  return (
    <Comp
      ref={ref}
      className={cn("inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm hover:bg-muted", className)}
      {...props}
    >
      {children}
    </Comp>
  )
})
