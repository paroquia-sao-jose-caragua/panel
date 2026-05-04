import { FieldLabel } from '@/components/ui/field';
import { MapPinIcon, SearchIcon } from 'lucide-react';
import {
  Root as InputRoot,
  Control as InputControl,
  Prefix as InputPrefix,
} from '@/components/common/input';
import React, { useCallback } from 'react';
import { Select, SelectItem } from '@/components/common/select';
import { useMutation } from '@tanstack/react-query';
import { findAddressByZipCode } from '@/api/zip-code';
import { Spinner } from '@/components/ui/spinner';
import { stringUtils } from '@/utils/stringUtils';
import type { useCreateChurch } from './churches/add-church/use-create-church';

interface FormAddressProps {
  formik: ReturnType<typeof useCreateChurch>['formik'];
}

export const FullAddressForm = ({ formik }: FormAddressProps) => {
  const [lastValidatedAddress, setLastValidatedAddress] = React.useState({
    zipCode: '',
    street: '',
    district: '',
    city: '',
    state: '',
  });

  const { isPending, mutate } = useMutation({
    mutationFn: findAddressByZipCode,
    networkMode: 'always',
  });

  const handleSearchAddress = useCallback(
    (currentZipCode: string) => {
      const zipCode = stringUtils.removeNonDigits(currentZipCode);

      if (zipCode.length !== 8) {
        return;
      }

      if (zipCode === lastValidatedAddress.zipCode) {
        formik.setFieldValue('street', lastValidatedAddress.street);
        formik.setFieldValue('district', lastValidatedAddress.district);
        formik.setFieldValue('city', lastValidatedAddress.city);
        formik.setFieldValue('state', lastValidatedAddress.state);

        return;
      }

      mutate(zipCode, {
        onSuccess: (response) => {
          if (response.data) {
            setLastValidatedAddress({
              zipCode,
              street: response.data.street,
              district: response.data.district,
              city: response.data.city,
              state: response.data.state,
            });

            formik.setFieldValue('street', response.data.street);
            formik.setFieldValue('district', response.data.district);
            formik.setFieldValue('city', response.data.city);
            formik.setFieldValue('state', response.data.state);

            formik.submitForm();
          }
        },
      });
    },
    [formik, mutate, lastValidatedAddress]
  );

  const handleChangeZipCode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      formik.handleChange(e);

      handleSearchAddress(e.target.value);
    },
    [formik, handleSearchAddress]
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
      <FieldLabel htmlFor="day-of-week">
        <MapPinIcon className="text-zinc-400" /> Endereço Completo
      </FieldLabel>

      <div className="flex-1">
        <span className="block mb-2 text-sm text-zinc-700 font-semibold">
          CEP
        </span>
        <InputRoot
          touched={formik.touched.zipCode}
          error={formik.errors.zipCode}
        >
          <InputControl
            name="zipCode"
            type="text"
            value={formik.values.zipCode}
            onChange={handleChangeZipCode}
            onBlur={(e) => handleSearchAddress(e.target.value)}
          />
          <InputPrefix>
            {isPending ? (
              <Spinner className="h-5 w-5 text-zinc-400" />
            ) : (
              <SearchIcon className="h-5 w-5 text-zinc-400" />
            )}
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
          <Select
            name="state"
            placeholder=""
            defaultValue="SP"
            value={formik.values.state}
            onValueChange={(newValue: string) => {
              formik.setFieldValue('state', newValue);
            }}
          >
            <SelectItem value="SP" text="São Paulo" defaultChecked />
          </Select>
        </div>
      </div>
    </div>
  );
};
