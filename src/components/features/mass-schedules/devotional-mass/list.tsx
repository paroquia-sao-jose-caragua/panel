import { MassSchedulesList } from '../list';
import useTranslator from '@/hooks/use-translator';
import { useCommunity } from '@/api/communities/use-community';

export const DevotionalMassesList = () => {
  const { t } = useTranslator();
  const { community } = useCommunity();

  return (
    <MassSchedulesList
      title={t('devotional-masses')}
      type="devotional"
      typeFilter="devotional"
      addHref={`/${community?.slug}/add-devotional-mass`}
      editHrefPattern={(id) => `/${community?.slug}/devotional-mass/${id}/edit`}
      info={t('devotional-mass-info')}
    />
  );
};
