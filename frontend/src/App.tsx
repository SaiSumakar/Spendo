// apps/web/src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import api from './lib/axios';
import './lib/interceptor';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import SettingsPage from './pages/SettingsPage';
import TransactionsPage from './pages/TransactionsPage';
import { DashboardLayout } from './components/DashboardLayout';

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setCheckingAuth = useAuthStore((state) => state.setCheckingAuth);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Create an AbortController with a 5-second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          // We try to fetch the profile.
          // The browser AUTOMATICALLY sends the HttpOnly cookie with this request.
          const { data } = await api.get('/users/profile', { signal: controller.signal });
          setUser(data); // Success: Session is alive
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        // Failure: Cookie missing, invalid, or request timed out
        // We don't do anything here, just finish loading.
        // The ProtectedRoute will handle the redirect.
        // interceptor handles 401
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, [setUser, setCheckingAuth]);

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;