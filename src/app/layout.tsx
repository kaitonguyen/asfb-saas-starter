import 'src/app/globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Skripter',
  description: 'Ứng dụng tuyệt vời cho những người yêu viết lách',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        {/* <OrgSwitcher /> */}
        {children}
      </body>
    </html>
  )
}
