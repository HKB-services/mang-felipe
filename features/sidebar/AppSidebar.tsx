"use client"

import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import AppSidebarFooter from "./AppSidebarFooter"
import AppSidebarHeader from "./AppSidebarHeader"
import NavMain from "./NavMain"
import { sidebarNavGroups } from "./sidebar-nav.config"

const AppSidebar = () => {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="inset">
      <AppSidebarHeader />
      <SidebarContent className="px-2 py-3">
        <NavMain groups={sidebarNavGroups} pathname={pathname} />
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar
