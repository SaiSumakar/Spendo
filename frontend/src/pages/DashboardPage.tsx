// apps/web/src/features/dashboard/DashboardPage.tsx
import { 
  Activity, 
  CreditCard, 
  AlertTriangle, 
  Wallet 
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  KpiCard, 
  VelocityChart, 
  CategoryDonut, 
  BillingTimeline 
} from '../components/DashboardWidgets';
import { kpiStats, spendingVelocityData, categoryData } from './data/mockData';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      
      {/* 1. THE PULSE (Top Row KPIs) */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Monthly Run Rate" 
          value={`$${kpiStats.runRate}`} 
          subtext="+4% vs last month" 
          icon={Activity} 
        />
        <KpiCard 
          title="Safe to Spend" 
          value={`$${kpiStats.safeToSpend}`} 
          subtext="After fixed costs" 
          icon={Wallet} 
        />
        <KpiCard 
          title="Active Subs" 
          value={kpiStats.activeSubs} 
          subtext="2 not used in 30d" 
          icon={CreditCard} 
        />
        <KpiCard 
          title="Trial Watch" 
          value={kpiStats.trialWatch} 
          subtext="Expiring in < 3 days" 
          icon={AlertTriangle} 
          alert={true} 
        />
      </section>

      {/* 2. THE TRENDS (Main Visuals) */}
      <section className="grid gap-4 md:grid-cols-6">
        {/* Left: Velocity Chart (Takes up 4/6 columns) */}
        <VelocityChart data={spendingVelocityData} />
        
        {/* Right: Distribution (Takes up 2/6 columns) */}
        <CategoryDonut data={categoryData} />
      </section>

      {/* 3. THE RADAR (Timeline & Upcoming) */}
      <section className="grid gap-4">
        <BillingTimeline />
      </section>

    </DashboardLayout>
  );
}