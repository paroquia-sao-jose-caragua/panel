import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { CalendarIcon } from 'lucide-react';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function Schedules() {
  return (
    <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <AppBreadcrumb
        links={[
          { key: 'origin', href: '/', title: 'Agenda', icon: CalendarIcon },
        ]}
      />

      <TypographyH1>Agenda</TypographyH1>

      <div className="grid xl:grid xl:grid-cols-card gap-6 py-6"></div>
    </main>
  );
}
