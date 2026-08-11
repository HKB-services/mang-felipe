import { ROUTES } from "@/constants"
import {
  IconClipboardList,
  IconLayoutGrid,
  IconTestPipe,
  IconToolsKitchen2,
} from "@tabler/icons-react"
import type { NavMainGroup } from "./NavMain"

export const sidebarNavGroups: NavMainGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: ROUTES.DASHBOARD,
        icon: IconLayoutGrid,
      },
    ],
  },
  {
    label: "Orders",
    items: [
      {
        title: "All orders",
        url: ROUTES.ADMIN_ORDERS,
        icon: IconClipboardList,
      },
    ],
  },
  {
    label: "Menu",
    items: [
      {
        title: "Manage menu",
        url: ROUTES.ADMIN_MENU,
        icon: IconToolsKitchen2,
      },
    ],
  },

  // Show Test UI only in dev
  ...(process.env.NODE_ENV === "development"
    ? [
      {
        label: "Test UI",
        items: [
          {
            title: "Test UI",
            url: ROUTES.TEST_UI,
            icon: IconTestPipe,
          },
        ],
      },
    ]
    : []),
]
