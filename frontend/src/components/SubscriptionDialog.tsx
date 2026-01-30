// apps/web/src/features/subscriptions/components/SubscriptionDialog.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Subscription } from '../pages/data/mockSubscriptions'; // Import the interface

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: Subscription | null;
  onSave: (data: Partial<Subscription>) => void; // New Prop
  onDelete: (id: string) => void; // New Prop
}

export const SubscriptionDialog = ({ 
  open, 
  onOpenChange, 
  subscription,
  onSave,
  onDelete
}: SubscriptionDialogProps) => {
  const isEditMode = !!subscription;
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (subscription) {
        reset({
          name: subscription.name,
          price: subscription.price,
          currency: subscription.currency,
          frequency: subscription.frequency,
          category: subscription.category,
          startDate: subscription.startDate, 
          isTrial: subscription.isTrial,
        });
      } else {
        reset({ currency: 'USD', frequency: 'MONTHLY', isTrial: false });
      }
    }
  }, [open, subscription, reset]);

  const onSubmit = (data: any) => {
    // Pass data back to parent
    onSave({
      ...data,
      price: Number(data.price), // Ensure number type
      id: subscription?.id // Pass ID if editing
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (subscription?.id) {
      onDelete(subscription.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Subscription' : 'Add New Subscription'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Name & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input id="name" placeholder="e.g. Netflix" {...register('name', { required: true })} />
              {errors.name && <span className="text-xs text-red-500">Required</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g. Entertainment" {...register('category')} />
            </div>
          </div>

          {/* Price & Cycle */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Amount</Label>
              <div className="flex gap-2">
                <Input type="number" step="0.01" placeholder="0.00" {...register('price', { required: true })} />
                <Select onValueChange={(v) => setValue('currency', v)} defaultValue={subscription?.currency || 'USD'}>
                   <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="USD">USD</SelectItem>
                     <SelectItem value="EUR">EUR</SelectItem>
                     <SelectItem value="INR">INR</SelectItem>
                   </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select onValueChange={(v) => setValue('frequency', v)} defaultValue={subscription?.frequency || 'MONTHLY'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Trial */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="startDate">Start / Due Date</Label>
              <Input type="date" id="startDate" {...register('startDate', { required: true })} />
             </div>
             <div className="flex items-end pb-3">
               <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isTrial" 
                    onCheckedChange={(c) => setValue('isTrial', c)} 
                    defaultChecked={subscription?.isTrial}
                  />
                  <Label htmlFor="isTrial">This is a Free Trial</Label>
               </div>
             </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between w-full">
            {isEditMode ? (
               <Button type="button" variant="destructive" onClick={handleDelete}>
                 <Trash2 className="w-4 h-4 mr-2" /> Delete
               </Button>
            ) : <div />} 
            
            <Button type="submit">
              {isEditMode ? 'Update Changes' : 'Add Subscription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};