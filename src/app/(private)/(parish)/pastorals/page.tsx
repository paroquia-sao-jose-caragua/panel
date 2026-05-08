import { AddCardNavigation } from '@/components/common/add-card-navigation';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Church } from 'lucide-react';

const pastorals = [{
  title: "Pastoral da Família",
  url: 'https://images.unsplash.com/photo-1777377772858-f9a04561ae3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8'
}]

export default function Pastorals() {
  return (
     <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <AppBreadcrumb
        links={[{ key: 'origin', href: '/', title: 'Paróquia', icon: Church }]}
      />

      <TypographyH1>Pastorais</TypographyH1>

      <Describe>
        Gerencie as igrejas da sua paróquia, adicione novas igrejas, edite
        informações existentes e mantenha os dados atualizados.
      </Describe>

      <div className="grid xl:grid xl:grid-cols-card gap-6 py-6">
        <AddCardNavigation
          title="Adicione uma igreja"
          subtitle="para gerenciar a programação e as informações de cada comunidade da paróquia."
          href="/add"
        />
        </div>
    </main>
  );
}
