'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import useAuthStore from '@/stores/useAuthStore';
import { refresh } from '@/api/users/refresh';
import { routeUtils } from '@/utils/routeUtils';
import { useNavigate } from '@/hooks/use-navigate';
import { FullLoading } from '@/components/ui/loading/full-loading';

const AuthGuardProvider = () => {
  const pathname = usePathname();
  const navigate = useNavigate();
  const { isLogged, email, token, setLogged } = useAuthStore();
  const [sessionChecked, setSessionChecked] = useState(false);

  const { mutate } = useMutation({
    mutationFn: (signal: AbortSignal) => refresh(signal),
    networkMode: 'always',
    retry: 3,
  });

  useEffect(() => {
    const controller = new AbortController();

    if (isLogged) {
      setSessionChecked(true);
      return () => controller.abort();
    }

    mutate(controller.signal, {
      onSuccess: ({ statusCode, token, user }) => {
        if (statusCode === 200) {
          setLogged({ token, user });
        }

        setSessionChecked(true);
      },
      onError: (error) => {
        console.info('Session refresh failed, user is not authenticated.');
        console.error(error);
        setSessionChecked(true);
      },
    });

    return () => {
      controller.abort();
    };
  }, [mutate, setLogged, isLogged]);

  useEffect(() => {
    if (!sessionChecked) return;

    const isAuthRoute = routeUtils.isAuthRoute(pathname);
    const isConfirmCodePage = pathname.includes('/confirm-code');

    if (isLogged && token && isAuthRoute) {
      navigate.replace('/');
      return;
    }

    if (
      (!isLogged && !isAuthRoute) ||
      (isConfirmCodePage && !email && !isAuthRoute)
    ) {
      navigate.replace('/login');
    }
  }, [sessionChecked, isLogged, email, pathname, navigate, token]);

  return sessionChecked ? null : <FullLoading />;
};

export default AuthGuardProvider;
