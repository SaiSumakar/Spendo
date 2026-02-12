import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query"


export const useDashboard = () => {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/summary');
            return data;
        },
        staleTime: 0,
        refetchOnMount: true,
    })

}