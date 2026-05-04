import { FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  Root as FileInputRoot,
  Trigger as FileInputTrigger,
  Control as FileInputControl,
  ImagePreview,
} from '@/components/ui/file-input';
import {
  Root as InputRoot,
  Control as InputControl,
} from '@/components/common/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FullAddressForm } from '../../full-address-form';
import type { useCreateChurch } from './use-create-church';
import { useFileInputStore } from '@/stores/useFileInputStore';

interface InfoStepProps {
  formik: ReturnType<typeof useCreateChurch>['formik'];
}

export const InfoFormStep = ({ formik }: InfoStepProps) => {
  const { files } = useFileInputStore();

  const fileError = files.find((f) => f.state === 'error');

  return (
    <form autoComplete="off" className="mt-6 flex w-full flex-col gap-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
        <div className="flex-1">
          <FieldLabel htmlFor="day-of-month">Foto da Igreja</FieldLabel>
          <span className="block text-zinc-600 mt-2">
            Recomendamos uma imagem retangular de pelo menos 400x300px
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <ImagePreview size="lg" />
          <div className="flex-1">
            <FileInputRoot className="flex-1">
              <FileInputTrigger />
              <FileInputControl accept="image/png,image/jpeg" />
            </FileInputRoot>
            {((formik.touched.coverId && formik.errors.coverId) ||
              fileError?.error) && (
              <div className="mt-1 focus-error">
                <FieldDescription className="text-red-700">
                  {fileError?.error || formik.errors.coverId}
                </FieldDescription>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5">
        <FieldLabel htmlFor="day-of-month">Informações Básicas</FieldLabel>

        <div className="flex-1">
          <span className="block mb-2 text-sm text-zinc-700 font-semibold">
            Nome da Comunidade
          </span>

          <InputRoot error={formik.errors.name} touched={formik.touched.name}>
            <InputControl
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </InputRoot>
        </div>

        <div className="flex-1">
          <span className="block mb-2 text-sm text-zinc-700 font-semibold">
            Tipo
          </span>

          <RadioGroup
            name="type"
            defaultValue="chapel"
            value={formik.values.type}
            className="w-full flex flex-col sm:flex-row items-start gap-4"
            onValueChange={(newValue) => formik.setFieldValue('type', newValue)}
          >
            <label
              htmlFor="r1"
              className={`cursor-pointer w-full flex-1 flex items-center gap-4 border ${formik.values.type === 'parish_church' ? 'border-brand-600 bg-brand-0' : 'border-divider'} rounded-xl p-3`}
            >
              <RadioGroupItem value="parish_church" id="r1" />

              <div className="flex flex-col items-start text-zinc-700 text-md font-semibold gap-0">
                Igreja Matriz
                <span className="block text-sm text-zinc-500 font-normal">
                  Sede da Paróquia
                </span>
              </div>
            </label>

            <label
              htmlFor="r2"
              className={`cursor-pointer w-full flex-1 flex items-center gap-3 border ${formik.values.type === 'chapel' ? 'border-brand-600 bg-brand-0' : 'border-divider'} rounded-xl p-3`}
            >
              <RadioGroupItem value="chapel" id="r2" />

              <div className="flex flex-col items-start text-zinc-700 text-md font-medium gap-0">
                Capela
                <span className="block text-sm text-zinc-500 font-normal">
                  Anexada à Paróquia
                </span>
              </div>
            </label>
          </RadioGroup>
        </div>
      </div>

      <FullAddressForm formik={formik} />
    </form>
  );
};
