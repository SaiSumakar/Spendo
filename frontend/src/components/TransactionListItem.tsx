import { format } from 'date-fns';
import { CreditCard, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/types/transaction.types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useSettings } from '@/hooks/useSettings';

interface TransactionItemProps {
  transaction: Transaction;
  onClick: () => void;
}

export const TransactionListItem = ({ transaction, onClick }: TransactionItemProps) => {
  const isSubscription = !!transaction.subscriptionId;
  const isIncome = transaction.type === 'income';

  console.log("transactions ", transaction);
  const userCurrency = useSettings().settings?.currency;

  return (
    <div
      onClick={onClick}
      className="group grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-4 items-center p-5 bg-card border rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center
          ${isSubscription ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
        `}>
          {isSubscription
            ? <CreditCard className="w-6 h-6" />
            : <ShoppingBag className="w-6 h-6" />}
        </div>

        <div className="min-w-0">
          <h4 className="font-bold text-lg leading-none mb-1">
            {transaction.description}
          </h4>
          
          {transaction.notes && (
            <p className="text-[14px] text-muted-foreground truncate max-w-32">
              {transaction.notes}
            </p>
          )}

        </div>
      </div>

      {/* MIDDLE */}
      <div className="flex flex-col gap-2 sm:items-start">
        <div className="flex flex-wrap gap-2">
          {transaction.category && (
            <Badge variant="secondary" className="text-[12px] h-5 p-2">
              {transaction.category}
            </Badge>
          )}

          {isSubscription && (
            <Badge variant="outline" className="text-[12px] h-5 p-2">
              Sub Payment
            </Badge>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-right">
        <p className="text-xs text-muted-foreground">
          {format(new Date(transaction.date), 'MMM dd')}
        </p>

        <p className={`font-bold text-sm ${
          isIncome ? 'text-green-600' : 'text-red-600'
        }`}>
          {isIncome ? '+ ' : '- '}{formatCurrency(Number(transaction.amount), userCurrency)}
        </p>
      </div>

    </div>
  );
};
