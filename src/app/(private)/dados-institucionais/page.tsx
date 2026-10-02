'use client';

import { Describe } from '@/components/ui/typography/describe';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { ROUTES } from '@/constants/routes';
import { CommunitiesList } from './list';

export default function Churches() {
  return (
    <>
      <AppHeader
        links={[{ key: 'origin', href: ROUTES.HOME, title: 'Comunidades & Capelas', icon: 'church' }]}
      />
      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        <TypographyH1>Bem-vindo à Paróquia São José!</TypographyH1>

        <Describe>
          Gerencie as igrejas da sua paróquia, adicione novas igrejas, edite
          informações existentes e mantenha os dados atualizados.
        </Describe>

        <div className="py-6">
          <CommunitiesList />
        </div>
      </main>
    </>
  );
}

