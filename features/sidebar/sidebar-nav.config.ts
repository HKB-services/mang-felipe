import { ROUTES } from "@/constants"
import {
  IconLayoutGrid,
  IconTestPipe,
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
