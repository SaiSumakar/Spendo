import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BudgetProgressCardProps {
  spent: number;
  budget: number;
  currency?: string;
  formatCurrency: (n: number, c?: string) => string;
}

export const BudgetProgressCard = ({
  spent,
  budget,
  currency,
  formatCurrency
}: BudgetProgressCardProps) => {

  const safeBudget = budget || 1;
  const percentage = Math.min((spent / safeBudget) * 100, 100);
  const remaining = budget - spent;
  const over = remaining < 0;

  const getBarColor = () => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-primary";
  };

  return (
    <Card className={`relative overflow-hidden ${over ? 'border-destructive/40' : ''}`}>
      
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Budget Usage
        </CardTitle>

        <span className={`text-sm font-semibold ${over ? 'text-destructive' : 'text-primary'}`}>
          {Math.round(percentage)}%
        </span>
      </CardHeader>

      <CardContent className="space-y-3">
        
        {/* Progress Track */}
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`h-full ${getBarColor()}`}
          />
        </div>

        {/* KPI style subtext */}
        <div className="flex justify-between text-xs text-muted-foreground">
          {/* Status line */}
          <p className={`text-xs font-medium ${over ? 'text-destructive' : 'text-muted-foreground'}`}>
            {over
              ? `Over budget by ${formatCurrency(Math.abs(remaining), currency)}`
              : `${formatCurrency(remaining, currency)} left • On track`}
          </p>

          <span>
            Limit: {formatCurrency(budget, currency)}
          </span>
        </div>

      </CardContent>
    </Card>
  );
};
