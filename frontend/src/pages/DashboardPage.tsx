// apps/web/src/features/dashboard/DashboardPage.tsx
import { 
  Activity, 
  CreditCard, 
  AlertTriangle, 
  Wallet, 
  Loader2
} from 'lucide-react';
import { 
  KpiCard, 
  VelocityChart, 
  CategoryDonut, 
  BillingTimeline 
} from '../components/DashboardWidgets';
import { useDashboard } from '@/hooks/useDashboard';
import { useSettings } from '@/hooks/useSettings';
import { BudgetProgressCard } from '@/components/BudgetProgressCard';
import { formatCurrency } from '@/utils/formatCurrency';

export default function DashboardPage() {

  const { data, isLoading, isError } = useDashboard();
  const userCurrency = useSettings()?.settings?.currency;

  console.log("financial data", data, isError, isLoading);

  if (isLoading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  if (isError) return <div>Error loading financial data.</div>;

  return (
    <div className='w-full space-y-4'>
      
      {/* 1. THE PULSE (Top Row KPIs) */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Monthly Run Rate" 
          value={`${formatCurrency(data.kpiStats.runRate, userCurrency)}`} 
          icon={Activity} 
        />
        <KpiCard 
          title="Safe to Spend" 
          value={`${formatCurrency(data.kpiStats.safeToSpend, userCurrency)}`} 
          icon={Wallet} 
        />
        <KpiCard 
          title="Active Subs" 
          value={data.kpiStats.activeSubs} 
          icon={CreditCard} 
        />
        <KpiCard 
          title="Trial Watch" 
          value={data.kpiStats.trialWatch} 
          icon={AlertTriangle} 
          alert={data.kpiStats.trialWatch > 0} 
        />
      </section>

      {/* Budget Progress Bar Card */}
      <section>
        <BudgetProgressCard
          spent={data.kpiStats.runRate}
          budget={data.kpiStats.monthlyLimit}
          currency={userCurrency}
          formatCurrency={formatCurrency}
        />
      </section>


      {/* 2. THE TRENDS (Main Visuals) */}
      <section className="grid gap-4 md:grid-cols-6">
        {/* Left: Velocity Chart (Takes up 4/6 columns) */}
        <VelocityChart data={data.velocityData} />
        
        {/* Right: Distribution (Takes up 2/6 columns) */}
        <CategoryDonut data={data.categoryData} />
      </section>

      {/* 3. THE RADAR (Timeline & Upcoming) */}
      <section className="grid gap-4">
        <BillingTimeline 
          bills={data.upcomingBills}
          currency={data.userCurrency || userCurrency}
          formatCurrency={formatCurrency}
        />
      </section>

    </div>
  );
}