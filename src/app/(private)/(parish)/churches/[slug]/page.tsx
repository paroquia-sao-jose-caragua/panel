'use client';

import { getCommunityBySlug } from '@/api/communities/get';
import { BackButton } from '@/components/BackButton';
import { Title } from '@/components/Typographies/Title';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  Root as FileInputRoot,
  Trigger as FileInputTrigger,
  FileList as FileInputFileList,
  Control as FileInputControl,
  ImagePreview,
} from '@/components/Form/FileInput';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/Form/Input';
import { Select } from '@/components/Form/Select';
import { SelectItem } from '@/components/Form/Select/SelectItem';
import Button from '@/components/Button';
import { Spinner } from '@/components/Loadings/Spinner';
import useChurchSchema from '@/schemas/useChurchSchema';
import { useFormik } from 'formik';
import { useFileInputStore } from '@/stores/useFileInputStore';
import { updateCommunity } from '@/api/communities/update';
import { showAlert } from '@/utils/showAlert';

export default function EditChurchPage() {
  const validationSchema = useChurchSchema();
  const { files } = useFileInputStore();
  const coverId = files.find((f) => f.state === 'complete')?.id;

  const { slug } = useParams<{ slug: string }>();

  const { data } = useQuery({
    queryKey: ['communities', slug],
    queryFn: () => getCommunityBySlug(slug),
  });

  const community = data?.community;

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: updateCommunity,
  });

  const formik = useFormik({
    initialValues: {
      name: community?.name || '',
      type: community?.type || 'chapel',
      address: community?.address || '',
      coverId: coverId || community?.coverId || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      mutate(
        { id: community?.id!, ...values },
        {
          onSuccess: ({ community, statusCode, message }) => {
            if (community && statusCode === 201) {
              // TODO: show success message
            } else {
              showAlert(`Erro ao salvar comunidade: ${message}`);
            }
          },
          onError: (error) => {
            showAlert(`Erro ao salvar comunidade: ${error.message}`);
          },
        }
      );
    },
  });

  return (
    <>
      <BackButton href="/churches" />

      <Title>Editar Igreja</Title>

      <form
        id="settings"
        className="mt-6 flex w-full flex-col gap-5 divide-y divide-brand-100/60"
      >
        <div className="lg:grid-cols-form flex flex-col gap-3 pb-5 lg:grid">
          <label htmlFor="cover" className="text-md font-medium text-brand-800">
            Capa
            <span className="mt-0.5 mb-4 block text-sm font-normal text-brand-800">
              Esta imagem será exibida publicamente.
            </span>
            <ImagePreview url={community?.coverUrl} />
          </label>
          <FileInputRoot>
            <FileInputTrigger actionLabel="Clique aqui para alterar" />
            <FileInputFileList />
            <FileInputControl />
          </FileInputRoot>
        </div>

        <div className="lg:grid-cols-form flex flex-col gap-3 pb-5 lg:grid">
          <label htmlFor="name" className="text-sm font-medium text-brand-800">
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
          <label htmlFor="name" className="text-sm font-medium text-brand-800">
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
          <label
            htmlFor="address"
            className="text-sm font-medium text-brand-800"
          >
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
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
