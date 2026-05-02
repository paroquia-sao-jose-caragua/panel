'use client';

import { BackButton } from '@/components/common/back-button';
import {
  Root as FileInputRoot,
  Trigger as FileInputTrigger,
  FileList as FileInputFileList,
  Control as FileInputControl,
} from '@/components/ui/file-input';
import Button from '@/components/Button';
import { Select, SelectItem } from '@/components/common/select';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import useChurchSchema from '@/schemas/useChurchSchema';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { createCommunity } from '@/api/communities/create';
import { useNavigate } from '@/hooks/use-navigate';
import { showAlert } from '@/utils/showAlert';
import { Spinner } from '@/components/ui/loading/spinner';
import { useFileInputStore } from '@/stores/useFileInputStore';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function AddChurch() {
  const validationSchema = useChurchSchema();
  const navigate = useNavigate();
  const { files } = useFileInputStore();

  const coverId = files.find((f) => f.state === 'complete')?.id;

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: createCommunity,
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      type: 'chapel',
      address: '',
      coverId,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: ({ community, statusCode, message }) => {
          if (community && statusCode === 201) {
            navigate.push('/churches');
          } else {
            showAlert(`Erro ao criar comunidade: ${message}`);
          }
        },
        onError: (error) => {
          showAlert(`Erro ao criar comunidade: ${error.message}`);
        },
      });
    },
  });

  return (
    <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <BackButton href="/churches" />

      <TypographyH1>Adicionar Igreja</TypographyH1>

      <form
        id="settings"
        className="mt-6 flex w-full flex-col gap-5 divide-y divide-brand-100/60"
      >
        <div className="lg:grid-cols-form flex flex-col gap-3 pb-5 lg:grid">
          <label htmlFor="cover" className="text-md font-medium">
            Capa
            <span className="mt-0.5 block text-sm font-normal">
              Esta imagem será exibida publicamente.
            </span>
          </label>
          <FileInputRoot>
            <FileInputTrigger />
            <FileInputFileList />
            <FileInputControl />
          </FileInputRoot>
        </div>

        <div className="lg:grid-cols-form flex flex-col gap-3 pb-5 lg:grid">
          <label htmlFor="name" className="text-sm font-medium">
            Nome da Comunidade
          </label>
          <InputRoot>
            <InputControl
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </InputRoot>
        </div>

        <div className="lg:grid-cols-form flex flex-col gap-3 pb-5 lg:grid">
          <label htmlFor="name" className="text-sm font-medium">
            Classificação
          </label>
          <Select
            name="type"
            placeholder=""
            defaultValue="chapel"
            value={formik.values.type}
            onValueChange={(newValue: string) => {
              formik.setFieldValue('type', newValue);
            }}
          >
            <SelectItem value="chapel" text="Comunidade" defaultChecked />
            <SelectItem value="parish_church" text="Matriz" />
          </Select>
        </div>

        <div className="lg:grid-cols-form flex flex-col gap-3 pb-5 lg:grid">
          <label htmlFor="address" className="text-sm font-medium">
            Endereço
          </label>
          <InputRoot>
            <InputControl
              id="address"
              name="address"
              type="text"
              value={formik.values.address}
              onChange={formik.handleChange}
            />
          </InputRoot>
        </div>
      </form>

      <div className="lg:grid lg:grid-cols-form flex gap-3 pt-4 lg:justify-end items-center border-t border-brand-100/60">
        <div className="flex lg:justify-end col-start-2">
          <Button
            disabled={isPending}
            className="w-36"
            onClick={formik.submitForm}
          >
            {isPending ? (
              <Spinner className="border-brand-300 border-2 w-5 h-5" />
            ) : (
              'Adicionar Igreja'
            )}{' '}
          </Button>
        </div>
      </div>
    </main>
  );
}
