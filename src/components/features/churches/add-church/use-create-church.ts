import { createCommunity } from '@/api/communities/create';
import { useNavigate } from '@/hooks/use-navigate';
import useChurchSchema from '@/schemas/useChurchSchema';
import useCommunityStore from '@/stores/useCommunityStore';
import { useFileInputStore } from '@/stores/useFileInputStore';
import { formatFullAddress } from '@/utils/formatFullAddress';
import { showAlert } from '@/utils/showAlert';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';

export const useCreateChurch = () => {
  const validationSchema = useChurchSchema();
  const navigate = useNavigate();
  const { files } = useFileInputStore();
  const { setCommunity } = useCommunityStore();

  const coverId = files.find((f) => f.state === 'complete')?.id;

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: createCommunity,
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      type: 'chapel' as 'chapel' | 'parish_church',
      coverId,
      street: '',
      number: '',
      district: '',
      zipCode: '',
      city: 'Caraguatatuba',
      state: 'SP',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      mutate(
        {
          name: values.name,
          type: values.type,
          coverId,
          address: formatFullAddress(values),
        },
        {
          onSuccess: ({ community, statusCode, message }) => {
            if (community && statusCode === 201) {
              setCommunity(community);
              navigate.push(`/churches/${community.slug}`);
            } else {
              showAlert(`Erro ao criar comunidade: ${message}`);
            }
          },
          onError: (error) => {
            showAlert(`Erro ao criar comunidade: ${error.message}`);
          },
        }
      );
    },
  });

  return { formik, isPending };
};
