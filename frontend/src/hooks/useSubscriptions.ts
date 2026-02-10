import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Subscription, CreateSubscriptionDto, UpdateSubscriptionDto } from '../types/subscription.types';

export const useSubscriptions = () => {
  const queryClient = useQueryClient();

  // 1. Fetching
  const subscriptionsQuery = useQuery<Subscription[]>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data } = await api.get<Subscription[]>('/subscriptions');
      return data;
    },
  });

  // 2. Create Mutation
  const createMutation = useMutation({
    mutationFn: (newSub: CreateSubscriptionDto) => api.post<Subscription>('/subscriptions', newSub),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // 3. Update Mutation 
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubscriptionDto }) => 
      api.patch<Subscription>(`/subscriptions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // 4. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/subscriptions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return {
    subscriptions: subscriptionsQuery.data ?? [],
    isLoading: subscriptionsQuery.isLoading,
    isError: subscriptionsQuery.isError,
    createSubscription: createMutation.mutateAsync,
    updateSubscription: updateMutation.mutateAsync,
    deleteSubscription: deleteMutation.mutateAsync,
  };
};