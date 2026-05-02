import { DevNoticeCard } from '@/components/common/dev-notice-card';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function FullSchedule() {
  return (
    <>
      <TypographyH1>Programação Completa</TypographyH1>

      <Describe>
        Consulte a programação completa da sua paróquia, desmarque ou adicione
        eventos, e mantenha a comunidade informada sobre as atividades e
        celebrações.
      </Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
