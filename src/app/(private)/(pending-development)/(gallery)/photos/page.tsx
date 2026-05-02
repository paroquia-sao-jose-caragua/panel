import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/typography/Describe';
import { Title } from '@/components/typography/Title';

export default function Photos() {
  return (
    <>
      <Title>Fotos</Title>

      <Describe>Adicione, edite e gerencie as fotos da sua paróquia.</Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
