// apps/web/src/features/dashboard/components/DashboardWidgets.tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, CalendarClock, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';

// --- 1. Spending Chart Widget ---
export const SpendingChart = ({ data }: { data: any[] }) => (
  <Card className="col-span-4 lg:col-span-3 border-none shadow-xl bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
    <CardHeader>
      <CardTitle>Spending Trends</CardTitle>
    </CardHeader>
    <CardContent className="h-62.5 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none' }} 
            itemStyle={{ color: '#1e293b' }}
          />
          <Area type="monotone" dataKey="amount" stroke="#8884d8" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// --- 2. Stat Card Widget ---
export const StatCard = ({ title, value, subtext, trend }: any) => (
  <Card className="hover:scale-105 transition-transform duration-200 cursor-pointer border-l-4 border-l-primary shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {trend === 'up' ? <ArrowUpRight className="h-4 w-4 text-rose-500" /> : <ArrowDownRight className="h-4 w-4 text-emerald-500" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
    </CardContent>
  </Card>
);

// --- 3. Budget Health Widget ---
export const BudgetHealth = ({ spent, total }: { spent: number, total: number }) => {
  const percentage = Math.min((spent / total) * 100, 100);
  return (
    <Card className="col-span-4 lg:col-span-1 bg-primary text-primary-foreground shadow-xl border-none relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/20 rounded-full blur-xl" />
      <CardHeader>
        <CardTitle className="text-white/90">Monthly Budget</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-extrabold tracking-tight">${total - spent}</div>
        <p className="text-sm text-white/80">Remaining available</p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Spent: ${spent}</span>
            <span>Limit: ${total}</span>
          </div>
          <Progress value={percentage} className="h-2 bg-black/20" />
        </div>
      </CardContent>
    </Card>
  );
};