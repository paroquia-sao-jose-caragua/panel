import { MassSchedulesList } from '../list';
import useTranslator from '@/hooks/use-translator';
import { useCommunity } from '@/api/communities/use-community';

export const OrdinaryMassesList = () => {
  const { t } = useTranslator();
  const { community } = useCommunity();

  return (
    <MassSchedulesList
      title={t('ordinary-masses')}
      type="ordinary"
      typeFilter="ordinary"
      addHref={`/${community?.slug}/add-ordinary-mass`}
      editHrefPattern={(id) => `/${community?.slug}/ordinary-mass/${id}/edit`}
    />
  );
};
