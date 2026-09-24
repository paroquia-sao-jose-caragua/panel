import { api } from '../utils/api';

export const deleteCommunity = async (id: string) => {
  const result = await api(`/communities/${id}`, {
    method: 'DELETE',
  });

  return result;
};
