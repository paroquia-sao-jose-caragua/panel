import { api } from '../utils/api';

export interface DeleteAppointmentResponse {
  message: string;
}

export const deleteAppointment = async (id: string) => {
  const result = await api<DeleteAppointmentResponse>(`/appointments/${id}`, {
    method: 'DELETE',
  });

  return result;
};
