import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function Albums() {
  return (
    <>
      <TypographyH1>Álbuns</TypographyH1>

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
