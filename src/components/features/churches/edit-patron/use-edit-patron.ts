import { updateCommunityPatron } from '@/api/communities/update-patron';
import { useNavigate } from '@/hooks/use-navigate';
import useCommunityStore from '@/stores/useCommunityStore';
import { showAlert } from '@/utils/showAlert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCommunity } from '@/api/communities/use-community';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  patronName: Yup.string().max(255, 'Máximo de 255 caracteres').nullable(),
  patronDescription: Yup.string().nullable(),
  patronPhotoId: Yup.string().nullable(),
});

export const useEditPatron = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setCommunity } = useCommunityStore();
  const { community } = useCommunity();

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: updateCommunityPatron,
  });

  const formik = useFormik({
    initialValues: {
      patronName: community?.patronName || '',
      patronDescription: community?.patronDescription || '',
      patronPhotoId: community?.patronPhotoId || '',
      patronPhotoUrl: community?.patronPhotoUrl || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (!community?.id) return;

      mutate(
        {
          id: community.id,
          patronName: values.patronName || null,
          patronDescription: values.patronDescription || null,
          patronPhotoId: values.patronPhotoId || null,
        },
        {
          onSuccess: ({ community: updatedCommunity, statusCode, message }) => {
            if (updatedCommunity && (statusCode === 200 || !statusCode)) {
              setCommunity(updatedCommunity);
              queryClient.invalidateQueries({ queryKey: ['community', community.slug] });
              queryClient.invalidateQueries({ queryKey: ['communities'] });
              navigate.push(`/${community.slug}`);
              showAlert('Dados do padroeiro salvos com sucesso!');
            } else {
              showAlert(`Erro ao salvar dados do padroeiro: ${message || 'Erro desconhecido'}`);
            }
          },
          onError: (error) => {
            showAlert(`Erro ao salvar dados do padroeiro: ${error.message}`);
          },
        }
      );
    },
  });

  return { formik, isPending, community };
};
