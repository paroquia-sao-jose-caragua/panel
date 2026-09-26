export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/entrar',
    FORGOT_PASSWORD: '/esqueci-minha-senha',
    RESET_PASSWORD: '/redefinir-senha',
  },
  SETTINGS: {
    HOME: '/configuracoes',
    CHANGE_PASSWORD: '/configuracoes/alterar-senha',
    NEW_USER: '/configuracoes/usuarios/novo',
    RESET_USER_PASSWORD: (id: string) => `/configuracoes/usuarios/${id}/redefinir-senha`,
    EDIT_USER_ROLE: (id: string) => `/configuracoes/usuarios/${id}/papel`,
  },
  COMMUNITIES: {
    HOME: '/',
    ADD: '/adicionar-comunidade',
    DETAILS: (slug: string) => `/${slug}`,
    EDIT: (slug: string) => `/${slug}/editar`,
    ABOUT: (slug: string) => `/${slug}/sobre`,
    PATRON: (slug: string) => `/${slug}/padroeiro`,
    GALLERY: (slug: string) => `/${slug}/galeria`,
    MASS_SCHEDULES: {
      ADD_ORDINARY: (slug: string) => `/${slug}/adicionar-missa-regular`,
      EDIT_ORDINARY: (slug: string, id: string) => `/${slug}/missa-regular/${id}/editar`,
      ADD_DEVOTIONAL: (slug: string) => `/${slug}/adicionar-missa-devocional`,
      EDIT_DEVOTIONAL: (slug: string, id: string) => `/${slug}/missa-devocional/${id}/editar`,
      ADD_ANNUAL: (slug: string) => `/${slug}/adicionar-missa-anual`,
      EDIT_ANNUAL: (slug: string, id: string) => `/${slug}/missa-anual/${id}/editar`,
    },
  },
  CLERGY: {
    HOME: '/clerigos',
    ADD: '/clerigos/adicionar',
    EDIT: (id: string) => `/clerigos/editar/${id}`,
  },
  ANNOUNCEMENTS: {
    HOME: '/avisos',
    ADD: '/avisos/adicionar',
    EDIT: (id: string) => `/avisos/editar/${id}`,
    EDIT_ALERT: '/avisos/alerta/editar',
  },
  CALENDAR: {
    HOME: '/agenda',
    ADD_EVENT: '/agenda/adicionar-evento',
    ADD_EVENT_WITH_DATE: (date: string) => `/agenda/adicionar-evento?date=${date}`,
    EDIT_EVENT: (id: string) => `/agenda/evento/${id}/editar`,
  },
  SECRETARIAT: {
    HOME: '/secretaria',
    EDIT: '/secretaria/editar',
    DONATIONS: '/secretaria/doacoes',
  },
  PASTORALS: '/pastorais',
  APPOINTMENTS: {
    HOME: '/agendamentos',
    DETAILS: (id: string) => `/agendamentos/${id}`,
  },
  PASTORAL_AGENTS: {
    HOME: '/agentes-pastorais',
    ADD: '/agentes-pastorais/adicionar',
    EDIT: (id: string) => `/agentes-pastorais/editar/${id}`,
    SCHEDULE: (id: string) => `/agentes-pastorais/${id}/horarios`,
    BLOCKED_DATES: (id: string) => `/agentes-pastorais/${id}/bloqueios`,
  },
  APPOINTMENT_SERVICES: {
    HOME: '/categorias-atendimento',
    ADD: '/categorias-atendimento/adicionar',
    EDIT: (id: string) => `/categorias-atendimento/editar/${id}`,
  },
} as const;

