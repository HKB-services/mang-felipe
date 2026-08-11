import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import AppSidebar from "@/features/sidebar/AppSidebar"
import { Separator } from "@base-ui/react"
import React, { Suspense } from "react"
import { getServerSession } from "@/features/auth/server/session.server"
import { ROUTES } from "@/constants/app.routes"
import { redirect } from "next/navigation"
import BreadcrumbSidebar from "@/features/sidebar/BreadcrumbSidebar"
import { ThemeToggle } from "@/components/ThemeToggle"

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession()
  if (!session) {
    redirect(ROUTES.LOGIN)
  }
  return (
    <Suspense>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center border-b bg-background/95 transition-[width,height] ease-linear supports-[backdrop-filter]:backdrop-blur group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
            <div className="flex w-full items-center justify-between px-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="size-9 rounded-lg" />
                <Separator
                  orientation="vertical"
                  className="mr-1 data-[orientation=vertical]:h-6"
                />
                <div className="min-w-0 overflow-hidden [&_[data-slot=breadcrumb-list]]:flex-nowrap [&_[data-slot=breadcrumb-page]]:truncate">
                  <BreadcrumbSidebar />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <ThemeToggle />
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col p-5 sm:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  )
}

export default ProtectedLayout
