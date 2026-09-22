import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showAlert } from '@/utils/showAlert';
import { getDonationsInfo } from './get';
import { updateDonationsInfo, type UpdateDonationsInfoPayload } from './update';
import type { DonationsInfo } from '@/entities/DonationsInfo';

export const useDonations = () => {
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ['donations-info'],
    queryFn: getDonationsInfo,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: updateDonations, isPending: isUpdating } = useMutation({
    mutationFn: (payload: UpdateDonationsInfoPayload) => updateDonationsInfo(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['donations-info'], data);
      queryClient.invalidateQueries({ queryKey: ['donations-info'] });
      showAlert('Informações de doações salvas com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao atualizar informações de doações: ${err.message}`);
      console.error(err);
    },
  });

  return {
    donations: data?.donations || null,
    isPending,
    error,
    updateDonations,
    isUpdating,
  };
};

export type { DonationsInfo };
