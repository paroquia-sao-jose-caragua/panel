import { DevNoticeCard } from '@/components/common/dev-notice-card';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function Articles() {
  return (
    <>
      <TypographyH1>Artigos</TypographyH1>

      <Describe>
        Gerencie os artigos da sua paróquia, adicione novos artigos, edite
        informações existentes e mantenha os dados atualizados.
      </Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
