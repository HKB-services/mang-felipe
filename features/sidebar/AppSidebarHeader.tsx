import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ROUTES } from "@/constants"
import APP_DETAILS from "@/constants/app.details"
import { IconToolsKitchen2 } from "@tabler/icons-react"
import Link from "next/link"

const AppSidebarHeader = () => {
  return (
    <SidebarHeader className="border-sidebar-border px-3 py-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            tooltip={APP_DETAILS.name}
            className="h-auto rounded-lg px-1 py-1.5"
            render={<Link href={ROUTES.HOME} className="w-full" />}
          >
            <div className="hidden size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground group-data-[collapsible=icon]:flex">
              <IconToolsKitchen2 className="size-4" aria-hidden />
            </div>
            <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
                {APP_DETAILS.name}
              </span>
              <span className="mt-0.5 text-[0.65rem] font-medium tracking-[0.16em] text-sidebar-foreground/60 uppercase">
                Operations
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}

export default AppSidebarHeader
