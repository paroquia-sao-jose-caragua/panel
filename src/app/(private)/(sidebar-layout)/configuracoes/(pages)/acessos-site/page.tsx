'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Calendar,
  Globe,
  Monitor,
  RefreshCw,
  Settings,
  ShieldAlert,
  Smartphone,
  Tablet,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { getSiteVisitStats } from '@/api/site-visits';
import useAuthStore from '@/stores/useAuthStore';

const ALLOWED_ROLES = new Set(['admin', 'secretary', 'user']);

const PERIOD_OPTIONS = [
  { label: '7 dias', value: 7 },
  { label: '14 dias', value: 14 },
  { label: '30 dias', value: 30 },
] as const;

function formatShortDate(isoDate: string) {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}`;
}

function getFriendlyPathLabel(path: string) {
  if (path === '/') return 'Página Inicial';
  if (path.startsWith('/agendamentos/acompanhar')) return 'Acompanhar Agendamento';
  if (path.startsWith('/agendamentos')) return 'Agendamento Online';
  if (path.startsWith('/agenda')) return 'Agenda e Missas';
  if (path.startsWith('/liturgia')) return 'Liturgia Diária';
  if (path.startsWith('/comunidades')) return 'Comunidades';
  if (path.startsWith('/clerigos')) return 'Clérigos';
  if (path.startsWith('/quero-contribuir')) return 'Quero Contribuir';
  if (path.startsWith('/mural-de-avisos')) return 'Mural de Avisos';
  if (path.startsWith('/contato')) return 'Contato';
  return path;
}

export default function SiteVisitsPage() {
  const { user: currentUser } = useAuthStore();
  const [days, setDays] = useState<number>(30);

  const isAuthorized = Boolean(
    currentUser?.role && ALLOWED_ROLES.has(currentUser.role)
  );

  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: ['site-visit-stats', days],
    queryFn: () => getSiteVisitStats(days),
    enabled: isAuthorized,
    refetchOnWindowFocus: false,
  });

  const stats = data?.stats;

  const chartData = useMemo(() => {
    return (stats?.dailySeries || []).map((item) => ({
      date: item.date,
      label: formatShortDate(item.date),
      acessos: item.totalCount ?? item.count,
      unicos: item.uniqueCount ?? item.count,
      paginas: item.pageViews ?? item.count,
    }));
  }, [stats?.dailySeries]);

  const totalDevicesInPeriod = useMemo(() => {
    if (!stats) return 0;
    return (
      stats.deviceBreakdown.mobile +
      stats.deviceBreakdown.desktop +
      stats.deviceBreakdown.tablet
    );
  }, [stats]);

  const maxPathCount = useMemo(() => {
    if (!stats?.topPaths?.length) return 1;
    return Math.max(...stats.topPaths.map((p) => p.count), 1);
  }, [stats?.topPaths]);

  if (!isAuthorized) {
    return (
      <>
        <AppHeader
          links={[
            {
              key: 'settings',
              href: ROUTES.SETTINGS.HOME,
              title: 'Configurações',
              icon: Settings,
            },
            {
              key: 'site-visits',
              href: ROUTES.SETTINGS.SITE_VISITS,
              title: 'Acessos ao Site',
              icon: BarChart3,
            },
          ]}
        />
        <main className="max-w-325 w-full px-4 pt-8 pb-16 lg:col-start-2 lg:px-8 mx-auto">
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-10 text-center space-y-3 shadow-2xs">
            <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
            <h2 className="text-lg font-bold text-zinc-900">
              Acesso restrito
            </h2>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              Apenas administradores e a secretaria têm permissão para visualizar
              as estatísticas de acesso ao site público.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'settings',
            href: ROUTES.SETTINGS.HOME,
            title: 'Configurações',
            icon: Settings,
          },
          {
            key: 'site-visits',
            href: ROUTES.SETTINGS.SITE_VISITS,
            title: 'Acessos ao Site',
            icon: BarChart3,
          },
        ]}
      />

      <main className="max-w-325 w-full px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <TypographyH1>Acessos ao Site</TypographyH1>
            <Describe className="mt-1">
              Acessos totais, visitantes únicos e páginas mais lidas no site
              público (contabilizados após 5s de permanência, sem dados pessoais
              e com filtro automático de robôs).
            </Describe>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <div className="inline-flex rounded-xl border border-zinc-200 bg-white p-1 shadow-2xs">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDays(option.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    days === option.value
                      ? 'bg-[#18351E] text-white shadow-2xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-1.5 h-9"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {isPending ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))
          ) : (
            <>
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Hoje (Acessos)
                  </span>
                  <p className="text-2xl font-bold text-zinc-900 leading-tight mt-0.5">
                    {stats?.todayAccessCount ?? 0}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 truncate">
                    {stats?.todayCount ?? 0} únicos · {stats?.todayPageViews ?? 0}{' '}
                    páginas
                  </p>
                </div>
              </div>

              <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Últimos 7 dias
                  </span>
                  <p className="text-2xl font-bold text-zinc-900 leading-tight mt-0.5">
                    {stats?.last7DaysAccessCount ?? 0}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 truncate">
                    {stats?.last7DaysCount ?? 0} únicos ·{' '}
                    {stats?.last7DaysPageViews ?? 0} páginas
                  </p>
                </div>
              </div>

              <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Neste mês
                  </span>
                  <p className="text-2xl font-bold text-zinc-900 leading-tight mt-0.5">
                    {stats?.currentMonthAccessCount ?? 0}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 truncate">
                    {stats?.currentMonthCount ?? 0} únicos ·{' '}
                    {stats?.currentMonthPageViews ?? 0} páginas
                  </p>
                </div>
              </div>

              <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Total acumulado
                  </span>
                  <p className="text-2xl font-bold text-zinc-900 leading-tight mt-0.5">
                    {stats?.totalAccessCount ?? 0}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 truncate">
                    {stats?.totalCount ?? 0} únicos · {stats?.totalPageViews ?? 0}{' '}
                    páginas
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Daily Visits Chart */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-[#B8872E]" />
              <div>
                <h2 className="text-lg font-bold text-zinc-900">
                  Evolução diária de acessos
                </h2>
                <p className="text-xs text-zinc-500">
                  Últimos {days} dias — comparativo entre acessos totais,
                  visitantes únicos e visualizações de páginas
                </p>
              </div>
            </div>
          </div>

          {isPending ? (
            <Skeleton className="h-72 w-full rounded-xl" />
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e4e4e7"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: '#71717a' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e4e4e7' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#71717a' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#f4f4f5' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e4e4e7',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      fontSize: '13px',
                    }}
                    labelFormatter={(label) => `Dia ${label}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar
                    dataKey="acessos"
                    name="Acessos totais"
                    fill="#B8872E"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={24}
                  />
                  <Bar
                    dataKey="unicos"
                    name="Visitantes únicos"
                    fill="#18351E"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={24}
                  />
                  <Bar
                    dataKey="paginas"
                    name="Páginas vistas"
                    fill="#3b82f6"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Bottom 2-Column Breakdown: Devices + Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900">
                Acessos por dispositivo
              </h2>
              <p className="text-xs text-zinc-500">
                Distribuição dos acessos nos últimos {days} dias
              </p>
            </div>

            {isPending ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  {
                    key: 'mobile',
                    label: 'Celular',
                    count: stats?.deviceBreakdown.mobile ?? 0,
                    icon: Smartphone,
                    barClass: 'bg-emerald-700',
                  },
                  {
                    key: 'desktop',
                    label: 'Computador',
                    count: stats?.deviceBreakdown.desktop ?? 0,
                    icon: Monitor,
                    barClass: 'bg-[#B8872E]',
                  },
                  {
                    key: 'tablet',
                    label: 'Tablet',
                    count: stats?.deviceBreakdown.tablet ?? 0,
                    icon: Tablet,
                    barClass: 'bg-blue-600',
                  },
                ].map((device) => {
                  const pct =
                    totalDevicesInPeriod > 0
                      ? Math.round((device.count / totalDevicesInPeriod) * 100)
                      : 0;
                  const Icon = device.icon;

                  return (
                    <div key={device.key} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-zinc-800">
                          <Icon className="w-4 h-4 text-zinc-500" />
                          {device.label}
                        </span>
                        <span className="font-semibold text-zinc-900">
                          {device.count}{' '}
                          <span className="text-xs font-normal text-zinc-500">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${device.barClass}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Pages */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900">
                Páginas mais acessadas
              </h2>
              <p className="text-xs text-zinc-500">
                Páginas com pelo menos 5s de leitura nos últimos {days} dias
              </p>
            </div>

            {isPending ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ) : !stats?.topPaths?.length ? (
              <div className="py-8 text-center text-sm text-zinc-500">
                Ainda não há visualizações registradas neste período.
              </div>
            ) : (
              <div className="space-y-3">
                {stats.topPaths.map((item) => {
                  const pct = Math.round((item.count / maxPathCount) * 100);
                  return (
                    <div key={item.path} className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <div className="min-w-0">
                          <span className="font-medium text-zinc-800 block truncate">
                            {getFriendlyPathLabel(item.path)}
                          </span>
                          <span className="text-xs text-zinc-400 font-mono block truncate">
                            {item.path}
                          </span>
                        </div>
                        <span className="font-bold text-zinc-900 shrink-0">
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#18351E]/80"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
