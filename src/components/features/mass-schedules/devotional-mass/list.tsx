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
      addHref={`/${community?.slug}/adicionar-missa-devocional`}
      editHrefPattern={(id) => `/${community?.slug}/missa-devocional/${id}/editar`}
      info={t('devotional-mass-info')}
    />
  );
};
