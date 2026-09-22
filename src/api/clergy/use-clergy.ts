import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listClergy } from './list';
import { createClergy, type CreateClergyParams } from './create';
import { editClergy, type EditClergyParams } from './edit';
import { deleteClergy as deleteClergyApi } from './delete';
import { showAlert } from '@/utils/showAlert';

export const useClergy = () => {
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ['clergy'],
    queryFn: listClergy,
  });

  const createMutation = useMutation({
    mutationFn: (params: CreateClergyParams) => createClergy(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clergy'] });
      showAlert('Membro do clero cadastrado com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao cadastrar membro do clero: ${err.message}`);
    },
  });

  const editMutation = useMutation({
    mutationFn: (params: EditClergyParams) => editClergy(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clergy'] });
      showAlert('Dados do clérigo atualizados com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao atualizar dados: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClergyApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clergy'] });
      showAlert('Membro do clero excluído com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao excluir: ${err.message}`);
    },
  });

  return {
    clergy: data?.clergy || [],
    isPending,
    error,
    createClergy: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    editClergy: editMutation.mutateAsync,
    isEditing: editMutation.isPending,
    deleteClergy: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
