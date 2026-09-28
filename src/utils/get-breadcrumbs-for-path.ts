import type { BreadcrumbLinkItem } from '@/components/common/header';
import { ROUTES } from '@/constants/routes';

function formatSegmentTitle(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getBreadcrumbsForPath(pathname: string): BreadcrumbLinkItem[] {
  const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/';

  if (cleanPath === '/' || cleanPath === '') {
    return [{ key: 'origin', href: ROUTES.HOME, title: 'Início', icon: 'church' }];
  }

  // Settings
  if (cleanPath === ROUTES.SETTINGS.HOME) {
    return [{ key: 'settings', href: ROUTES.SETTINGS.HOME, title: 'Configurações', icon: 'settings' }];
  }
  if (cleanPath === ROUTES.SETTINGS.CHANGE_PASSWORD) {
    return [
      { key: 'settings', href: ROUTES.SETTINGS.HOME, title: 'Configurações', icon: 'settings' },
      { key: 'alterar-senha', href: ROUTES.SETTINGS.CHANGE_PASSWORD, title: 'Alterar Senha' },
    ];
  }
  if (cleanPath === ROUTES.SETTINGS.USERS) {
    return [
      { key: 'settings', href: ROUTES.SETTINGS.HOME, title: 'Configurações', icon: 'settings' },
      { key: 'users', href: ROUTES.SETTINGS.USERS, title: 'Gestão de Usuários', icon: 'users' },
    ];
  }
  if (cleanPath === ROUTES.SETTINGS.NEW_USER) {
    return [
      { key: 'settings', href: ROUTES.SETTINGS.HOME, title: 'Configurações', icon: 'settings' },
      { key: 'users', href: ROUTES.SETTINGS.USERS, title: 'Gestão de Usuários', icon: 'users' },
      { key: 'novo', href: ROUTES.SETTINGS.NEW_USER, title: 'Novo Usuário' },
    ];
  }
  if (cleanPath.startsWith('/configuracoes/usuarios/') && cleanPath.endsWith('/papel')) {
    return [
      { key: 'settings', href: ROUTES.SETTINGS.HOME, title: 'Configurações', icon: 'settings' },
      { key: 'users', href: ROUTES.SETTINGS.USERS, title: 'Gestão de Usuários', icon: 'users' },
      { key: 'papel', href: '#', title: 'Alterar Permissão' },
    ];
  }
  if (cleanPath.startsWith('/configuracoes/usuarios/') && cleanPath.endsWith('/redefinir-senha')) {
    return [
      { key: 'settings', href: ROUTES.SETTINGS.HOME, title: 'Configurações', icon: 'settings' },
      { key: 'users', href: ROUTES.SETTINGS.USERS, title: 'Gestão de Usuários', icon: 'users' },
      { key: 'redefinir', href: '#', title: 'Redefinir Senha' },
    ];
  }
  if (cleanPath === ROUTES.SETTINGS.DEVICES) {
    return [
      { key: 'settings', href: ROUTES.SETTINGS.HOME, title: 'Configurações', icon: 'settings' },
      { key: 'dispositivos', href: ROUTES.SETTINGS.DEVICES, title: 'Dispositivos', icon: 'smartphone' },
    ];
  }
  if (cleanPath === ROUTES.SETTINGS.SEND_PUSH) {
    return [
      { key: 'settings', href: ROUTES.SETTINGS.HOME, title: 'Configurações', icon: 'settings' },
      { key: 'dispositivos', href: ROUTES.SETTINGS.DEVICES, title: 'Dispositivos', icon: 'smartphone' },
      { key: 'notificacao', href: ROUTES.SETTINGS.SEND_PUSH, title: 'Enviar Notificação' },
    ];
  }

  // Clergy
  if (cleanPath === ROUTES.CLERGY.HOME) {
    return [{ key: 'clerigos', href: ROUTES.CLERGY.HOME, title: 'Clérigos', icon: 'users' }];
  }
  if (cleanPath === ROUTES.CLERGY.ADD) {
    return [
      { key: 'clerigos', href: ROUTES.CLERGY.HOME, title: 'Clérigos', icon: 'users' },
      { key: 'adicionar', href: ROUTES.CLERGY.ADD, title: 'Novo Clérigo' },
    ];
  }
  if (cleanPath.startsWith('/clerigos/editar/')) {
    return [
      { key: 'clerigos', href: ROUTES.CLERGY.HOME, title: 'Clérigos', icon: 'users' },
      { key: 'editar', href: '#', title: 'Editar Clérigo' },
    ];
  }

  // Announcements
  if (cleanPath === ROUTES.ANNOUNCEMENTS.HOME) {
    return [{ key: 'avisos', href: ROUTES.ANNOUNCEMENTS.HOME, title: 'Avisos & Alertas', icon: 'bell' }];
  }
  if (cleanPath === ROUTES.ANNOUNCEMENTS.ADD) {
    return [
      { key: 'avisos', href: ROUTES.ANNOUNCEMENTS.HOME, title: 'Avisos & Alertas', icon: 'bell' },
      { key: 'adicionar', href: ROUTES.ANNOUNCEMENTS.ADD, title: 'Novo Aviso' },
    ];
  }
  if (cleanPath === ROUTES.ANNOUNCEMENTS.EDIT_ALERT) {
    return [
      { key: 'avisos', href: ROUTES.ANNOUNCEMENTS.HOME, title: 'Avisos & Alertas', icon: 'bell' },
      { key: 'alerta-editar', href: ROUTES.ANNOUNCEMENTS.EDIT_ALERT, title: 'Editar Alerta' },
    ];
  }
  if (cleanPath.startsWith('/avisos/editar/')) {
    return [
      { key: 'avisos', href: ROUTES.ANNOUNCEMENTS.HOME, title: 'Avisos & Alertas', icon: 'bell' },
      { key: 'editar', href: '#', title: 'Editar Aviso' },
    ];
  }

  // Appointments
  if (cleanPath === ROUTES.APPOINTMENTS.HOME) {
    return [{ key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agendamentos', icon: 'calendar-check' }];
  }
  if (cleanPath === ROUTES.APPOINTMENTS.LIST) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agendamentos', icon: 'calendar-check' },
      { key: 'solicitacoes', href: ROUTES.APPOINTMENTS.LIST, title: 'Solicitações' },
    ];
  }

  // Pastoral Agents
  if (cleanPath === ROUTES.PASTORAL_AGENTS.HOME) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agendamentos', icon: 'calendar-check' },
      { key: 'agentes-pastorais', href: ROUTES.PASTORAL_AGENTS.HOME, title: 'Agentes Pastorais' },
    ];
  }
  if (cleanPath === ROUTES.PASTORAL_AGENTS.ADD) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agendamentos', icon: 'calendar-check' },
      { key: 'agentes-pastorais', href: ROUTES.PASTORAL_AGENTS.HOME, title: 'Agentes Pastorais' },
      { key: 'adicionar', href: ROUTES.PASTORAL_AGENTS.ADD, title: 'Novo Agente' },
    ];
  }
  if (cleanPath.startsWith('/agendamentos/agentes-pastorais/editar/')) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agendamentos', icon: 'calendar-check' },
      { key: 'agentes-pastorais', href: ROUTES.PASTORAL_AGENTS.HOME, title: 'Agentes Pastorais' },
      { key: 'editar', href: '#', title: 'Editar Agente' },
    ];
  }
  if (cleanPath.includes('/agendamentos/agentes-pastorais/') && cleanPath.endsWith('/horarios')) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agendamentos', icon: 'calendar-check' },
      { key: 'agentes-pastorais', href: ROUTES.PASTORAL_AGENTS.HOME, title: 'Agentes Pastorais' },
      { key: 'horarios', href: '#', title: 'Horários' },
    ];
  }
  if (cleanPath.includes('/agendamentos/agentes-pastorais/') && cleanPath.endsWith('/bloqueios')) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agendamentos', icon: 'calendar-check' },
      { key: 'agentes-pastorais', href: ROUTES.PASTORAL_AGENTS.HOME, title: 'Agentes Pastorais' },
      { key: 'bloqueios', href: '#', title: 'Bloqueios' },
    ];
  }

  // Appointment Services
  if (cleanPath === ROUTES.APPOINTMENT_SERVICES.HOME) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agendamentos', icon: 'calendar-check' },
      { key: 'categorias-atendimento', href: ROUTES.APPOINTMENT_SERVICES.HOME, title: 'Categorias de Atendimento' },
    ];
  }
  if (cleanPath === ROUTES.APPOINTMENT_SERVICES.ADD) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agendamentos', icon: 'calendar-check' },
      { key: 'categorias-atendimento', href: ROUTES.APPOINTMENT_SERVICES.HOME, title: 'Categorias de Atendimento' },
      { key: 'adicionar', href: ROUTES.APPOINTMENT_SERVICES.ADD, title: 'Nova Categoria' },
    ];
  }
  if (cleanPath.startsWith('/agendamentos/categorias-atendimento/editar/')) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agendamentos', icon: 'calendar-check' },
      { key: 'categorias-atendimento', href: ROUTES.APPOINTMENT_SERVICES.HOME, title: 'Categorias de Atendimento' },
      { key: 'editar', href: '#', title: 'Editar Categoria' },
    ];
  }

  // Calendar
  if (cleanPath === ROUTES.CALENDAR.HOME) {
    return [{ key: 'agenda', href: ROUTES.CALENDAR.HOME, title: 'Agenda Paroquial', icon: 'calendar' }];
  }
  if (cleanPath === ROUTES.CALENDAR.ADD_EVENT) {
    return [
      { key: 'agenda', href: ROUTES.CALENDAR.HOME, title: 'Agenda Paroquial', icon: 'calendar' },
      { key: 'adicionar-evento', href: ROUTES.CALENDAR.ADD_EVENT, title: 'Novo Evento' },
    ];
  }
  if (cleanPath.includes('/agenda/evento/') && cleanPath.endsWith('/editar')) {
    return [
      { key: 'agenda', href: ROUTES.CALENDAR.HOME, title: 'Agenda Paroquial', icon: 'calendar' },
      { key: 'editar', href: '#', title: 'Editar Evento' },
    ];
  }

  // Secretariat
  if (cleanPath === ROUTES.SECRETARIAT.HOME) {
    return [{ key: 'secretaria', href: ROUTES.SECRETARIAT.HOME, title: 'Secretaria Paroquial', icon: 'building' }];
  }

  // Community creation
  if (cleanPath === ROUTES.COMMUNITIES.ADD) {
    return [
      { key: 'origin', href: ROUTES.HOME, title: 'Início', icon: 'church' },
      { key: 'adicionar', href: ROUTES.COMMUNITIES.ADD, title: 'Nova Comunidade' },
    ];
  }

  // Subpaths of community (e.g. /[slug], /[slug]/editar, /[slug]/sobre, /[slug]/padroeiro, /[slug]/galeria)
  const parts = cleanPath.split('/').filter(Boolean);
  if (parts.length > 0) {
    const items: BreadcrumbLinkItem[] = [
      { key: 'origin', href: ROUTES.HOME, title: 'Início', icon: 'church' },
    ];

    const slug = parts[0];
    items.push({
      key: 'church',
      href: `/${slug}`,
      title: formatSegmentTitle(slug),
    });

    if (parts.length > 1) {
      const subAction = parts[parts.length - 1];
      items.push({
        key: `sub-${subAction}`,
        href: '#',
        title: formatSegmentTitle(subAction),
      });
    }

    return items;
  }

  return [{ key: 'origin', href: ROUTES.HOME, title: 'Início', icon: 'church' }];
}
