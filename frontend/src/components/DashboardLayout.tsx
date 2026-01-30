// apps/web/src/features/dashboard/DashboardLayout.tsx
import { LayoutDashboard, CreditCard, Settings, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 flex">
      
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background px-4 py-6 gap-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">S</div>
          <span className="text-xl font-bold">Spendo</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <Button variant="secondary" className="justify-start gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</Button>
          <Button variant="ghost" className="justify-start gap-2"><CreditCard className="w-4 h-4" /> Subscriptions</Button>
          <Button variant="ghost" className="justify-start gap-2"><Settings className="w-4 h-4" /> Settings</Button>
        </nav>

        <div className="border-t pt-4">
          <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => navigate('/login')}
          >
            <LogOut className="w-4 h-4" /> Logout
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

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};