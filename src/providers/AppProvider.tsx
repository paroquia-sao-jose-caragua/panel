'use client';

import AuthGuardProvider from '@/providers/AuthGuardProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HydrationProvider } from './HydrationProvider';

const queryClient = new QueryClient();

const AppProvider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <HydrationProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGuardProvider>{children}</AuthGuardProvider>
      </QueryClientProvider>
    </HydrationProvider>
  );
};

export default AppProvider;
