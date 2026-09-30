import { api } from '../utils/api';

export interface GetAvailableSlotsParams {
  agentId: string;
  date: string; // "YYYY-MM-DD"
  serviceId?: string;
}

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  agentId: string;
  communityId: string | null;
}

export interface GetAvailableSlotsResponse {
  date: string;
  dayOfWeek: number;
  slots: AvailableSlot[];
}

export const getAvailableSlots = async (params: GetAvailableSlotsParams) => {
  const searchParams = new URLSearchParams();
  searchParams.append('agentId', params.agentId);
  searchParams.append('date', params.date);
  if (params.serviceId) searchParams.append('serviceId', params.serviceId);

  const result = await api<GetAvailableSlotsResponse>(
    `/appointments/internal/available-slots?${searchParams.toString()}`
  );

  return result;
};
