'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MoreHorizontal,
  Shield,
  KeyRound,
  UserX,
  UserCheck,
  LogOut,
  Mail,
} from 'lucide-react';
import { User, UserRole, UserStatus } from '@/entities/user';
import useAuthStore from '@/stores/useAuthStore';
import useTranslator from '@/hooks/use-translator';
import { updateUserStatus } from '@/api/users/update-user-status';
import { revokeUserSessions } from '@/api/users/revoke-user-sessions';
import { resendUserInvite } from '@/api/users/resend-user-invite';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/common/dialog/confirm-dialog';
import { showAlert } from '@/utils/showAlert';
import { ROUTES } from '@/constants/routes';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

export const UsersTable = ({ users, isLoading }: UsersTableProps) => {
  const { t } = useTranslator();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  const [userToToggleStatus, setUserToToggleStatus] = useState<User | null>(null);
  const [userToRevokeSessions, setUserToRevokeSessions] = useState<User | null>(null);
  const [userToResendInvite, setUserToResendInvite] = useState<User | null>(null);

  const { mutate: mutateResendInvite, isPending: isResendingInvite } = useMutation({
    mutationFn: resendUserInvite,
    onSuccess: ({ statusCode, message }) => {
      if (statusCode === 200) {
        showAlert(message || t('invite-resent-successfully'));
        queryClient.invalidateQueries({ queryKey: ['users'] });
        setUserToResendInvite(null);
      } else {
        showAlert(message || t('something-went-wrong'));
      }
    },
    onError: (error) => {
      console.error(error);
      showAlert(t('something-went-wrong'));
    },
  });

  const { mutate: mutateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: ({ statusCode, message }) => {
      if (statusCode === 200) {
        showAlert(message || t('status-updated-successfully'));
        queryClient.invalidateQueries({ queryKey: ['users'] });
        setUserToToggleStatus(null);
      } else {
        showAlert(message || t('something-went-wrong'));
      }
    },
    onError: (error) => {
      console.error(error);
      showAlert(t('something-went-wrong'));
    },
  });

  const { mutate: mutateRevoke, isPending: isRevoking } = useMutation({
    mutationFn: revokeUserSessions,
    onSuccess: ({ statusCode, message }) => {
      if (statusCode === 200) {
        showAlert(message || t('sessions-revoked-successfully'));
        setUserToRevokeSessions(null);
      } else {
        showAlert(message || t('something-went-wrong'));
      }
    },
    onError: (error) => {
      console.error(error);
      showAlert(t('something-went-wrong'));
    },
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            {t('role-admin')}
          </span>
        );
      case 'secretary':
      case 'user':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {t('role-secretary')}
          </span>
        );
      case 'pastoral_agent':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            {t('role-pastoral_agent')}
          </span>
        );
      case 'viewer':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
            {t('role-viewer')}
          </span>
        );
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            {t('status-active')}
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            {t('status-suspended')}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            {t('status-pending')}
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatLastLogin = (lastLoginAt: string | null) => {
    if (!lastLoginAt) return t('never-logged-in');
    try {
      const date = new Date(lastLoginAt);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return lastLoginAt;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="w-36 h-4" />
                  <Skeleton className="w-48 h-3" />
                </div>
              </div>
              <Skeleton className="w-24 h-6 rounded-full" />
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-8 h-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
        <p className="text-zinc-500">{t('no-users-found')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">{t('user-name')}</th>
              <th className="py-3.5 px-4">{t('user-role')}</th>
              <th className="py-3.5 px-4">{t('user-status')}</th>
              <th className="py-3.5 px-4">{t('last-login')}</th>
              <th className="py-3.5 px-4 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 text-sm">
            {users.map((u) => {
              const isSelf = currentUser?.email === u.email;

              return (
                <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 font-semibold flex items-center justify-center text-sm shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="font-medium text-zinc-900 flex items-center gap-1.5">
                          {u.name}
                          {isSelf && (
                            <span className="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded-full font-medium">
                              Você
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 truncate">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(u.status)}</td>
                  <td className="py-3.5 px-4 text-zinc-500 text-xs">
                    {formatLastLogin(u.lastLoginAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {u.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-brand-600 hover:text-brand-800 hover:bg-brand-50"
                          title={t('resend-invite')}
                          onClick={() => setUserToResendInvite(u)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white">
                          {u.status === 'pending' && (
                            <DropdownMenuItem
                              onClick={() => setUserToResendInvite(u)}
                              className="gap-2 cursor-pointer text-brand-700 focus:text-brand-800"
                            >
                              <Mail className="w-4 h-4 text-brand-600" />
                              <span>{t('resend-invite')}</span>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem asChild>
                            <Link
                              href={ROUTES.SETTINGS.EDIT_USER_ROLE(u.id)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Shield className="w-4 h-4 text-brand-600" />
                              <span>{t('change-role')}</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href={ROUTES.SETTINGS.RESET_USER_PASSWORD(u.id)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <KeyRound className="w-4 h-4 text-zinc-600" />
                              <span>{t('reset-password')}</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => setUserToRevokeSessions(u)}
                            className="gap-2 cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-zinc-600" />
                            <span>{t('revoke-sessions')}</span>
                          </DropdownMenuItem>

                          {!isSelf && (
                            <DropdownMenuItem
                              onClick={() => setUserToToggleStatus(u)}
                              className="gap-2 cursor-pointer text-red-600 focus:text-red-700"
                            >
                              {u.status === 'suspended' ? (
                                <>
                                  <UserCheck className="w-4 h-4 text-emerald-600" />
                                  <span className="text-emerald-700">{t('reactivate-account')}</span>
                                </>
                              ) : (
                                <>
                                  <UserX className="w-4 h-4 text-red-600" />
                                  <span>{t('suspend-account')}</span>
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resend Invite Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(userToResendInvite)}
        onOpenChange={(open) => !open && setUserToResendInvite(null)}
        title={t('resend-invite-confirm-title')}
        description={
          userToResendInvite
            ? `${t('resend-invite-confirm-desc')} (${userToResendInvite.name} • ${userToResendInvite.email})`
            : t('resend-invite-confirm-desc')
        }
        confirmText={t('confirm')}
        cancelText={t('cancel')}
        variant="default"
        isPending={isResendingInvite}
        onConfirm={() => {
          if (userToResendInvite) {
            mutateResendInvite(userToResendInvite.id);
          }
        }}
      />

      {/* Toggle Status Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(userToToggleStatus)}
        onOpenChange={(open) => !open && setUserToToggleStatus(null)}
        title={
          userToToggleStatus?.status === 'suspended'
            ? t('reactivate-account')
            : t('suspend-account')
        }
        description={
          userToToggleStatus?.status === 'suspended'
            ? t('reactivate-user-confirm-desc')
            : t('suspend-user-confirm-desc')
        }
        confirmText={t('confirm')}
        cancelText={t('cancel')}
        variant={userToToggleStatus?.status === 'suspended' ? 'default' : 'destructive'}
        isPending={isUpdatingStatus}
        onConfirm={() => {
          if (userToToggleStatus) {
            const nextStatus: UserStatus =
              userToToggleStatus.status === 'suspended' ? 'active' : 'suspended';
            mutateStatus({ id: userToToggleStatus.id, status: nextStatus });
          }
        }}
      />

      {/* Revoke Sessions Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(userToRevokeSessions)}
        onOpenChange={(open) => !open && setUserToRevokeSessions(null)}
        title={t('revoke-sessions')}
        description={t('revoke-sessions-confirm-desc')}
        confirmText={t('confirm')}
        cancelText={t('cancel')}
        variant="destructive"
        isPending={isRevoking}
        onConfirm={() => {
          if (userToRevokeSessions) {
            mutateRevoke(userToRevokeSessions.id);
          }
        }}
      />
    </>
  );
};
