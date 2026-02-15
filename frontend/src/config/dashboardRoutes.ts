import {
  LayoutDashboard,
  CreditCard,
  Settings,
  ArrowLeftRight,
} from "lucide-react"

export type DashboardRoute = {
  path: string
  label: string
  icon: React.ElementType
}

export const dashboardRoutes: DashboardRoute[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
  },
  {
    path: "/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
  },
]
