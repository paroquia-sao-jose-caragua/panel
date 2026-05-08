import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Church } from 'lucide-react';

const clergies =[
  {
    name: "Altair Santos",
    cargo: "Pároco",
    url: "https://images.pexels.com/photos/28143097/pexels-photo-28143097/free-photo-of-igreja-capela-catedral-retrato.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
]

export default function Clergies() {
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
       

       
      </div>
    </main>
  );
}
