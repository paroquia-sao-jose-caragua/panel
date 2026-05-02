import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/typography/Describe';
import { Title } from '@/components/typography/Title';

export default function Pastorals() {
  return (
    <>
      <Title>Pastorais</Title>

      <Describe>
        Gerencie as pastorais da sua paróquia, adicione novas pastorais, edite
        informações existentes e mantenha os dados atualizados.
      </Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
