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
import { formatCurrency } from '@/utils/formatCurrency';

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateTransactionDto) => Promise<unknown>;
  transaction?: Transaction | null;
  onDelete: (id: string) => void;
  userCurrency: string;
}

export const TransactionDialog = ({
  open,
  onOpenChange,
  onSave,
  transaction,
  onDelete,
  userCurrency
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
  const selectedType = watch('type');
  const subChecked = selectedSubId !== 'none'; 
  // controls checkbox + select visibility

  const isLinkedToSub =
  selectedSubId !== 'none' &&
  selectedSubId !== '__select__';
  // controls locking + autofill

  const toDateInputValue = (d: Date | string) =>
    new Date(d).toISOString().slice(0, 10);

  const todayStr = new Date().toISOString().slice(0, 10);

  // ---------- Force EXPENSE if subscription ----------
  useEffect(() => {
    if (isLinkedToSub && selectedType !== ExpenseType.EXPENSE) {
      setValue('type', ExpenseType.EXPENSE);
    }
  }, [isLinkedToSub, selectedType, setValue]);

  // ---------- Auto-fill from subscription ----------
  useEffect(() => {
      if (
    !selectedSubId ||
    selectedSubId === 'none' ||
    selectedSubId === '__pending__'
    ) return;

    const sub = subscriptions.find((s) => s.id === selectedSubId);
    if (!sub) return;

    // Always enforce system-level fields
    setValue('type', ExpenseType.EXPENSE);
    setValue('category', sub.category || 'General');

    if (!isEditMode) {
      // CREATE MODE — safe to auto-fill everything
      setValue('description', `${sub.name} Payment`);
      setValue('amount', String(sub.price));
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
      date: form.date.toISOString(),
      subscriptionId:
        form.subscriptionId === 'none' ? null : form.subscriptionId,
    };

    await onSave(dto);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (transaction?.id) onDelete(transaction.id);
  };

  const handleClear = () => {
    reset({
      description: '',
      amount: '',
      type: ExpenseType.EXPENSE,
      category: 'General',
      notes: '',
      date: new Date(),
      subscriptionId: 'none',
    });
  };


  // const toggleSubscription = (checked: boolean) => {
  //   setValue('subscriptionId', checked ? subscriptions[0]?.id ?? 'none' : 'none');
  // };

  const toggleSubscription = (checked: boolean) => {
    if (!checked) {
      setValue('subscriptionId', 'none');
    } else {
      // show select but choose nothing yet
      setValue('subscriptionId', '__select__');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Transaction' : 'Log Transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">

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
                max={todayStr}
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
            <Input
              {...register('category')}
              disabled={isLinkedToSub}
              className={isLinkedToSub ? 'bg-muted cursor-not-allowed opacity-80' : ''}
            />
            {isLinkedToSub && (
              <p className="text-xs text-muted-foreground">
                Category comes from subscription
              </p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type</Label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={selectedType === ExpenseType.EXPENSE}
                  disabled={subChecked}
                  onChange={() => setValue('type', ExpenseType.EXPENSE)}
                  className="h-4 w-4 accent-black disabled:accent-gray-400"
                />
                <span className="text-sm">Expense</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={selectedType === ExpenseType.INCOME}
                  disabled={isLinkedToSub}
                  onChange={() => {
                    setValue('type', ExpenseType.INCOME);
                    setValue('subscriptionId', 'none'); // clear immediately
                  }}
                  className="h-4 w-4 accent-black disabled:accent-gray-400"
                />
                <span className="text-sm">Income</span>
              </label>
            </div>

            {subChecked && (
              <p className="text-xs text-muted-foreground">
                Subscription payments are always expenses
              </p>
            )}
          </div>

          {/* Subscription Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={subChecked}
              onChange={(e) => toggleSubscription(e.target.checked)}
              className="h-4 w-4 accent-black"
              disabled={selectedType === ExpenseType.INCOME}
            />
            <Label>This payment is for a subscription</Label>
          </div>

          {/* Subscription Select */}
          {subChecked && (
            <div className="space-y-2">
              <Select
                value={
                  selectedSubId === '__pending__'
                    ? undefined
                    : selectedSubId
                }
                onValueChange={(v) => setValue('subscriptionId', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription" />
                </SelectTrigger>
                
                <SelectContent>
                  <SelectItem value="__select__" disabled>
                    Select subscription
                  </SelectItem>
                  {subscriptions.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name} ({formatCurrency(Number(sub.price), userCurrency)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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

              {!isEditMode && (
                <Button type="button" variant='outline' onClick={handleClear}>
                  Clear
                </Button>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : `Add`}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const errorText = (msg: string) => (
  <span className="text-xs text-red-500">{msg}</span>
);
