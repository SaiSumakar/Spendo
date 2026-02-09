import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
})

let isHandling401 = false;

api.interceptors.response.use((res) => res,
    async (error) => {
        const status = error?.response?.status;

        if(status === 401 && !isHandling401) {
            isHandling401 = true;
            try {
                await api.post('/auth/logout')
            } catch (error) {
                // ignore
            }

            useAuthStore.getState().logout();
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }

            // reset guard after redirect tick
            setTimeout(() => {
                isHandling401 = false;
            }, 1000);
        }

        return Promise.reject(error);
    }
);

export default api;