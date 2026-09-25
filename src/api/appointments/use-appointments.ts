import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listAppointments, type ListAppointmentsParams } from './list';
import { updateAppointmentStatus, type UpdateAppointmentStatusParams } from './update-status';
import {
  listPastoralAgents,
  getPastoralAgent,
  savePastoralAgent,
  deletePastoralAgent,
  getAgentAvailabilities,
  saveAgentAvailabilities,
  getAgentBlockedDates,
  addAgentBlockedDate,
  removeAgentBlockedDate,
  type ListPastoralAgentsParams,
} from './agents';
import {
  getAppointmentSettings,
  updateAppointmentSettings,
  type UpdateAppointmentSettingsParams,
} from './settings';
import { listAppointmentServices } from './services';
import type { PastoralAgent } from '@/entities/pastoral-agent';
import { showAlert } from '@/utils/showAlert';

export const useAppointments = (params?: ListAppointmentsParams) => {
  const queryClient = useQueryClient();

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['appointments', params],
    queryFn: () => listAppointments(params),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (updateParams: UpdateAppointmentStatusParams) =>
      updateAppointmentStatus(updateParams),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      showAlert('Status do atendimento atualizado com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao atualizar status: ${err.message}`);
    },
  });

  return {
    appointments: data?.appointments || [],
    isPending,
    error,
    refetch,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};

import type { AppointmentService } from '@/entities/appointment-service';

export const useAppointmentServices = () => {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['appointment-services'],
    queryFn: () => listAppointmentServices(),
  });

  return {
    services: (data?.services || []) as AppointmentService[],
    isPending,
    error,
    refetch,
  };
};

export const usePastoralAgents = (params?: ListPastoralAgentsParams) => {
  const queryClient = useQueryClient();

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['pastoral-agents', params],
    queryFn: () => listPastoralAgents(params),
  });

  const saveMutation = useMutation({
    mutationFn: (agentData: Partial<PastoralAgent> & { serviceIds?: string[] }) =>
      savePastoralAgent(agentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastoral-agents'] });
      showAlert('Agente pastoral salvo com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao salvar agente pastoral: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (agentId: string) => deletePastoralAgent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastoral-agents'] });
      showAlert('Agente pastoral excluído com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao excluir agente pastoral: ${err.message}`);
    },
  });

  return {
    agents: data?.agents || [],
    isPending,
    error,
    refetch,
    saveAgent: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    deleteAgent: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

export const usePastoralAgent = (id?: string) => {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['pastoral-agent', id],
    queryFn: () => (id ? getPastoralAgent(id) : null),
    enabled: !!id,
  });

  return {
    agent: data?.agent,
    isPending,
    error,
    refetch,
  };
};

export const useAgentAvailabilities = (agentId?: string) => {
  const queryClient = useQueryClient();

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['agent-availabilities', agentId],
    queryFn: () => (agentId ? getAgentAvailabilities(agentId) : null),
    enabled: !!agentId,
  });

  const saveAvailabilitiesMutation = useMutation({
    mutationFn: (availabilities: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      communityId?: string | null;
      slotDurationMinutes?: number;
      active?: boolean;
    }>) => {
      if (!agentId) throw new Error('Agent ID is required');
      return saveAgentAvailabilities(agentId, availabilities);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-availabilities', agentId] });
      showAlert('Grade de horários atualizada com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao salvar grade de horários: ${err.message}`);
    },
  });

  return {
    availabilities: data?.availabilities || [],
    isPending,
    error,
    refetch,
    saveAvailabilities: saveAvailabilitiesMutation.mutateAsync,
    isSavingAvailabilities: saveAvailabilitiesMutation.isPending,
  };
};

export const useAgentBlockedDates = (agentId?: string) => {
  const queryClient = useQueryClient();

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['agent-blocked-dates', agentId],
    queryFn: () => (agentId ? getAgentBlockedDates(agentId) : null),
    enabled: !!agentId,
  });

  const addBlockedDateMutation = useMutation({
    mutationFn: (blockedData: {
      blockedDate: string;
      startTime?: string | null;
      endTime?: string | null;
      reason?: string | null;
    }) => {
      if (!agentId) throw new Error('Agent ID is required');
      return addAgentBlockedDate(agentId, blockedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-blocked-dates', agentId] });
      showAlert('Bloqueio de data adicionado com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao adicionar bloqueio: ${err.message}`);
    },
  });

  const removeBlockedDateMutation = useMutation({
    mutationFn: (blockId: string) => {
      if (!agentId) throw new Error('Agent ID is required');
      return removeAgentBlockedDate(agentId, blockId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-blocked-dates', agentId] });
      showAlert('Bloqueio de data removido com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao remover bloqueio: ${err.message}`);
    },
  });

  return {
    blockedDates: data?.blockedDates || [],
    isPending,
    error,
    refetch,
    addBlockedDate: addBlockedDateMutation.mutateAsync,
    isAddingBlockedDate: addBlockedDateMutation.isPending,
    removeBlockedDate: removeBlockedDateMutation.mutateAsync,
    isRemovingBlockedDate: removeBlockedDateMutation.isPending,
  };
};

export const useAppointmentSettings = () => {
  const queryClient = useQueryClient();

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['appointment-settings'],
    queryFn: () => getAppointmentSettings(),
  });

  const updateMutation = useMutation({
    mutationFn: (updateParams: UpdateAppointmentSettingsParams) =>
      updateAppointmentSettings(updateParams),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['appointment-settings'] });
      showAlert(res.message || 'Configurações atualizadas com sucesso!');
    },
    onError: (err: Error) => {
      showAlert(`Erro ao atualizar configurações: ${err.message}`);
    },
  });

  return {
    settings: data?.settings,
    isPending,
    error,
    refetch,
    updateSettings: updateMutation.mutateAsync,
    isUpdatingSettings: updateMutation.isPending,
  };
};
