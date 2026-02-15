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
import { useSubscriptions } from '@/hooks/useSubscriptions';

import {
    ExpenseType,
  type CreateTransactionDto,
  type Transaction,
  type TransactionFormValues,
} from '../types/transaction.types';
import { Trash2 } from 'lucide-react';

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateTransactionDto) => Promise<unknown>;
  transaction?: Transaction | null;
  onDelete: (id: string) => void; // New Prop
}

export const TransactionDialog = ({
  open,
  onOpenChange,
  onSave,
  transaction,
  onDelete
}: TransactionDialogProps) => {
  const isEditMode = !!transaction;
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

  const toDateInputValue = (d: Date | string) =>
    new Date(d).toISOString().slice(0, 10);


  // ---------- Auto-fill from subscription ----------
  useEffect(() => {
    if (isEditMode) return;

    if (selectedSubId && selectedSubId !== 'none') {
      const sub = subscriptions.find((s) => s.id === selectedSubId);
      if (sub) {
        setValue('description', `${sub.name} Payment`);
        setValue('amount', String(sub.price));
        setValue('category', sub.category || 'General');
        setValue('type', ExpenseType.EXPENSE);
      }
    }
  }, [selectedSubId, subscriptions, setValue, isEditMode]);


  // ---------- Reset when dialog opens ----------
  useEffect(() => {
    if (!open) return;

    if (transaction) {
      reset({
        description: transaction.description ?? '',
        amount: String(transaction.amount),
        type: transaction.type,
        category: transaction.category ?? 'General',
        notes: transaction.notes ?? '',
        date: new Date(transaction.date),
        subscriptionId: transaction.subscriptionId ?? 'none',
      });
    } else {
      reset({
        description: '',
        amount: '',
        type: ExpenseType.EXPENSE,
        category: 'General',
        notes: '',
        date: new Date(),
        subscriptionId: 'none',
      });
    }
  }, [open, transaction, reset]);


  // ---------- Submit ----------
  const onSubmit = async (form: TransactionFormValues) => {
    const dto: CreateTransactionDto = {
      amount: Number(form.amount),
      type: form.type,
      description: form.description,
      category: form.category || undefined,
      notes: form.notes || undefined,
      date: form.date.toISOString(), // Must be ISO string for backend
      subscriptionId: form.subscriptionId === 'none' ? null : form.subscriptionId,
    };

    await onSave(dto);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (transaction?.id) {
      onDelete(transaction.id);
      // onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Transaction' : 'Log Transaction'}</DialogTitle>
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
              value={watch('subscriptionId')}
              onValueChange={(v) => setValue('subscriptionId', v)}
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
                value={toDateInputValue(watch('date'))}
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
            <div className="w-full flex items-center justify-between">
              {isEditMode && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Add')}
              </Button>
            </div>
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
