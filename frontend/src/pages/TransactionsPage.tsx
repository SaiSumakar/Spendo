// apps/web/src/features/transactions/TransactionsPage.tsx
import { useState } from 'react';
import { TransactionListItem } from '../components/TransactionListItem';
import { TransactionDialog } from '../components/TransactionDialog';
import { useTransactions } from '../hooks/useTransactions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter, Download } from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

export default function TransactionsPage() {
  const { transactions, isLoading, addTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Grouping Logic: Group transactions by date
  const groupedTransactions = transactions.reduce((groups: any, transaction: any) => {
    const date = transaction.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(transaction);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM dd, yyyy');
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Stats Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-muted-foreground">Detailed history of all your payments.</p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="flex-1 sm:flex-none gap-2">
            <Plus className="w-4 h-4" /> Add Transaction
          </Button>
        </div>
      </div>

      {/* Quick Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Filter by description or category..." 
            className="pl-9 bg-background" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* The Ledger */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 w-full bg-muted animate-pulse rounded-xl" />)}
          </div>
        ) : sortedDates.length === 0 ? (
          <Card className="border-dashed py-20 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">No transactions found for this period.</p>
              <Button onClick={() => setIsDialogOpen(true)} variant="secondary">Log your first expense</Button>
            </CardContent>
          </Card>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground sticky top-0 bg-background/95 backdrop-blur py-2 z-10 px-1">
                {getDateLabel(date)}
              </h3>
              <div className="space-y-2">
                {groupedTransactions[date].map((tx: any) => (
                  <TransactionListItem key={tx.id} transaction={tx} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <TransactionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSave={addTransaction} 
      />
    </div>
  );
}