'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserRole } from '@/api/users/update-user-role';
import { User, UserRole } from '@/entities/user';
import useTranslator from '@/hooks/use-translator';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/common/select';
import { showAlert } from '@/utils/showAlert';
import { ROUTES } from '@/constants/routes';

interface EditRoleFormProps {
  user: User;
}

export const EditRoleForm = ({ user }: EditRoleFormProps) => {
  const { t } = useTranslator();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

  useEffect(() => {
    setSelectedRole(user.role);
  }, [user.role]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateUserRole,
    onSuccess: ({ statusCode, message }) => {
      if (statusCode === 200) {
        showAlert(message || t('role-updated-successfully'));
        queryClient.invalidateQueries({ queryKey: ['users'] });
        router.push(ROUTES.SETTINGS.HOME);
      } else {
        showAlert(message || t('something-went-wrong'));
      }
    },
    onError: (error) => {
      console.error(error);
      showAlert(t('something-went-wrong'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ id: user.id, role: selectedRole });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <p className="font-semibold text-zinc-900">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-brand-900">
            {t('user-role')}
          </label>
          <Select
            placeholder={t('user-role')}
            value={selectedRole}
            onValueChange={(val) => setSelectedRole(val as UserRole)}
          >
            <SelectItem
              text={t('role-secretary')}
              value="secretary"
              description="Gestão de avisos, missas e agendamentos"
            />
            <SelectItem
              text={t('role-pastoral_agent')}
              value="pastoral_agent"
              description="Acesso restrito à própria agenda de atendimentos"
            />
            <SelectItem
              text={t('role-admin')}
              value="admin"
              description="Acesso administrativo irrestrito"
            />
            <SelectItem
              text={t('role-viewer')}
              value="viewer"
              description="Apenas visualização sem poder de edição"
            />
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-4 mt-8 justify-between border-t border-divider">
        <Link href={ROUTES.SETTINGS.HOME}>
          <Button variant="outline" size="lg" type="button">
            {t('cancel')}
          </Button>
        </Link>
        <Button size="lg" type="submit" isLoading={isPending}>
          {t('save-changes')}
        </Button>
      </div>
    </form>
  );
};
