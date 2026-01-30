// apps/web/src/features/subscriptions/SubscriptionsPage.tsx
import { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { SubscriptionDialog } from '../components/SubscriptionDialog';
import { SubscriptionListItem } from '../components/SubscriptionListItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter } from 'lucide-react';
import { initialSubscriptions, type Subscription } from './data/mockSubscriptions';

export default function SubscriptionsPage() {
  // --- MOCK STATE MANAGEMENT ---
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
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

  // 3. Handle Save (Create or Update)
  const handleSave = (data: Partial<Subscription>) => {
    if (data.id) {
      // UPDATE EXISTING
      setSubscriptions(prev => prev.map(sub => 
        sub.id === data.id 
          ? { ...sub, ...data } as Subscription 
          : sub
      ));
    } else {
      // CREATE NEW
      const newSub: Subscription = {
        ...data,
        id: Math.random().toString(36).substr(2, 9), // Fake ID
        nextBillingDate: data.startDate!, // Just copy start date for now
      } as Subscription;
      
      setSubscriptions(prev => [...prev, newSub]);
    }
  };

  // 4. Handle Delete
  const handleDelete = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  // Filter Logic
  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sub.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
            <p className="text-muted-foreground">Manage your recurring payments and trials.</p>
          </div>
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
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-20 border rounded-xl border-dashed">
              <p className="text-muted-foreground">No subscriptions found.</p>
              <Button variant="link" onClick={handleAddNew}>Add your first one</Button>
            </div>
          ) : (
            filteredSubscriptions.map((sub) => (
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
    </DashboardLayout>
  );
}