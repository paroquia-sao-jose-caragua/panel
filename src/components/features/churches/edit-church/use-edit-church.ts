import { updateCommunity } from '@/api/communities/update';
import { useNavigate } from '@/hooks/use-navigate';
import useChurchSchema from '@/schemas/useChurchSchema';
import useCommunityStore from '@/stores/useCommunityStore';
import { useFileInputStore } from '@/stores/useFileInputStore';
import { formatFullAddress, parseFullAddress } from '@/utils/formatFullAddress';
import { showAlert } from '@/utils/showAlert';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCommunity } from '@/api/communities/use-community';

export const useEditChurch = () => {
  const validationSchema = useChurchSchema();
  const navigate = useNavigate();
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
      coverId: coverId || community?.coverId,
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
          address: formatFullAddress(values),
        },
        {
          onSuccess: ({ community, statusCode, message }) => {
            if (community && statusCode === 200) {
              setCommunity(community);
              navigate.push(`/${community.slug}`);
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

  return { formik, isPending };
};
