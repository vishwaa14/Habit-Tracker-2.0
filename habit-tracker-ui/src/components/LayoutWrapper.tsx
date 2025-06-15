"use client"

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar" 
import { AppSidebar } from "@/components/app-sidebar"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Don't show sidebar on auth page
  const isAuthPage = pathname === '/auth'
  
  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}