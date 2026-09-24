import { api } from '../utils/api';

export const deleteUrgentAlert = async () => {
  const result = await api<{ message: string }>('/urgent-alert', {
    method: 'DELETE',
  });
  return result;
};
