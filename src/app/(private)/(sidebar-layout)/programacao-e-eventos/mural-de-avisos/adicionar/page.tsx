'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  NoticeForm,
  toIsoOrNull,
  type NoticeFormValues,
} from '@/components/features/notices/notice-form';
import { createNotice } from '@/api/notices';
import { ROUTES } from '@/constants/routes';
import { showAlert } from '@/utils/showAlert';

export default function AddNoticePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [values, setValues] = useState<NoticeFormValues>({
    title: '',
    summary: '',
    description: '',
    variant: 'info',
    imageId: '',
    actionText: '',
    actionUrl: '',
    pinned: false,
    active: true,
    startsAt: '',
    endsAt: '',
  });

  const handleChange = (
    field: keyof NoticeFormValues,
    value: NoticeFormValues[keyof NoticeFormValues]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const createMutation = useMutation({
    mutationFn: createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      showAlert('Aviso publicado com sucesso!');
      router.replace(ROUTES.NOTICES.HOME);
    },
    onError: (err: Error) => {
      showAlert(err?.message || 'Erro ao publicar aviso.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!values.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (!values.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createMutation.mutate({
      title: values.title.trim(),
      summary: values.summary.trim() || null,
      description: values.description.trim(),
      variant: values.variant,
      imageId: values.imageId || null,
      actionText: values.actionText.trim() || null,
      actionUrl: values.actionUrl.trim() || null,
      pinned: values.pinned,
      active: values.active,
      startsAt: toIsoOrNull(values.startsAt),
      endsAt: toIsoOrNull(values.endsAt),
    });
  };

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white border-b border-zinc-200/80 relative lg:sticky lg:top-0 z-10 lg:z-40 shadow-2xs mt-16 lg:mt-0 md:mt-20">
        <div className="mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.NOTICES.HOME} />
          <TypographyH1 size="form">Novo Aviso no Mural</TypographyH1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-200 px-4 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <NoticeForm
            values={values}
            onChange={handleChange}
            errors={errors}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" asChild>
              <Link href={ROUTES.NOTICES.HOME}>Cancelar</Link>
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Spinner className="w-4 h-4 mr-2" />}
              Publicar Aviso
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
