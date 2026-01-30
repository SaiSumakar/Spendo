// apps/web/src/features/dashboard/components/DashboardWidgets.tsx
import { 
  BarChart, Bar, Line, ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';
import { upcomingBills } from '../pages/data/mockData';

// --- 1. KPI Pulse Card ---
export const KpiCard = ({ title, value, subtext, icon: Icon, alert = false }: any) => (
  <Card className={`relative overflow-hidden ${alert ? 'border-amber-500/50 bg-amber-50/10' : ''}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {Icon && <Icon className={`h-4 w-4 ${alert ? 'text-amber-500' : 'text-primary'}`} />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
    </CardContent>
  </Card>
);

// --- 2. Spending Velocity Chart (Composed) ---
export const VelocityChart = ({ data }: { data: any[] }) => (
  <Card className="col-span-full lg:col-span-4 h-[350px]">
    <CardHeader>
      <CardTitle>Spending Velocity (Last 7 Days)</CardTitle>
    </CardHeader>
    <CardContent className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
          <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
             contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          {/* Daily Spend Bar */}
          <Bar yAxisId="left" dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.8} />
          {/* Cumulative Trend Line */}
          <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// --- 3. Category Donut Chart ---
export const CategoryDonut = ({ data }: { data: any[] }) => (
  <Card className="col-span-full lg:col-span-2 h-[350px]">
    <CardHeader>
      <CardTitle>Cost Distribution</CardTitle>
    </CardHeader>
    <CardContent className="h-[280px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// --- 4. Billing Timeline Strip ---
export const BillingTimeline = () => {
  // Generate next 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Billing Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {days.map((date, i) => {
            const bill = upcomingBills.find(b => isSameDay(b.date, date));
            const isToday = i === 0;

            return (
              <div key={i} className={`flex flex-col items-center min-w-[60px] p-2 rounded-xl border ${isToday ? 'bg-primary/5 border-primary' : 'bg-card'}`}>
                <span className="text-xs text-muted-foreground mb-1">{format(date, 'EEE')}</span>
                <span className={`text-sm font-bold mb-2 ${isToday ? 'text-primary' : ''}`}>{format(date, 'd')}</span>
                
                {bill ? (
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center animate-in zoom-in">
                    <span className="text-[10px] font-bold text-red-600">${Math.round(bill.amount)}</span>
                  </div>
                ) : (
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/30 mt-3" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};