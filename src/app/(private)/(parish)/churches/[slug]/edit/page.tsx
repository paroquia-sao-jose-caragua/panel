'use client';

import { BackButton } from '@/components/BackButton';
import { useMutation } from '@tanstack/react-query';
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
import { Spinner } from '@/components/Loadings/Spinner';
import useChurchSchema from '@/schemas/useChurchSchema';
import { useFormik } from 'formik';
import { useFileInputStore } from '@/stores/useFileInputStore';
import { updateCommunity } from '@/api/communities/update';
import { showAlert } from '@/utils/showAlert';
import { Button } from '@/components/ui/button';
import { useCommunity } from '@/api/communities/use-community';
import { TypographyH1 } from '@/components/typography/h1';

export default function EditChurchPage() {
  const validationSchema = useChurchSchema();
  const { files } = useFileInputStore();
  const coverId = files.find((f) => f.state === 'complete')?.id;

  const { community } = useCommunity();

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
        { id: community?.id as string, ...values },
        {
          onSuccess: ({ community, statusCode, message }) => {
            if (community && statusCode === 200) {
              showAlert('Alterações salvas com sucesso!');
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
    <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <BackButton href={`/churches/${community?.slug}`} />

      {/* <TypographyH1>Editar Igreja</TypographyH1> */}
      <div className="flex flex-row items-center gap-4 mb-8">
        <ImagePreview url={community?.coverUrl} />

        <div>
          <TypographyH1 className="pb-1">Editar Igreja</TypographyH1>
          <span className="text-md font-medium">{community?.name}</span>
        </div>
      </div>

      <form
        id="edit-church-form"
        className="mt-6 flex w-full flex-col gap-5 divide-y divide-divider"
      >
        <div className="lg:grid-cols-form flex flex-col gap-3 pb-5 lg:grid">
          <label htmlFor="cover" className="text-md font-medium text-zinc-800">
            Capa
            <span className="mt-0.5 mb-4 block text-sm font-normal text-zinc-800">
              Esta imagem será exibida publicamente.
            </span>
            {/* <ImagePreview url={community?.coverUrl} /> */}
          </label>
          <FileInputRoot>
            <FileInputTrigger actionLabel="Clique aqui para alterar" />
            <FileInputFileList />
            <FileInputControl />
          </FileInputRoot>
        </div>

        <div className="lg:grid-cols-form flex flex-col gap-3 pb-5 lg:grid">
          <label htmlFor="name" className="text-sm font-medium text-zinc-800">
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
          <label htmlFor="name" className="text-sm font-medium text-zinc-800">
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
            className="text-sm font-medium text-zinc-800"
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

      <div className="lg:grid lg:grid-cols-form flex gap-3 pt-4 lg:justify-end items-center border-t border-divider">
        <div className="flex lg:justify-end col-start-2">
          <Button size="lg" disabled={isPending} onClick={formik.submitForm}>
            {isPending ? (
              <Spinner className="border-brand-300 border-2 w-5 h-5" />
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
