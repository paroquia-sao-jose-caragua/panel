import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function Videos() {
  return (
    <>
      <TypographyH1>Vídeos</TypographyH1>

      <Describe>Adicione, edite e gerencie os vídeos da sua paróquia.</Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
