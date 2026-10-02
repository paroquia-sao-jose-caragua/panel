import type { BreadcrumbLinkItem } from '@/components/common/header';
import { ROUTES } from '@/constants/routes';

function formatSegmentTitle(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getBreadcrumbsForPath(pathname: string): BreadcrumbLinkItem[] {
  const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/';

  // Root or Dados Institucionais Home
  if (cleanPath === '/' || cleanPath === '' || cleanPath === ROUTES.HOME) {
    return [{ key: 'dados-institucionais', href: ROUTES.HOME, title: 'Comunidades & Capelas', icon: 'church' }];
  }

  // ==========================================
  // 1. CONFIGURAÇÕES
  // ==========================================
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

  // ==========================================
  // 2. DADOS INSTITUCIONAIS
  // ==========================================
  // Clergy
  if (cleanPath === ROUTES.CLERGY.HOME || cleanPath === '/clerigos') {
    return [{ key: 'clerigos', href: ROUTES.CLERGY.HOME, title: 'Clérigos', icon: 'users' }];
  }
  if (cleanPath === ROUTES.CLERGY.ADD || cleanPath === '/clerigos/adicionar') {
    return [
      { key: 'clerigos', href: ROUTES.CLERGY.HOME, title: 'Clérigos', icon: 'users' },
      { key: 'adicionar', href: ROUTES.CLERGY.ADD, title: 'Novo Clérigo' },
    ];
  }
  if (cleanPath.includes('/clerigos/editar/')) {
    return [
      { key: 'clerigos', href: ROUTES.CLERGY.HOME, title: 'Clérigos', icon: 'users' },
      { key: 'editar', href: '#', title: 'Editar Clérigo' },
    ];
  }

  // Secretariat
  if (cleanPath === ROUTES.SECRETARIAT.HOME || cleanPath === '/secretaria') {
    return [{ key: 'secretaria', href: ROUTES.SECRETARIAT.HOME, title: 'Secretaria Paroquial', icon: 'building' }];
  }
  if (cleanPath === ROUTES.SECRETARIAT.EDIT || cleanPath === '/secretaria/editar') {
    return [
      { key: 'secretaria', href: ROUTES.SECRETARIAT.HOME, title: 'Secretaria Paroquial', icon: 'building' },
      { key: 'editar', href: ROUTES.SECRETARIAT.EDIT, title: 'Editar Dados' },
    ];
  }
  if (cleanPath === ROUTES.SECRETARIAT.DONATIONS || cleanPath === '/secretaria/doacoes') {
    return [
      { key: 'secretaria', href: ROUTES.SECRETARIAT.HOME, title: 'Secretaria Paroquial', icon: 'building' },
      { key: 'doacoes', href: ROUTES.SECRETARIAT.DONATIONS, title: 'Doações & Dízimo' },
    ];
  }

  // Pastorals
  if (cleanPath === ROUTES.PASTORALS || cleanPath === '/pastorais') {
    return [{ key: 'pastorais', href: ROUTES.PASTORALS, title: 'Pastorais', icon: 'users' }];
  }

  // Community creation
  if (cleanPath === ROUTES.COMMUNITIES.ADD || cleanPath === '/adicionar-comunidade') {
    return [
      { key: 'dados-institucionais', href: ROUTES.HOME, title: 'Comunidades & Capelas', icon: 'church' },
      { key: 'adicionar', href: ROUTES.COMMUNITIES.ADD, title: 'Nova Comunidade' },
    ];
  }

  // ==========================================
  // 3. PROGRAMAÇÃO & EVENTOS
  // ==========================================
  // Calendar
  if (cleanPath === ROUTES.CALENDAR.HOME || cleanPath === '/programacao-paroquial') {
    return [{ key: 'agenda', href: ROUTES.CALENDAR.HOME, title: 'Calendário Paroquial', icon: 'calendar' }];
  }
  if (cleanPath === ROUTES.CALENDAR.ADD_EVENT || cleanPath === '/programacao-paroquial/adicionar-evento') {
    return [
      { key: 'agenda', href: ROUTES.CALENDAR.HOME, title: 'Calendário Paroquial', icon: 'calendar' },
      { key: 'adicionar-evento', href: ROUTES.CALENDAR.ADD_EVENT, title: 'Novo Evento' },
    ];
  }
  if (cleanPath.includes('/evento/') && cleanPath.endsWith('/editar')) {
    return [
      { key: 'agenda', href: ROUTES.CALENDAR.HOME, title: 'Calendário Paroquial', icon: 'calendar' },
      { key: 'editar', href: '#', title: 'Editar Evento' },
    ];
  }

  // Banners
  if (cleanPath === ROUTES.ANNOUNCEMENTS.HOME || cleanPath === '/avisos') {
    return [{ key: 'banners', href: ROUTES.ANNOUNCEMENTS.HOME, title: 'Banners em Destaque', icon: 'megaphone' }];
  }
  if (cleanPath === ROUTES.ANNOUNCEMENTS.ADD || cleanPath === '/avisos/adicionar') {
    return [
      { key: 'banners', href: ROUTES.ANNOUNCEMENTS.HOME, title: 'Banners em Destaque', icon: 'megaphone' },
      { key: 'adicionar', href: ROUTES.ANNOUNCEMENTS.ADD, title: 'Novo Banner' },
    ];
  }
  if (cleanPath.includes('/banners/editar/') || cleanPath.includes('/avisos/editar/')) {
    return [
      { key: 'banners', href: ROUTES.ANNOUNCEMENTS.HOME, title: 'Banners em Destaque', icon: 'megaphone' },
      { key: 'editar', href: '#', title: 'Editar Banner' },
    ];
  }

  // Faixa de Alerta
  if (cleanPath === ROUTES.ANNOUNCEMENTS.ALERT || cleanPath === '/avisos/alerta') {
    return [{ key: 'alerta', href: ROUTES.ANNOUNCEMENTS.ALERT, title: 'Faixa de Alerta', icon: 'alert-triangle' }];
  }
  if (cleanPath === ROUTES.ANNOUNCEMENTS.EDIT_ALERT || cleanPath === '/avisos/alerta/editar') {
    return [
      { key: 'alerta', href: ROUTES.ANNOUNCEMENTS.ALERT, title: 'Faixa de Alerta', icon: 'alert-triangle' },
      { key: 'alerta-editar', href: ROUTES.ANNOUNCEMENTS.EDIT_ALERT, title: 'Editar Faixa' },
    ];
  }

  // ==========================================
  // 4. AGENDA PASTORAL
  // ==========================================
  const isAgendaHome = cleanPath === ROUTES.APPOINTMENTS.HOME || cleanPath === '/atendimentos';
  if (isAgendaHome) {
    return [{ key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Início', icon: 'calendar-check' }];
  }
  if (cleanPath === ROUTES.APPOINTMENTS.AGENDA || cleanPath === '/atendimentos/agenda') {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'agenda', href: ROUTES.APPOINTMENTS.AGENDA, title: 'Agenda' },
    ];
  }
  if (cleanPath === ROUTES.APPOINTMENTS.BLOCKS || cleanPath === '/atendimentos/bloqueios') {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'bloqueios', href: ROUTES.APPOINTMENTS.BLOCKS, title: 'Bloqueios' },
    ];
  }
  if (cleanPath === ROUTES.APPOINTMENTS.MANAGE || cleanPath === '/atendimentos/gerenciar') {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'gerenciar', href: ROUTES.APPOINTMENTS.MANAGE, title: 'Gerenciar' },
    ];
  }
  if (cleanPath === ROUTES.APPOINTMENTS.LIST || cleanPath === '/atendimentos/solicitacoes') {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'solicitacoes', href: ROUTES.APPOINTMENTS.LIST, title: 'Solicitações' },
    ];
  }
  if (cleanPath === ROUTES.APPOINTMENTS.ADD || cleanPath === '/atendimentos/adicionar') {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'solicitacoes', href: ROUTES.APPOINTMENTS.LIST, title: 'Solicitações' },
      { key: 'adicionar', href: ROUTES.APPOINTMENTS.ADD, title: 'Novo Atendimento' },
    ];
  }
  if (cleanPath === ROUTES.APPOINTMENTS.REPORT || cleanPath === '/atendimentos/relatorio') {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'relatorio', href: ROUTES.APPOINTMENTS.REPORT, title: 'Relatório & Pauta' },
    ];
  }
  if (cleanPath.includes('/editar/') && (cleanPath.startsWith('/agenda-pastoral') || cleanPath.startsWith('/atendimentos'))) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'solicitacoes', href: ROUTES.APPOINTMENTS.LIST, title: 'Solicitações' },
      { key: 'editar', href: '#', title: 'Editar Atendimento' },
    ];
  }

  // Pastoral Agents
  if (cleanPath === ROUTES.PASTORAL_AGENTS.HOME || cleanPath === '/atendimentos/agentes-pastorais') {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'agentes-pastorais', href: ROUTES.PASTORAL_AGENTS.HOME, title: 'Agentes Pastorais' },
    ];
  }
  if (cleanPath === ROUTES.PASTORAL_AGENTS.ADD || cleanPath === '/atendimentos/agentes-pastorais/adicionar') {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'agentes-pastorais', href: ROUTES.PASTORAL_AGENTS.HOME, title: 'Agentes Pastorais' },
      { key: 'adicionar', href: ROUTES.PASTORAL_AGENTS.ADD, title: 'Novo Agente' },
    ];
  }
  if (cleanPath.includes('/agentes-pastorais/editar/')) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'agentes-pastorais', href: ROUTES.PASTORAL_AGENTS.HOME, title: 'Agentes Pastorais' },
      { key: 'editar', href: '#', title: 'Editar Agente' },
    ];
  }
  if (cleanPath.includes('/agentes-pastorais/') && cleanPath.endsWith('/horarios')) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'agentes-pastorais', href: ROUTES.PASTORAL_AGENTS.HOME, title: 'Agentes Pastorais' },
      { key: 'horarios', href: '#', title: 'Horários' },
    ];
  }
  if (cleanPath.includes('/agentes-pastorais/') && cleanPath.endsWith('/bloqueios')) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'agentes-pastorais', href: ROUTES.PASTORAL_AGENTS.HOME, title: 'Agentes Pastorais' },
      { key: 'bloqueios', href: '#', title: 'Bloqueios' },
    ];
  }

  // Appointment Services
  if (cleanPath === ROUTES.APPOINTMENT_SERVICES.HOME || cleanPath === '/atendimentos/categorias-atendimento') {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'categorias-atendimento', href: ROUTES.APPOINTMENT_SERVICES.HOME, title: 'Categorias de Atendimento' },
    ];
  }
  if (cleanPath === ROUTES.APPOINTMENT_SERVICES.ADD || cleanPath === '/atendimentos/categorias-atendimento/adicionar') {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'categorias-atendimento', href: ROUTES.APPOINTMENT_SERVICES.HOME, title: 'Categorias de Atendimento' },
      { key: 'adicionar', href: ROUTES.APPOINTMENT_SERVICES.ADD, title: 'Nova Categoria' },
    ];
  }
  if (cleanPath.includes('/categorias-atendimento/editar/')) {
    return [
      { key: 'agendamentos', href: ROUTES.APPOINTMENTS.HOME, title: 'Agenda Pastoral', icon: 'calendar-check' },
      { key: 'categorias-atendimento', href: ROUTES.APPOINTMENT_SERVICES.HOME, title: 'Categorias de Atendimento' },
      { key: 'editar', href: '#', title: 'Editar Categoria' },
    ];
  }

  // ==========================================
  // Subpaths of Dados Institucionais (e.g. /dados-institucionais/[slug], /[slug])
  // ==========================================
  const parts = cleanPath.split('/').filter(Boolean);
  if (parts.length > 0) {
    const isUnderDados = parts[0] === 'dados-institucionais';
    const slugIdx = isUnderDados ? 1 : 0;

    if (parts.length > slugIdx) {
      const items: BreadcrumbLinkItem[] = [
        { key: 'dados-institucionais', href: ROUTES.HOME, title: 'Comunidades & Capelas', icon: 'church' },
      ];

      const slug = parts[slugIdx];
      items.push({
        key: 'church',
        href: ROUTES.COMMUNITIES.DETAILS(slug),
        title: formatSegmentTitle(slug),
      });

      if (parts.length > slugIdx + 1) {
        const subAction = parts[parts.length - 1];
        items.push({
          key: `sub-${subAction}`,
          href: '#',
          title: formatSegmentTitle(subAction),
        });
      }

      return items;
    }
  }

  return [{ key: 'dados-institucionais', href: ROUTES.HOME, title: 'Comunidades & Capelas', icon: 'church' }];
}
