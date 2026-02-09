import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const location = useLocation();

  // 1. If we are still talking to the backend, show a spinner
  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. If check finished and we are NOT authenticated, kick to login
  if (!isAuthenticated) {
    // We pass "state" so we can redirect them back after they login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authorized!
  return <Outlet />;
};