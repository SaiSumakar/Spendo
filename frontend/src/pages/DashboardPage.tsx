// apps/web/src/features/dashboard/DashboardPage.tsx
import { DashboardLayout } from '../components/DashboardLayout';
import { StatCard, SpendingChart, BudgetHealth } from '../components/DashboardWidgets';
import { mockStats, mockSpendingData, mockSubscriptions, mockTransactions } from './data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarClock, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      
      {/* 1. Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Monthly Burn" value={`$${mockStats.monthlyBurn}`} subtext="+12% from last month" trend="up" />
        <StatCard title="Active Subs" value={mockStats.activeSubs} subtext="2 expiring soon" trend="down" />
        <StatCard title="Total Spent (YTD)" value="$2,340" subtext="On track" trend="down" />
        <div className="hidden lg:block"> {/* Spacer or extra widget */}
            <StatCard title="Credit Score" value="740" subtext="Excellent" trend="up" />
        </div>
      </div>

      {/* 2. Main Grid: Charts & Budget */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
        <SpendingChart data={mockSpendingData} />
        <BudgetHealth spent={mockStats.monthlyBurn} total={mockStats.budgetLimit} />
      </div>

      {/* 3. Bottom Grid: Subscriptions & Transactions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Active Subscriptions (Left 4 cols) */}
        <Card className="col-span-4 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Bills</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSubscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{sub.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" /> Due {sub.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${sub.price}</p>
                    <Badge variant={sub.status === 'Warning' ? 'destructive' : 'secondary'} className="text-[10px]">
                      {sub.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity (Right 3 cols) */}
        <Card className="col-span-3 border-none shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{tx.title}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <div className={`ml-auto font-medium ${tx.amount > 0 ? 'text-emerald-600' : ''}`}>
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}