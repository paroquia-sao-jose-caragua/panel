import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/typography/Describe';
import { Title } from '@/components/typography/Title';

export default function Videos() {
  return (
    <>
      <Title>Vídeos</Title>

      <Describe>Adicione, edite e gerencie os vídeos da sua paróquia.</Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
