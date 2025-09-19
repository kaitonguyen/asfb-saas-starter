"use client"
import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/components/ui/dropdown-menu'
import { Button } from '@/components/components/ui/button'

export type Org = { name: string; slug: string }

export function OrgSwitcherClient({ orgs }: { orgs: Org[] }) {
  const router = useRouter()
  const [value, setValue] = React.useState('')

  React.useEffect(() => {
    const match = window.location.pathname.match(/^\/o\/([^\/]+)/)
    if (match?.[1]) {
      setValue(match[1])
    }
  }, [])

  if (!orgs || orgs.length === 0) return null
  const currentLabel = value ? orgs.find((o) => o.slug === value)?.name ?? 'Switch organization' : 'Switch organization'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          {currentLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {orgs.map((o) => (
          <DropdownMenuItem
            key={o.slug}
            onClick={() => {
              setValue(o.slug)
              router.push(`/o/${o.slug}/dashboard`)
            }}
          >
            {o.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
