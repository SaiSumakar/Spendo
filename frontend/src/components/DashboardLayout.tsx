// apps/web/src/features/dashboard/DashboardLayout.tsx
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { cn } from "@/lib/utils"

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-background py-6 gap-4 sticky top-0 h-screen transition-all duration-300",
          collapsed ? "w-16 px-2" : "w-64 px-4"
        )}
      >
        {/* Logo + Toggle */}
        <div
          className={cn(
            "flex items-center mb-8",
            collapsed ? "justify-center" : "gap-2 px-2"
          )}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            S
          </div>

          {!collapsed && (
            <span className="text-xl font-bold">Spendo</span>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "ml-auto",
              collapsed && "ml-0 absolute top-6"
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          <SidebarItem
            to="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={collapsed}
            active={location.pathname === "/dashboard"}
          />

          <SidebarItem
            to="/subscriptions"
            icon={CreditCard}
            label="Subscriptions"
            collapsed={collapsed}
            active={location.pathname === "/subscriptions"}
          />

          <SidebarItem
            to="/settings"
            icon={Settings}
            label="Settings"
            collapsed={collapsed}
            active={location.pathname === "/settings"}
          />
        </nav>

        {/* Logout */}
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50",
              collapsed ? "justify-center" : "justify-start"
            )}
            onClick={() => navigate("/login")}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b bg-background/60 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="font-semibold text-lg">Overview</h2>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell className="w-4 h-4" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}

/* ---------------------------------- */
/* Sidebar Item Component */
/* ---------------------------------- */

type SidebarItemProps = {
  to: string
  icon: React.ElementType
  label: string
  collapsed: boolean
  active?: boolean
}

function SidebarItem({
  to,
  icon: Icon,
  label,
  collapsed,
  active,
}: SidebarItemProps) {
  return (
    <Button
      asChild
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "gap-3",
        collapsed ? "justify-center px-2" : "justify-start px-3"
      )}
      title={collapsed ? label : undefined}
    >
      <Link to={to}>
        <Icon className="w-4 h-4 shrink-0" />
        {!collapsed && <span>{label}</span>}
      </Link>
    </Button>
  )
}
