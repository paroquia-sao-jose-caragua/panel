import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/typography/Describe';
import { Title } from '@/components/typography/Title';

export default function Events() {
  return (
    <>
      <Title>Eventos</Title>

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
