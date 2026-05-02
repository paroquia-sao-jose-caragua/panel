import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/typography/Describe';
import { Title } from '@/components/typography/Title';

export default function Clergies() {
  return (
    <>
      <Title>Autoridades</Title>

      <Describe>
        Gerencie as autoridades da sua paróquia, adicione novas autoridades,
        edite informações existentes e mantenha os dados atualizados.
      </Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
