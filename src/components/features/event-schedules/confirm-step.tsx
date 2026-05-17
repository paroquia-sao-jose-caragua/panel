import { TypographyH2 } from '@/components/ui/typography/h2';
import { Check, MapPinIcon } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import useTranslator from '@/hooks/use-translator';
import { formatFullAddress } from '@/utils/formatFullAddress';
import { useCommunities } from '@/api/communities/use-communities';
import { useMemo } from 'react';

dayjs.locale('pt-br');

interface ConfirmStepProps {
  mode?: 'edit' | 'add';
  type: string;
  massType?: 'ordinary' | 'devotional' | 'solemnity' | 'sacramental';
  isPrecept?: boolean;
  title: string;
  eventDate: string;
  startTime: string;
  endTime?: string;
  street?: string;
  number?: string;
  district?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  orientations?: string;
  communityId: string;
}

export const ConfirmStep = ({
  mode = 'add',
  type,
  massType,
  isPrecept,
  title,
  eventDate,
  startTime,
  endTime,
  street,
  number,
  district,
  zipCode,
  city,
  state,
  orientations,
  communityId,
}: ConfirmStepProps) => {
  const { t } = useTranslator();

  const { communities } = useCommunities();

  const hasCustomLocation =
    street && number && district && zipCode && city && state;

  const community = useMemo(() => {
    return communities?.find((community) => community.id === communityId);
  }, [communityId, communities]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 sm:py-8 flex flex-col gap-4 pb-5">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-50 text-brand-700">
          <Check className="w-8 h-8" />
        </div>
        <div>
          <TypographyH2 className="text-center">Confirmação</TypographyH2>
          <p className="text-center text-zinc-600 mt-3">
            Revise as informações antes de{' '}
            {mode === 'add' ? 'adicionar' : 'alterar'}
          </p>
        </div>
        <div className="w-full max-w-100 divide-y divide-divider">
          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">Categoria</span>
            <span className="text-right font-medium">
              {/* @ts-expect-error - Dynamic event type strings */}
              {t(`event-label-${type}`)}
            </span>
          </div>

          {type === 'mass' && massType && (
            <div className="grid grid-cols-2 gap-4 pt-6 py-3">
              <span className="text-zinc-600">Tipo de Missa</span>
              <span className="text-right font-medium">
                {massType === 'ordinary' ? 'Comum' : null}
                {massType === 'devotional' ? 'Devocional' : null}
                {massType === 'solemnity' ? 'Solenidade' : null}
                {massType === 'sacramental' ? 'Sacramental' : null}
              </span>
            </div>
          )}

          {type === 'mass' && (
            <div className="grid grid-cols-2 gap-4 pt-6 py-3">
              <span className="text-zinc-600">Missa de Preceito</span>
              <span
                className={`text-right font-medium ${isPrecept ? 'text-green-600' : ''}`}
              >
                {isPrecept ? 'Sim' : 'Não'}
              </span>
            </div>
          )}

          {type === 'mass' && title && massType !== 'ordinary' && (
            <div className="grid grid-cols-2 gap-4 pt-6 py-3">
              <span className="text-zinc-600">
                {massType ? t(`title-of-${massType}`) : 'Título'}
              </span>
              <span className="text-right font-medium">{title}</span>
            </div>
          )}

          {type !== 'mass' && title && (
            <div className="grid grid-cols-2 gap-4 pt-6 py-3">
              <span className="text-zinc-600">Título</span>
              <span className="text-right font-medium">{title}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">Data</span>
            <span className="text-right font-medium">
              {dayjs(eventDate).format('DD/MM/YYYY')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 py-3">
            <span className="text-zinc-600">Horário</span>
            <span className="text-right font-medium">
              {startTime}
              {endTime ? ` - ${endTime}` : ''}
            </span>
          </div>

          {community && (
            <div className="grid grid-cols-2 gap-4 pt-6 py-3">
              <span className="text-zinc-600">Comunidade</span>
              <span className="text-right font-medium">
                {community.type === 'parish_church' ? 'Paróquia ' : 'Capela '}
                {community.name}
              </span>
            </div>
          )}

          {hasCustomLocation && (
            <div className="flex flex-col gap-4 pt-6 py-3">
              <span className="text-zinc-600">Endereço</span>
              <div className="flex flex-row gap-2">
                <MapPinIcon className="text-zinc-400" />
                <span className="font-medium">
                  {formatFullAddress({
                    zipCode,
                    state,
                    number,
                    street,
                    district,
                    city,
                  })}
                </span>
              </div>
            </div>
          )}

          {orientations && (
            <div className="flex flex-col gap-4 pt-6 py-3">
              <span className="text-zinc-600">Orientações</span>
              <span className="text-right font-medium text-sm">
                {orientations}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
