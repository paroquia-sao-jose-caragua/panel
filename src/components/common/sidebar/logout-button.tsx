'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { logout } from '@/api/users/logout';
import { useNavigate } from '@/hooks/use-navigate';
import useTranslator from '@/hooks/use-translator';
import useAuthStore from '@/stores/useAuthStore';
import { showAlert } from '@/utils/showAlert';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/dialog/confirm-dialog';

export const LogoutButton = () => {
  const { t } = useTranslator();
  const navigate = useNavigate();
  const { setLoggedOut } = useAuthStore();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: ({ statusCode }) => {
      if (statusCode === 200) {
        setLoggedOut();
        navigate.replace('/entrar');
      } else {
        showAlert(t('error-logging-out'));
      }
    },
    onError: () => {
      showAlert(t('error-logging-out'));
    },
  });

  const handleConfirmLogout = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-auto text-brand-300 hover:text-white hover:bg-brand-700/40 focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer"
        onClick={() => setOpen(true)}
        title="Sair"
      >
        <LogOut className="h-5 w-5" />
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Encerrar Sessão"
        description="Tem certeza que deseja sair do painel administrativo da Paróquia São José?"
        confirmText="Sim, sair"
        cancelText="Cancelar"
        variant="destructive"
        isPending={isPending}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
