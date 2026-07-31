import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/auth';
import Index from './pages/Index';
import Config from './pages/Config';
import NotFound from './pages/NotFound';
import { InstallBanner } from '@/components/InstallBanner';
import { AppLoadingSkeleton } from '@/components/AppLoadingSkeleton';
import { applyPrimaryColor, loadSettings } from '@/lib/settings';

const queryClient = new QueryClient();

const isMobileViewport = () => window.matchMedia('(max-width: 768px)').matches;

const AppRoutes = () => {
  const { loading } = useAuth();
  const [isMobile] = useState(isMobileViewport);

  useEffect(() => {
    applyPrimaryColor(loadSettings().primary);
  }, []);

  useEffect(() => {
    const splash = document.getElementById('app-splash');
    if (!splash) return;

    if (!isMobile) {
      splash.remove();
      return;
    }

    if (loading) return;

    splash.classList.add('is-hidden');
    const timeout = window.setTimeout(() => splash.remove(), 200);
    return () => window.clearTimeout(timeout);
  }, [loading, isMobile]);

  if (loading) {
    if (isMobile) return null;
    return <AppLoadingSkeleton />;
  }

  return (
    <>
      <InstallBanner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/config" element={<Config />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
