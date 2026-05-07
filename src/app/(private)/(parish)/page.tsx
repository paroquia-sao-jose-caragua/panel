import { AddCardNavigation } from '@/components/common/add-card-navigation';
import { Describe } from '@/components/ui/typography/describe';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { Church } from 'lucide-react';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { CommunitiesList } from './(churches)/list';

export default function Churches() {
  return (
    <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <AppBreadcrumb
        links={[{ key: 'origin', href: '/', title: 'Paróquia', icon: Church }]}
      />

      <TypographyH1>Bem-vindo à Paróquia São José!</TypographyH1>

      <Describe>
        Gerencie as igrejas da sua paróquia, adicione novas igrejas, edite
        informações existentes e mantenha os dados atualizados.
      </Describe>

      <div className="grid xl:grid xl:grid-cols-card gap-6 py-6">
        <CommunitiesList />

        <AddCardNavigation
          title="Adicione uma igreja"
          subtitle="para gerenciar a programação e as informações de cada comunidade da paróquia."
          href="/add"
        />
      </div>
    </main>
  );
}
