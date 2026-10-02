'use client';

import { BackButton } from '@/components/common/back-button';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/constants/routes';
import useTranslator from '@/hooks/use-translator';
import { ChangePasswordForm } from './form';

export default function ChangePasswordPage() {
  const { t } = useTranslator();

  return (
    <div className="w-full lg:col-start-2">
      <header className="bg-white border-b border-zinc-200/80 relative lg:sticky lg:top-0 z-10 lg:z-40 shadow-2xs mt-16 lg:mt-0 md:mt-20">
        <div className="mx-auto w-full max-w-200 px-4 lg:px-8 py-4">
          <BackButton href={ROUTES.SETTINGS.HOME} />

          <div className="flex flex-row items-center gap-4">
            <div>
              <TypographyH1>{t('change-password')}</TypographyH1>
              <span className="text-md font-medium text-zinc-600">
                {t('change-password-desc')}
              </span>
            </div>
          </div>
        </div>

        <Separator />
      </header>

      <main className="w-full max-w-200 px-4 pt-8 pb-12 mx-auto lg:px-8">
        <ChangePasswordForm />
      </main>
    </div>
  );
}
