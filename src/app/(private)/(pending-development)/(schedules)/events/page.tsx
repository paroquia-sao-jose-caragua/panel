import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function Events() {
  return (
    <>
      <TypographyH1>Eventos</TypographyH1>

      <Describe>
        Gerencie os eventos da sua paróquia, adicione novos eventos, edite
        informações existentes e mantenha os dados atualizados.
      </Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
