import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore'; // To update global user state if needed

export const useSettings = () => {
    const queryClient = useQueryClient()
    const setUser = useAuthStore((state) => state.setUser)

    const settingsQuery = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const { data } = await api.get('/users/profile')
            return data;
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => api.patch('/users/profile', data),
        onSuccess: (response) => {
            queryClient.setQueryData(['settings'], response.data);
            setUser(response.data);
        }
    });

    const exportData = async () => {
        const response = await api.get('/users/export', { responseType: 'blob' });
        // Create a hidden link to trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'finances.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // 4. Delete Account
    const deleteAccount = async () => {
        await api.delete('/users/profile');
        window.location.href = '/auth/login'; // Hard redirect
    };

    return {
        settings: settingsQuery.data,
        isLoading: settingsQuery.isLoading,
        updateSettings: updateMutation.mutateAsync,
        isSaving: updateMutation.isPending,
        exportData,
        deleteAccount
    }
}