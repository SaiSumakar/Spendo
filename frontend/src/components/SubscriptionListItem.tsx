// apps/web/src/features/subscriptions/components/SubscriptionListItem.tsx
import { format } from 'date-fns';
import { CalendarClock, CreditCard, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Subscription } from '../pages/data/mockSubscriptions';

interface SubscriptionItemProps {
  subscription: Subscription;
  onClick: () => void;
}

export const SubscriptionListItem = ({ subscription, onClick }: SubscriptionItemProps) => {
  const isTrial = subscription.isTrial;
  const currencySymbol = subscription.currency === 'USD' ? '$' : subscription.currency === 'INR' ? '₹' : '€';

  // Fallback for nextBillingDate if not calculated yet
  const displayDate = subscription.nextBillingDate || subscription.startDate;

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-card border rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer space-y-4 sm:space-y-0"
    >
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isTrial ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-none mb-1">{subscription.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{subscription.category || 'General'} • {subscription.frequency.toLowerCase()}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
           <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
             <CalendarClock className="w-3 h-3" /> Next Bill
           </p>
           <p className="font-medium">
             {format(new Date(displayDate), 'MMM dd, yyyy')}
           </p>
        </div>
        {isTrial && <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Free Trial</Badge>}
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
         <div className="text-right">
           <p className="font-bold text-xl">{currencySymbol}{subscription.price.toFixed(2)}</p>
         </div>
         <Button variant="ghost" size="icon" className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
           <MoreVertical className="w-5 h-5" />
         </Button>
      </div>
    </div>
  );
};