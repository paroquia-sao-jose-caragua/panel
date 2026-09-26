import { api } from '../utils/api';
import type { AppointmentService } from '@/entities/appointment-service';

export interface ListAppointmentServicesParams {
  all?: boolean;
}

export const listAppointmentServices = async (params?: ListAppointmentServicesParams) => {
  const query = params?.all ? '?all=true' : '';
  const result = await api<{ services: AppointmentService[] }>(`/appointment-services${query}`);
  return result;
};

export const getAppointmentService = async (id: string) => {
  const result = await api<{ service: AppointmentService }>(`/appointment-services/${id}`);
  return result;
};

export const saveAppointmentService = async (
  data: Partial<AppointmentService> & { id?: string }
) => {
  if (data.id) {
    const result = await api<{ service: AppointmentService }>(
      `/appointment-services/${data.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return result;
  }

  const result = await api<{ service: AppointmentService }>('/appointment-services', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result;
};

export const deleteAppointmentService = async (id: string) => {
  const result = await api<{ message: string }>(`/appointment-services/${id}`, {
    method: 'DELETE',
  });
  return result;
};
