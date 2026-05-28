import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Users } from 'lucide-react';
import { PastoralsList } from './list';


export default function Pastorals() {
  return (
     <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <AppBreadcrumb
        links={[{ key: 'origin', href: '/', title: 'Paróquia', icon: Users }]}
      />

      <TypographyH1>Pastorais</TypographyH1>

      <Describe>
        Gerencie as pastorais da paróquia, incluindo suas descrições, membros e atividades.
      </Describe>

      <div className="grid xl:grid xl:grid-cols-card gap-6 py-6">
        <PastoralsList />      
      </div>
    </main>
  );
}
