import { updateCommunity } from '@/api/communities/update';
import { useNavigate } from '@/hooks/use-navigate';
import useChurchSchema from '@/schemas/useChurchSchema';
import useCommunityStore from '@/stores/useCommunityStore';
import { useFileInputStore } from '@/stores/useFileInputStore';
import { formatFullAddress, parseFullAddress } from '@/utils/formatFullAddress';
import { showAlert } from '@/utils/showAlert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCommunity } from '@/api/communities/use-community';

export const useEditChurch = () => {
  const validationSchema = useChurchSchema();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { files } = useFileInputStore();
  const { setCommunity } = useCommunityStore();
  const { community } = useCommunity();

  const coverId = files.find((f) => f.state === 'complete')?.id;

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: updateCommunity,
  });

  const formik = useFormik({
    initialValues: {
      name: community?.name || '',
      type: (community?.type as 'chapel' | 'parish_church') || 'chapel',
      coverId: coverId || community?.coverId || '',
      ...parseFullAddress(community?.address),
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      mutate(
        {
          id: community?.id as string,
          name: values.name,
          type: values.type,
          coverId: coverId || community?.coverId,
          address: formatFullAddress(values) as string,
        },
        {
          onSuccess: ({ community: updatedCommunity, statusCode, message }) => {
            if (updatedCommunity && (statusCode === 200 || !statusCode)) {
              setCommunity(updatedCommunity);
              queryClient.invalidateQueries({ queryKey: ['community', updatedCommunity.slug] });
              queryClient.invalidateQueries({ queryKey: ['communities'] });
              navigate.push(`/${updatedCommunity.slug}`);
              showAlert('Dados principais salvos com sucesso!');
            } else {
              showAlert(`Erro ao salvar comunidade: ${message || 'Erro desconhecido'}`);
            }
          },
          onError: (error) => {
            showAlert(`Erro ao salvar comunidade: ${error.message}`);
          },
        }
      );
    },
  });

  return { formik, isPending };
};
