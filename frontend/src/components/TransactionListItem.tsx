// apps/web/src/features/transactions/components/TransactionListItem.tsx
import { CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const TransactionListItem = ({ transaction }: { transaction: any }) => {
  const isSubscription = !!transaction.subscriptionId;

  return (
    <div className="group flex items-center justify-between p-4 bg-card border rounded-xl hover:shadow-sm transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        {/* Dynamic Icon based on type/category */}
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
          isSubscription ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        }`}>
          {isSubscription ? <CreditCard className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">{transaction.description}</h4>
            {isSubscription && (
              <Badge variant="outline" className="text-[10px] h-4 px-1 uppercase tracking-tighter">
                Sub Payment
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {transaction.category} • {transaction.subscription?.name || 'Manual Entry'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="font-bold text-sm">
          -${Number(transaction.amount).toFixed(2)}
        </p>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
      </div>
    </div>
  );
};