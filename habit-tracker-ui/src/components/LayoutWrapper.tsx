"use client"

import { usePathname } from 'next/navigation'
import { TopNavBar } from "@/components/TopNavBar"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Don't show top nav on auth page
  const isAuthPage = pathname === '/auth'
  
  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar />
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}