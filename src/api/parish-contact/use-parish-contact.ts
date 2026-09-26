import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getParishContact } from './get';
import { updateParishContact, type UpdateParishContactParams } from './update';
import { showAlert } from '@/utils/showAlert';

export const useParishContact = () => {
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ['parish-contact'],
    queryFn: getParishContact,
  });

  const { mutate, isPending: isUpdating } = useMutation({
    networkMode: 'always',
    mutationFn: (params: UpdateParishContactParams) => updateParishContact(params),
    onSuccess: (res) => {
      queryClient.setQueryData(['parish-contact'], res);
      queryClient.invalidateQueries({ queryKey: ['parish-contact'] });
      showAlert('Informações de Contato e Secretaria salvas com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao salvar informações: ${err.message}`);
    },
  });

  return {
    contact: data?.contact,
    isPending,
    isUpdating,
    updateContact: mutate,
    error,
  };
};
