import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/typography/Describe';
import { Title } from '@/components/typography/Title';

export default function Albums() {
  return (
    <>
      <Title>Álbuns</Title>

      <Describe>
        Crie e gerencie os álbuns da sua paróquia, adicione novas fotos e
        vídeos.
      </Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
