import { MassSchedulesList } from '../list';
import useTranslator from '@/hooks/use-translator';
import { useCommunity } from '@/api/communities/use-community';

export const AnnualMassesList = () => {
  const { t } = useTranslator();
  const { community } = useCommunity();

  return (
    <MassSchedulesList
      title={t('annual-masses')}
      type="annual"
      typeFilter="solemnity"
      addHref={`/${community?.slug}/add-annual-mass`}
      editHrefPattern={(id) => `/${community?.slug}/annual-mass/${id}/edit`}
    />
  );
};
