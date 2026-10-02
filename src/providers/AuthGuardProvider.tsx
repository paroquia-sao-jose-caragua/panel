'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import useAuthStore from '@/stores/useAuthStore';
import { refresh } from '@/api/users/refresh';
import { routeUtils } from '@/utils/routeUtils';
import { useNavigate } from '@/hooks/use-navigate';
import { FullLoading } from '@/components/ui/loading/full-loading';

interface AuthGuardProviderProps {
  children: React.ReactNode;
}

const AuthGuardProvider = ({ children }: AuthGuardProviderProps) => {
  const pathname = usePathname();
  const navigate = useNavigate();
  const { isLogged, email, token, setLogged, user } = useAuthStore();
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

    const isPublicRoute = routeUtils.isPublicRoute(pathname);
    const isAuthRoute = routeUtils.isAuthRoute(pathname);
    const isConfirmCodePage = pathname.includes('/confirm-code');

    if (isLogged && token) {
      if (user?.role === 'pastoral_agent') {
        const isAllowedForAgent =
          pathname.startsWith('/ajuda') ||
          pathname.startsWith('/central-de-ajuda') ||
          pathname.startsWith('/agenda-pastoral') ||
          pathname.startsWith('/atendimentos');

        if (!isAllowedForAgent) {
          navigate.replace('/agenda-pastoral');
          return;
        }
      } else if (isAuthRoute) {
        navigate.replace('/dados-institucionais');
        return;
      }
    }

    if (
      (!isLogged && !isPublicRoute) ||
      (isConfirmCodePage && !email && !isPublicRoute)
    ) {
      navigate.replace('/entrar');
    }
  }, [sessionChecked, isLogged, email, pathname, navigate, token, user?.role]);

  // Se a sessão ainda não foi verificada, mostrar loading
  if (!sessionChecked) {
    return <FullLoading />;
  }

  // Se o usuário não está autenticado e não é uma rota pública/autenticação/confirmação,
  // ainda mostrar loading enquanto o redirecionamento acontece
  const isPublicRoute = routeUtils.isPublicRoute(pathname);
  const isConfirmCodePage = pathname.includes('/confirm-code');

  if (
    (!isLogged && !isPublicRoute) ||
    (isConfirmCodePage && !email && !isPublicRoute)
  ) {
    return <FullLoading />;
  }

  return children;
};

export default AuthGuardProvider;
