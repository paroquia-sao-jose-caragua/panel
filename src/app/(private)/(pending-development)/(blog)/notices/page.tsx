import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function Notices() {
  return (
    <>
      <TypographyH1>Avisos</TypographyH1>

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
