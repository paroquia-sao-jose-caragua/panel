import { api } from '../utils/api';

export const deleteClergy = async (id: string) => {
  const result = await api(`/clergy/${id}`, {
    method: 'DELETE',
  });

  return result;
};
