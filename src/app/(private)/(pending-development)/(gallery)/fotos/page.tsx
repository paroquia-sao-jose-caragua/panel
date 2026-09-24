import { DevNoticeCard } from '@/components/common/dev-notice-card';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function Photos() {
  return (
    <>
      <TypographyH1>Fotos</TypographyH1>

      <Describe>Adicione, edite e gerencie as fotos da sua paróquia.</Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
