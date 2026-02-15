import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Transaction, CreateTransactionDto } from '@/types/transaction.types';

export const useTransactions = () => {
  const queryClient = useQueryClient();

  // --- QUERY: Fetch all transactions ---
  const transactionsQuery = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await api.get<Transaction[]>('/transactions');
      return data;
    },
  });

  // --- MUTATION: Create a transaction ---
  const createMutation = useMutation({
    mutationFn: (newTx: CreateTransactionDto) => api.post('/transactions', newTx),
    onSuccess: () => {
      // CRITICAL: Refresh the ledger AND the dashboard stats
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // --- MUTATION: Delete a transaction ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return {
    // Data & Loading States
    transactions: transactionsQuery.data ?? [],
    isLoading: transactionsQuery.isLoading,
    isError: transactionsQuery.isError,
    
    // Actions
    addTransaction: createMutation.mutateAsync,
    removeTransaction: deleteMutation.mutateAsync,
    
    // Status indicators for UI (e.g., showing a spinner on the Save button)
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};