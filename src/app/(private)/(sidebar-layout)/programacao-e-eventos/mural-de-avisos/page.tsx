'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteConfirmationDialog } from '@/components/common/dialog/confirm-dialog';
import { listNotices, deleteNotice } from '@/api/notices';
import { ROUTES } from '@/constants/routes';
import { showAlert } from '@/utils/showAlert';
import type { Notice } from '@/entities/notice';
import {
  Bell,
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Pin,
  ExternalLink,
  AlertTriangle,
  Info,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

export default function NoticesPage() {
  const queryClient = useQueryClient();
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  const siteBaseUrl =
    process.env.NEXT_PUBLIC_SITE_BASE_URL || 'http://localhost:3001';

  const { data, isPending } = useQuery({
    queryKey: ['notices'],
    queryFn: listNotices,
  });

  const notices = data?.notices ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      showAlert('Aviso excluído com sucesso.', 'success');
      setNoticeToDelete(null);
    },
    onError: () => {
      showAlert('Não foi possível excluir o aviso.', 'error');
    },
  });

  const getStatusBadge = (notice: Notice) => {
    const now = new Date();
    const startsAt = notice.startsAt ? new Date(notice.startsAt) : null;
    const endsAt = notice.endsAt ? new Date(notice.endsAt) : null;

    if (!notice.active) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">
          <XCircle className="w-3.5 h-3.5" />
          Inativo
        </span>
      );
    }
    if (startsAt && startsAt > now) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          <Clock className="w-3.5 h-3.5" />
          Agendado
        </span>
      );
    }
    if (endsAt && endsAt < now) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
          <Clock className="w-3.5 h-3.5" />
          Expirado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Em andamento
      </span>
    );
  };

  const getVariantBadge = (variant: Notice['variant']) => {
    switch (variant) {
      case 'alert':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200/70">
            <AlertTriangle className="w-3 h-3" />
            Urgente
          </span>
        );
      case 'solemnity':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/70">
            <Sparkles className="w-3 h-3" />
            Solenidade
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
            <Info className="w-3 h-3" />
            Comunicado
          </span>
        );
    }
  };

  const formatDate = (iso?: string | null) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'programacao-e-eventos',
            href: ROUTES.CALENDAR.HOME,
            title: 'Programação & Eventos',
            icon: CalendarDays,
          },
          {
            key: 'mural-de-avisos',
            href: ROUTES.NOTICES.HOME,
            title: 'Mural de Avisos',
            icon: Bell,
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <TypographyH1>Mural de Avisos</TypographyH1>
            <Describe>
              Publique múltiplos comunicados paroquiais. Avisos em andamento
              aparecem no sininho do site e na página do Mural de Avisos.
            </Describe>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" asChild>
              <a
                href={`${siteBaseUrl}/mural-de-avisos`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Ver no site
              </a>
            </Button>
            <Button asChild>
              <Link href={ROUTES.NOTICES.ADD}>
                <Plus className="w-4 h-4 mr-1.5" />
                Novo Aviso
              </Link>
            </Button>
          </div>
        </div>

        {isPending ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-500">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Nenhum aviso publicado ainda
            </h2>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              Crie avisos paroquiais com período de exibição para informar a
              comunidade pelo sininho e pelo Mural de Avisos.
            </p>
            <div className="pt-2">
              <Button asChild>
                <Link href={ROUTES.NOTICES.ADD}>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Publicar primeiro aviso
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-900">
                        <Pin className="w-3 h-3" />
                        Fixado
                      </span>
                    )}
                    {getVariantBadge(notice.variant)}
                    {getStatusBadge(notice)}
                  </div>

                  <h3 className="text-base font-semibold text-zinc-900 truncate">
                    {notice.title}
                  </h3>

                  <p className="text-sm text-zinc-600 line-clamp-2">
                    {notice.summary || notice.description}
                  </p>

                  {(notice.startsAt || notice.endsAt) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                      {notice.startsAt && (
                        <span>Início: {formatDate(notice.startsAt)}</span>
                      )}
                      {notice.endsAt && (
                        <span>Expira em: {formatDate(notice.endsAt)}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={ROUTES.NOTICES.EDIT(notice.id)}>
                      <Pencil className="w-4 h-4 mr-1.5" />
                      Editar
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setNoticeToDelete(notice)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <DeleteConfirmationDialog
        open={Boolean(noticeToDelete)}
        onOpenChange={(open) => !open && setNoticeToDelete(null)}
        title="Excluir aviso"
        description={`Tem certeza que deseja excluir o aviso "${noticeToDelete?.title}"? Esta ação não pode ser desfeita.`}
        onConfirm={() => {
          if (noticeToDelete) {
            deleteMutation.mutate(noticeToDelete.id);
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
