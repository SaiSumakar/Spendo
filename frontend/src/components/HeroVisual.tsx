// apps/web/src/features/landing/components/HeroVisual.tsx
import { CreditCard, TrendingUp, Activity } from 'lucide-react';

export const HeroVisual = () => {
  return (
    <div className="relative mx-auto w-full max-w-125 lg:max-w-none">
      {/* Abstract Background Blobs */}
      <div className="absolute -top-12 -left-12 w-72 h-72 bg-primary/30 rounded-full blur-[80px] opacity-50 animate-pulse" />
      <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-blue-500/30 rounded-full blur-[80px] opacity-50" />

      {/* Main Glassmorphism Card (Mock Dashboard) */}
      <div className="relative bg-card/50 border border-border backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden p-6 rotate-[-5deg] hover:rotate-0 transition-all duration-500 ease-out">
        
        {/* Mock Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <div className="h-2 w-24 bg-muted rounded"></div>
            <div className="h-4 w-32 bg-foreground/80 rounded"></div>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Mock Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-background rounded-xl border shadow-sm">
            <CreditCard className="w-5 h-5 text-purple-500 mb-2" />
            <div className="text-2xl font-bold">$1,240</div>
            <div className="text-xs text-muted-foreground">Monthly Burn</div>
          </div>
          <div className="p-4 bg-background rounded-xl border shadow-sm">
            <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">Active Subs</div>
          </div>
        </div>

        {/* Mock List */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                <div className="space-y-1">
                  <div className="h-2 w-16 bg-muted-foreground/20 rounded" />
                  <div className="h-2 w-24 bg-muted-foreground/30 rounded" />
                </div>
              </div>
              <div className="h-2 w-12 bg-muted-foreground/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};