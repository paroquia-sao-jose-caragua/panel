import { MapPinIcon, SearchIcon } from 'lucide-react';
import {
  Root as InputRoot,
  Control as InputControl,
  Prefix as InputPrefix,
} from '@/components/common/input';
import React, { useCallback, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { findAddressByZipCode } from '@/api/zip-code';
import { Spinner } from '@/components/ui/spinner';
import { stringUtils } from '@/utils/stringUtils';
import type { useCreateChurch } from './churches/add-church/use-create-church';
import type { useEditChurch } from './churches/edit-church/use-edit-church';
import { FieldSection } from '../ui/field-section';
import type { useCreateEventSchedule } from './event-schedules/use-create-event-schedule';

interface FormAddressProps {
  formik: ReturnType<
    | typeof useCreateChurch
    | typeof useCreateEventSchedule
    | typeof useEditChurch
  >['formik'];
  isOptional?: boolean;
  description?: string;
}

const formatZipCode = (value: string) => {
  const digits = stringUtils.removeNonDigits(value).slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
};

export const FullAddressForm = ({
  formik,
  isOptional,
  description,
}: FormAddressProps) => {
  const lastSearchedZipCodeRef = useRef<string>('');
  const [lookupError, setLookupError] = useState<string | null>(null);

  const { isPending, mutate } = useMutation({
    mutationFn: findAddressByZipCode,
    networkMode: 'always',
  });

  const handleSearchAddress = useCallback(
    (currentZipCode: string, force = false) => {
      const zipCode = stringUtils.removeNonDigits(currentZipCode).slice(0, 8);

      if (zipCode.length !== 8) {
        setLookupError(null);
        return;
      }

      if (!force && zipCode === lastSearchedZipCodeRef.current) {
        return;
      }

      lastSearchedZipCodeRef.current = zipCode;
      setLookupError(null);

      mutate(zipCode, {
        onSuccess: (response) => {
          if (response.data) {
            if (response.data.street) {
              formik.setFieldValue('street', response.data.street);
            }
            if (response.data.district) {
              formik.setFieldValue('district', response.data.district);
            }
            if (response.data.city) {
              formik.setFieldValue('city', response.data.city);
            }
            if (response.data.state) {
              formik.setFieldValue('state', response.data.state);
            }
            return;
          }

          if (response.error) {
            setLookupError(
              response.error.message ||
                'CEP não encontrado. Você pode preencher o endereço manualmente.'
            );
          }
        },
        onError: () => {
          setLookupError(
            'Não foi possível buscar o CEP. Você pode preencher o endereço manualmente.'
          );
        },
      });
    },
    [formik, mutate]
  );

  const handleChangeZipCode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatZipCode(e.target.value);
      const digits = stringUtils.removeNonDigits(formatted);

      if (digits.length < 8) {
        lastSearchedZipCodeRef.current = '';
        setLookupError(null);
      }

      formik.setFieldValue('zipCode', formatted);
      handleSearchAddress(formatted);
    },
    [formik, handleSearchAddress]
  );

  return (
    <FieldSection
      title="Endereço Completo"
      icon={<MapPinIcon className="text-zinc-400" />}
      isOptional={isOptional}
      description={description}
    >
      <div className="flex-1">
        <span className="block mb-2 text-sm text-zinc-700 font-semibold">
          CEP
        </span>
        <InputRoot
          touched={formik.touched.zipCode}
          error={formik.errors.zipCode}
          helperText={lookupError ?? undefined}
        >
          <InputControl
            name="zipCode"
            type="text"
            inputMode="numeric"
            maxLength={9}
            placeholder="00000-000"
            value={formik.values.zipCode}
            onChange={handleChangeZipCode}
            onBlur={(e) => {
              formik.handleBlur(e);
              handleSearchAddress(e.target.value);
            }}
          />
          <InputPrefix>
            <button
              type="button"
              onClick={() => handleSearchAddress(formik.values.zipCode, true)}
              disabled={isPending}
              aria-label="Buscar endereço pelo CEP"
              className="flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer disabled:cursor-default"
            >
              {isPending ? (
                <Spinner className="h-5 w-5 text-zinc-400" />
              ) : (
                <SearchIcon className="h-5 w-5" />
              )}
            </button>
          </InputPrefix>
        </InputRoot>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <span className="block mb-2 text-sm text-zinc-700 font-semibold">
            Rua
          </span>
          <InputRoot
            touched={formik.touched.street}
            error={formik.errors.street}
          >
            <InputControl
              name="street"
              type="text"
              value={formik.values.street}
              onChange={formik.handleChange}
            />
          </InputRoot>
        </div>

        <div className="flex-1">
          <span className="block mb-2 text-sm text-zinc-700 font-semibold">
            Número
          </span>
          <InputRoot
            touched={formik.touched.number}
            error={formik.errors.number}
          >
            <InputControl
              name="number"
              type="text"
              value={formik.values.number}
              onChange={formik.handleChange}
            />
          </InputRoot>
        </div>
      </div>

      <div className="flex-1">
        <span className="block mb-2 text-sm text-zinc-700 font-semibold">
          Bairro
        </span>
        <InputRoot
          touched={formik.touched.district}
          error={formik.errors.district}
        >
          <InputControl
            name="district"
            type="text"
            value={formik.values.district}
            onChange={formik.handleChange}
          />
        </InputRoot>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <span className="block mb-2 text-sm text-zinc-700 font-semibold">
            Cidade
          </span>
          <InputRoot touched={formik.touched.city} error={formik.errors.city}>
            <InputControl
              name="city"
              type="text"
              value={formik.values.city}
              onChange={formik.handleChange}
            />
          </InputRoot>
        </div>

        <div className="flex-1">
          <span className="block mb-2 text-sm text-zinc-700 font-semibold">
            Estado
          </span>
          <InputRoot touched={formik.touched.state} error={formik.errors.state}>
            <InputControl
              name="state"
              type="text"
              value={formik.values.state}
              onChange={formik.handleChange}
            />
          </InputRoot>
        </div>
      </div>
    </FieldSection>
  );
};
