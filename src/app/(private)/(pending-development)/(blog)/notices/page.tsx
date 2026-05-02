import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/typography/Describe';
import { Title } from '@/components/typography/Title';

export default function Notices() {
  return (
    <>
      <Title>Avisos</Title>

      <Describe>
        Gerencie os avisos da sua paróquia, adicione novos avisos, edite
        informações existentes e mantenha os dados atualizados.
      </Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
