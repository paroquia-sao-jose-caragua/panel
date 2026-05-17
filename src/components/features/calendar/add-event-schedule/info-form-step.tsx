import { Select } from '@/components/common/select';
import { SelectItem } from '@/components/common/select';
import { FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import { ClockIcon, CalendarIcon, ChurchIcon } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCommunities } from '@/api/communities/use-communities';
import type { useCreateEventSchedule } from './use-create-event-schedule';
import useTranslator from '@/hooks/use-translator';
import { FullAddressForm } from '../../full-address-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface InfoStepProps {
  formik: ReturnType<typeof useCreateEventSchedule>['formik'];
}

const events = [
  'mass',
  'feast',
  'meeting',
  'formation',
  'retreat',
  'service',
  'pilgrimage',
  'liturgical-event',
  'conference',
  'anniversary',
  'community-event',
  'ordination',
  'other',
] as const;

export const InfoFormStep = ({ formik }: InfoStepProps) => {
  const { t } = useTranslator();

  const { communities, isPending } = useCommunities();

  return (
    <form
      id="add-ordinary-mass"
      className="flex w-full flex-col gap-8 divide-y divide-divider"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
        <div className="flex-1">
          <FieldLabel htmlFor="day-of-week">
            <ChurchIcon className="text-zinc-400" />
            Igreja
          </FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Qual comunidade será responsável por este agendamento?
          </span>
        </div>

        <Select
          name="communityId"
          placeholder="Selecione a comunidade"
          value={formik.values.communityId}
          onValueChange={(newValue) =>
            formik.setFieldValue('communityId', newValue)
          }
        >
          {isPending && (
            <SelectItem
              value="none"
              text="Carregando comunidades..."
              disabled
            />
          )}
          {!isPending &&
            communities.map((community) => (
              <SelectItem
                key={community.id}
                value={community.id}
                text={
                  community.type === 'parish_church'
                    ? `Paróquia ${community.name}`
                    : `Capela ${community.name}`
                }
              />
            ))}
        </Select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
        <div className="flex-1">
          <FieldLabel htmlFor="day-of-week">Categoria</FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Qual o tipo de compromisso eventual que você deseja agendar?
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Select
            name="type"
            placeholder="Selecione a categoria"
            value={formik.values.type}
            onValueChange={(newValue) =>
              formik.setFieldValue('type', newValue.replace('-', '_'))
            }
          >
            {events.map((event) => (
              <SelectItem
                key={event}
                value={event}
                text={t(`event-label-${event}`)}
                description={t(`event-info-${event}`)}
              />
            ))}
          </Select>

          <FieldDescription>
            Escolha {'\"Outro\"'} se nenhuma das categorias se encaixar no
            compromisso que você deseja agendar.
          </FieldDescription>
        </div>
      </div>

      {formik.values.type === 'mass' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
          <div className="flex-1">
            <FieldLabel htmlFor="recurrence-type">Tipo de Missa</FieldLabel>
            <span className="block text-zinc-600 mt-2">
              Selecione o tipo de missa que você deseja agendar.
            </span>
          </div>

          <RadioGroup
            name="massType"
            defaultValue="ordinary"
            value={formik.values.massType}
            className="w-full"
            onValueChange={(newValue) =>
              formik.setFieldValue('massType', newValue)
            }
          >
            <div
              className={`flex items-center gap-4 border ${formik.values.massType === 'ordinary' ? 'border-brand-600 bg-brand-0' : 'border-divider'} rounded-xl p-3`}
            >
              <RadioGroupItem value="ordinary" id="r1" />

              <Label
                htmlFor="r1"
                className="flex flex-col items-start text-zinc-700 text-md gap-0"
              >
                Missa Comum
                <span className="block text-sm text-zinc-500 font-normal">
                  Missa cotidiana da comunidade que precisou ser remarcada em um
                  horário diferente do habitual nesta data específica.
                </span>
              </Label>
            </div>

            <div
              className={`flex items-center gap-3 border ${formik.values.massType === 'devotional' ? 'border-brand-600 bg-brand-0' : 'border-divider'} rounded-xl p-3`}
            >
              <RadioGroupItem value="devotional" id="r2" />

              <Label
                htmlFor="r2"
                className="flex flex-col items-start text-zinc-700 text-md font-medium gap-0"
              >
                Missa Devocional
                <span className="block text-sm text-zinc-500 font-normal">
                  Missa devocional da comunidade que precisou ser remarcada em
                  um horário diferente do habitual nesta data específica.
                </span>
              </Label>
            </div>

            <div
              className={`flex items-center gap-3 border ${formik.values.massType === 'solemnity' ? 'border-brand-600 bg-brand-0' : 'border-divider'} rounded-xl p-3`}
            >
              <RadioGroupItem value="solemnity" id="r3" />

              <Label
                htmlFor="r3"
                className="flex flex-col items-start text-zinc-700 text-md font-medium gap-0"
              >
                Missa de Solenidade
                <span className="block text-sm text-zinc-500 font-normal">
                  Missa de solenidade da comunidade que precisou ser remarcada
                  em um horário diferente do habitual nesta data específica.
                </span>
              </Label>
            </div>

            <div
              className={`flex items-center gap-3 border ${formik.values.massType === 'sacramental' ? 'border-brand-600 bg-brand-0' : 'border-divider'} rounded-xl p-3`}
            >
              <RadioGroupItem value="sacramental" id="r4" />

              <Label
                htmlFor="r4"
                className="flex flex-col items-start text-zinc-700 text-md font-medium gap-0"
              >
                Missa Sacramental
                <span className="block text-sm text-zinc-500 font-normal">
                  Missa de Batismo, Crisma, Casamento, Primeira Eucaristia,
                  Funeral, Ordenação, etc...
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {formik.values.type !== 'mass' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
          <FieldLabel htmlFor="title">Título do Evento</FieldLabel>
          <div className="flex flex-col gap-2">
            <InputRoot helperText='Exemplo: "Missa de Pentecostes", "Reunião do Grupo de Oração", "Formação para Ministros da Eucaristia", "Batismo", "Casamento", "Crisma", "Festa de São José", etc...'>
              <InputControl
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
            </InputRoot>
          </div>
        </div>
      )}

      {formik.values.type === 'mass' &&
        formik.values.massType &&
        formik.values.massType !== 'ordinary' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
            <FieldLabel htmlFor="title">
              {t(`title-of-${formik.values.massType}`)}
            </FieldLabel>
            <div className="flex flex-col gap-2">
              <InputRoot
                helperText={t(`title-of-${formik.values.massType}-helper-text`)}
              >
                <InputControl
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
              </InputRoot>
            </div>
          </div>
        )}

      {formik.values.type === 'mass' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-row gap-4 pb-5">
          <div className="flex-1">
            <FieldLabel htmlFor="day-of-month">Missa de Preceito</FieldLabel>
            <span className="block text-zinc-600 mt-2">
              Missas de preceito são aquelas que os fiéis católicos têm
              obrigação de participar (ex: domingos e dias santos).
            </span>
          </div>
          <Switch
            name="isPrecept"
            checked={formik.values.isPrecept}
            onCheckedChange={(newValue) =>
              formik.setFieldValue('isPrecept', newValue)
            }
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
        <div className="flex-1">
          <FieldLabel htmlFor="eventDate">
            <CalendarIcon className="text-zinc-400" />
            Quando
          </FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Para quando você deseja agendar este evento?
          </span>
        </div>

        <DatePicker
          value={formik.values.eventDate}
          onChange={(newValue) => formik.setFieldValue('eventDate', newValue)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 pb-5">
        <div>
          <FieldLabel htmlFor="day-of-month">
            <ClockIcon className="text-zinc-400" />
            Horário
          </FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Informe o horário de início e término do evento.
          </span>
        </div>

        <div className="w-full flex flex-wrap gap-4 items-end">
          <div className="flex-1">
            <span className="block mb-2 text-sm text-zinc-700 font-semibold">
              Início
            </span>
            <InputRoot>
              <InputControl
                name="startTime"
                type="time"
                value={formik.values.startTime}
                onChange={formik.handleChange}
              />
            </InputRoot>
          </div>
          <div className="flex-1">
            <span className="block mb-2 text-sm text-zinc-700 font-semibold">
              Fim
            </span>
            <InputRoot>
              <InputControl
                name="endTime"
                type="time"
                value={formik.values.endTime}
                onChange={formik.handleChange}
              />
            </InputRoot>
          </div>
        </div>
      </div>

      <FullAddressForm
        formik={formik}
        isOptional
        description="Preencha apenas se o evento ocorrerá em outro local que não seja a igreja selecionada acima."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 pb-5">
        <div>
          <FieldLabel className="flex items-center gap-2">
            Orientações <Badge variant="secondary">Opcional</Badge>
          </FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Essas orientações aparecerão na página de detalhes do evento.
          </span>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          <Textarea
            name="orientations"
            value={formik.values.orientations}
            onChange={formik.handleChange}
            placeholder="Exemplo: 'Trazer o terço, chegar 15 minutos antes, etc...'"
            maxLength={255}
            className="h-30 max-h-30"
          />
        </div>
      </div>
    </form>
  );
};
