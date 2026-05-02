import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function Pastorals() {
  return (
    <>
      <TypographyH1>Pastorais</TypographyH1>

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
