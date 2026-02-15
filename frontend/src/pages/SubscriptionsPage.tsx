// apps/web/src/features/subscriptions/SubscriptionsPage.tsx
import { useState } from 'react';
import { SubscriptionDialog } from '../components/SubscriptionDialog';
import { SubscriptionListItem } from '../components/SubscriptionListItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import type { Subscription, CreateSubscriptionDto, UpdateSubscriptionDto } from '../types/subscription.types';

export default function SubscriptionsPage() {
  // --- MOCK STATE MANAGEMENT ---
  const { 
    subscriptions, 
    isLoading, 
    createSubscription, 
    updateSubscription, 
    deleteSubscription, 
  } = useSubscriptions();

  // const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  // --- ACTIONS ---

  // 1. Prepare "Add"
  const handleAddNew = () => {
    setSelectedSubscription(null);
    setIsDialogOpen(true);
  };

  // 2. Prepare "Edit"
  const handleEdit = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setIsDialogOpen(true);
  };

  // The 'data' parameter here is inferred from the child component, 
  // but we can type guard it to be safe.
  const handleSave = async (data: CreateSubscriptionDto | UpdateSubscriptionDto) => {
    try {
      if (selectedSubscription) {
        // Edit Mode
        await updateSubscription({ 
          id: selectedSubscription.id, 
          data: data as UpdateSubscriptionDto 
        });
      } else {
        // Add Mode
        await createSubscription(data as CreateSubscriptionDto);
      }
      setIsDialogOpen(false); // Close only on success
    } catch (error) {
      console.error("Failed to save subscription", error);
      // Optional: Add toast notification here
    }
  };

  // 4. Handle Delete
  const handleDelete = async (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this subscription?")) {
        await deleteSubscription(id);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete subscription", error);
    }
  };

  // Filter Logic with Type Safety
  const filteredSubscriptions = subscriptions?.filter((sub) => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sub.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-muted-foreground">Manage your recurring payments and trials.</p>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="w-4 h-4" /> Add Subscription
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search subscriptions..." 
            className="pl-9 bg-background" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p>Loading your finances...</p>
        ) : (
          filteredSubscriptions.map((sub: Subscription) => (
            <SubscriptionListItem 
              key={sub.id} 
              subscription={sub} 
              onClick={() => handleEdit(sub)} 
            />
          ))
        )}
      </div>

      <SubscriptionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        subscription={selectedSubscription}
        onSave={handleSave}   // <--- Passed Handler
        onDelete={handleDelete} // <--- Passed Handler
      />
      
    </div>
  );
}