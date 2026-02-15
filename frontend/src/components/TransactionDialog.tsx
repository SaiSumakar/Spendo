// apps/web/src/features/transactions/components/TransactionDialog.tsx

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Loader2 } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';

import {
    ExpenseType,
  type CreateTransactionDto,
  type TransactionFormValues,
} from '../types/transaction.types';

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateTransactionDto) => Promise<unknown>;
}

export const TransactionDialog = ({
  open,
  onOpenChange,
  onSave,
}: TransactionDialogProps) => {
  const { subscriptions } = useSubscriptions();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    defaultValues: {
      description: '',
      amount: '',
      type: ExpenseType.EXPENSE,
      category: 'General',
      notes: '',
      date: new Date(),
      subscriptionId: 'none',
    },
  });

  const selectedSubId = watch('subscriptionId');

  // ---------- Auto-fill from subscription ----------
  useEffect(() => {
    if (selectedSubId && selectedSubId !== 'none') {
      const sub = subscriptions.find((s) => s.id === selectedSubId);
      if (sub) {
        setValue('description', `${sub.name} Payment`);
        setValue('amount', String(sub.price));
        setValue('category', sub.category || 'General');
        setValue('type', ExpenseType.EXPENSE);
      }
    }
  }, [selectedSubId, subscriptions, setValue]);

  // ---------- Reset when dialog opens ----------
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  // ---------- Submit ----------
  const onSubmit = async (form: TransactionFormValues) => {
    const dto: CreateTransactionDto = {
      amount: Number(form.amount),
      type: form.type,
      description: form.description,
      category: form.category || undefined,
      notes: form.notes || undefined,
      date: form.date.toISOString(), // satisfies backend Date validator when transform enabled
      subscriptionId: form.subscriptionId === 'none' ? null : form.subscriptionId,
    };

    await onSave(dto);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Log Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">

          {/* Type */}
          {/* <div className="space-y-2">
            <Label>Type</Label>
            <Select
              defaultValue={ExpenseType.EXPENSE}
              onValueChange={(v) => setValue('type', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ExpenseType.EXPENSE}>Expense</SelectItem>
                <SelectItem value={ExpenseType.INCOME}>Income</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Subscription */}
          <div className="space-y-2">
            <Label>Link to Subscription (Optional)</Label>
            <Select
              onValueChange={(v) => setValue('subscriptionId', v)}
              defaultValue="none"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Standalone</SelectItem>
                {subscriptions.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name} (${Number(sub.price).toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              {...register('description', { required: true, maxLength: 200 })}
            />
            {errors.description && errorText('Required')}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                {...register('amount', { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                onChange={(e) =>
                  setValue('date', new Date(e.target.value))
                }
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Input {...register('category')} />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Input {...register('notes')} />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Separator = () => <div className="h-px w-full bg-border opacity-50" />;

const errorText = (msg: string) => (
  <span className="text-xs text-red-500">{msg}</span>
);
