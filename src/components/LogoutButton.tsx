'use client';

import { logout } from '@/api/users/logout';
import { useNavigate } from '@/hooks/use-navigate';
import useTranslator from '@/hooks/use-translator';
import useAuthStore from '@/stores/useAuthStore';
import { showAlert } from '@/utils/showAlert';
import { useMutation } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useCallback } from 'react';

export const LogoutButton = () => {
  const { t } = useTranslator();
  const navigate = useNavigate();
  const { setLoggedOut } = useAuthStore();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: ({ statusCode }) => {
      if (statusCode === 200) {
        setLoggedOut();
        navigate.replace('/login');
      } else {
        showAlert(t('error-logging-out'));
      }
    },
    onError: () => {
      showAlert(t('error-logging-out'));
    },
  });

  const handleLogout = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <button
      type="button"
      className="ml-auto rounded-md p-2 hover:cursor-pointer hover:bg-brand-700/30 focus-visible:ring-2 focus-visible:ring-brand-400 outline-none transition-colors"
      onClick={handleLogout}
    >
      <LogOut className="h-5 w-5 text-brand-300" />
    </button>
  );
};
