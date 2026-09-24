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
      addHref={`/${community?.slug}/adicionar-missa-regular`}
      editHrefPattern={(id) => `/${community?.slug}/missa-regular/${id}/editar`}
      info={t('ordinary-mass-info')}
    />
  );
};
