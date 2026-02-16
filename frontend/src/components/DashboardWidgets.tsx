// apps/web/src/features/dashboard/components/DashboardWidgets.tsx
import { 
  Bar, Line, ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { format, isSameDay, eachDayOfInterval, addDays } from 'date-fns';

type Bill = {
  id: string;
  name: string;
  amount: number;
  date: string;
};

type BillingTimelineProps = {
  bills: Bill[];
  currency: string;
  formatCurrency: (
    amount: number,
    currency: string,
    locale?: string
  ) => string;
};

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
  <Card className="col-span-full lg:col-span-4 h-87.5">
    <CardHeader>
      <CardTitle>Your Spending Over the Last Week</CardTitle>
    </CardHeader>
    <CardContent className="h-70">
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
  <Card className="col-span-full lg:col-span-2 h-87.5">
    <CardHeader>
      <CardTitle>Subscription Breakdown</CardTitle>
    </CardHeader>
    <CardContent className="h-70 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="47%"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            shape={(props: any) => {
              const { cx, cy, startAngle, endAngle, innerRadius, outerRadius, payload } = props;
              const RADIAN = Math.PI / 180;

              const x1 = cx + innerRadius * Math.cos(-startAngle * RADIAN);
              const y1 = cy + innerRadius * Math.sin(-startAngle * RADIAN);
              const x2 = cx + outerRadius * Math.cos(-startAngle * RADIAN);
              const y2 = cy + outerRadius * Math.sin(-startAngle * RADIAN);
              const x3 = cx + outerRadius * Math.cos(-endAngle * RADIAN);
              const y3 = cy + outerRadius * Math.sin(-endAngle * RADIAN);
              const x4 = cx + innerRadius * Math.cos(-endAngle * RADIAN);
              const y4 = cy + innerRadius * Math.sin(-endAngle * RADIAN);

              const largeArc = endAngle - startAngle > 180 ? 1 : 0;

              const path = `
                M ${x1} ${y1}
                L ${x2} ${y2}
                A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${x3} ${y3}
                L ${x4} ${y4}
                A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${x1} ${y1}
                Z
              `;

              return (
                <path
                  d={path}
                  fill={payload.color}
                  stroke="none"
                />
              );
            }}
          />
          <Tooltip
            formatter={(value: number | undefined) =>
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }).format(value ?? 0)
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// --- 4. Billing Timeline Strip ---
export const BillingTimeline = ({
  bills,
  currency,
  formatCurrency
}: BillingTimelineProps) => {

  const today = new Date();

  const days = eachDayOfInterval({
    start: today,
    end: addDays(today, 20),
  });

  return (
    <Card className="col-span-full w-full max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle>Your Upcoming Bills (Next 3 Weeks)</CardTitle>
      </CardHeader>

      <CardContent className="w-full max-w-full overflow-hidden">
        
        {/* scroll container */}
        <div className="w-full overflow-x-auto scrollbar-thin pb-3">
          
          {/* content strip */}
          <div className="flex gap-3 w-max pr-2">
            {days.map((date, i) => {
              const bill = bills.find(b =>
                isSameDay(new Date(b.date), date)
              );

              const isToday = i === 0;

              return (
                <div
                  key={date.toISOString()}
                  className={`
                    flex flex-col items-center
                    w-17.5 shrink-0
                    p-2 rounded-xl border
                    ${isToday ? 'bg-primary/5 border-primary' : 'bg-card'}
                  `}
                >
                  <span className="text-xs text-muted-foreground mb-1">
                    {format(date, 'EEE')}
                  </span>

                  <span className={`text-sm font-bold mb-2 ${isToday ? 'text-primary' : ''}`}>
                    {format(date, 'd')}
                  </span>

                  {bill ? (
                    <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center animate-in zoom-in">
                      <span className="text-[10px] font-bold text-red-600 text-center leading-none">
                        {formatCurrency(bill.amount, currency)}
                      </span>
                    </div>
                  ) : (
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30 mt-3" />
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

