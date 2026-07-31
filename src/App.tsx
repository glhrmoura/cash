import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/auth';
import Index from './pages/Index';
import Config from './pages/Config';
import NotFound from './pages/NotFound';
import { InstallBanner } from '@/components/InstallBanner';
import ThreeDotsLoader from '@/components/ThreeDotsLoader';
import { applyPrimaryColor, loadSettings } from '@/lib/settings';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { loading } = useAuth();

  useEffect(() => {
    applyPrimaryColor(loadSettings().primary);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ThreeDotsLoader size="lg" />
      </div>
    );
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
