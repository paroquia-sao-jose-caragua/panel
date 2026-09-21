import { updateCommunityAbout } from '@/api/communities/update-about';
import { useNavigate } from '@/hooks/use-navigate';
import useCommunityStore from '@/stores/useCommunityStore';
import { showAlert } from '@/utils/showAlert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCommunity } from '@/api/communities/use-community';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  heroSubtitle: Yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
  aboutTitle: Yup.string().max(255, 'Máximo de 255 caracteres').nullable(),
  aboutDescription: Yup.string().nullable(),
  historySummary: Yup.string().nullable(),
});

export const useEditAbout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setCommunity } = useCommunityStore();
  const { community } = useCommunity();

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: updateCommunityAbout,
  });

  const formik = useFormik({
    initialValues: {
      heroSubtitle: community?.heroSubtitle || '',
      aboutTitle: community?.aboutTitle || '',
      aboutDescription: community?.aboutDescription || '',
      historySummary: community?.historySummary || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (!community?.id) return;

      mutate(
        {
          id: community.id,
          heroSubtitle: values.heroSubtitle || null,
          aboutTitle: values.aboutTitle || null,
          aboutDescription: values.aboutDescription || null,
          historySummary: values.historySummary || null,
        },
        {
          onSuccess: ({ community: updatedCommunity, statusCode, message }) => {
            if (updatedCommunity && (statusCode === 200 || !statusCode)) {
              setCommunity(updatedCommunity);
              queryClient.invalidateQueries({ queryKey: ['community', community.slug] });
              queryClient.invalidateQueries({ queryKey: ['communities'] });
              navigate.push(`/${community.slug}`);
              showAlert('Textos da comunidade salvos com sucesso!');
            } else {
              showAlert(`Erro ao salvar textos: ${message || 'Erro desconhecido'}`);
            }
          },
          onError: (error) => {
            showAlert(`Erro ao salvar textos: ${error.message}`);
          },
        }
      );
    },
  });

  return { formik, isPending, community };
};
