import { api } from '../utils/api';
import type { PastoralAgent, AgentAvailability, AgentBlockedDate } from '@/entities/pastoral-agent';

export interface ListPastoralAgentsParams {
  serviceId?: string;
}

export const listPastoralAgents = async (params?: ListPastoralAgentsParams) => {
  const query = params?.serviceId ? `?serviceId=${params.serviceId}` : '';
  const result = await api<{ agents: PastoralAgent[] }>(`/pastoral-agents${query}`);
  return result;
};

export const getPastoralAgent = async (id: string) => {
  const result = await api<{ agent: PastoralAgent }>(`/pastoral-agents/${id}`);
  return result;
};

export const savePastoralAgent = async (data: Partial<PastoralAgent> & { serviceIds?: string[] }) => {
  const method = data.id ? 'PUT' : 'POST';
  const url = data.id ? `/pastoral-agents/${data.id}` : '/pastoral-agents';

  const result = await api<{ agent: PastoralAgent }>(url, {
    method,
    body: JSON.stringify(data),
  });

  return result;
};

export const deletePastoralAgent = async (id: string) => {
  const result = await api<{ message: string }>(`/pastoral-agents/${id}`, {
    method: 'DELETE',
  });
  return result;
};

export const getAgentAvailabilities = async (agentId: string) => {
  const result = await api<{ availabilities: AgentAvailability[] }>(
    `/pastoral-agents/${agentId}/availabilities`
  );
  return result;
};

export const saveAgentAvailabilities = async (
  agentId: string,
  availabilities: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    communityId?: string | null;
    slotDurationMinutes?: number;
    active?: boolean;
  }>
) => {
  const result = await api<{ message: string }>(
    `/pastoral-agents/${agentId}/availabilities`,
    {
      method: 'PUT',
      body: JSON.stringify({ availabilities }),
    }
  );
  return result;
};

export const getAgentBlockedDates = async (agentId: string) => {
  const result = await api<{ blockedDates: AgentBlockedDate[] }>(
    `/pastoral-agents/${agentId}/blocked-dates`
  );
  return result;
};

export const addAgentBlockedDate = async (
  agentId: string,
  data: {
    blockedDate: string;
    startTime?: string | null;
    endTime?: string | null;
    reason?: string | null;
  }
) => {
  const result = await api<{ blockedDate: AgentBlockedDate }>(
    `/pastoral-agents/${agentId}/blocked-dates`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  return result;
};

export const removeAgentBlockedDate = async (agentId: string, blockId: string) => {
  const result = await api<{ message: string }>(
    `/pastoral-agents/${agentId}/blocked-dates/${blockId}`,
    {
      method: 'DELETE',
    }
  );
  return result;
};
