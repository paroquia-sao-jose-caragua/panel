'use client';

import Link from 'next/link';
import {
  Users,
  Plus,
  Pencil,
  Clock,
  CalendarOff,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  CalendarDays,
  ArrowRight,
} from 'lucide-react';

import { AppHeader } from '@/components/common/header';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePastoralAgents } from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';
import { BackButton } from '@/components/common/back-button';
import { cn } from '@/lib/utils';

export default function PastoralAgentsPage() {
  const { agents, isPending: isPendingAgents } = usePastoralAgents();

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <>
      <AppHeader
        links={[
          {
            key: 'agenda-pastoral',
            href: ROUTES.APPOINTMENTS.HOME,
            title: 'Agenda Pastoral',
            icon: CalendarDays,
          },
          {
            key: 'agentes',
            href: ROUTES.PASTORAL_AGENTS.HOME,
            title: 'Agentes Pastorais',
          },
        ]}
      />
      <main className="max-w-325 w-full min-w-0 px-4 pt-4 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        <div className="mb-2">
          <BackButton href={ROUTES.APPOINTMENTS.HOME} />
        </div>

        {/* Header and Actions */}
        <div className="space-y-2 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <TypographyH1>Agentes Pastorais</TypographyH1>
              <Describe className="mt-1">
                Gerencie os agentes que realizam atendimentos e suas respectivas disponibilidades.
              </Describe>
            </div>

            <Link href={ROUTES.PASTORAL_AGENTS.ADD}>
              <Button className="bg-[#11291f] text-white hover:bg-[#1a3d2e] gap-1.5 shadow-xs">
                <Plus className="w-4 h-4 mr-1" />
                Novo agente
              </Button>
            </Link>
          </div>
        </div>

        {/* Agents Cards Grid */}
        {isPendingAgents ? (
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="border border-zinc-200 rounded-2xl p-6 bg-white space-y-4 shadow-xs"
              >
                <div className="w-14 h-14 rounded-full bg-zinc-100 mx-auto" />
                <Skeleton className="h-5 w-32 mx-auto rounded-md" />
                <Skeleton className="h-4 w-24 mx-auto rounded" />
                <div className="pt-4 flex justify-center gap-2">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div className="border border-dashed border-zinc-300 rounded-2xl p-12 text-center bg-white shadow-xs">
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-800">
              Nenhum agente cadastrado
            </h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto mb-5">
              Cadastre clérigos, diáconos ou ministros para que os fiéis possam agendar atendimentos pelo site.
            </p>
            <Link href={ROUTES.PASTORAL_AGENTS.ADD}>
              <Button className="bg-[#11291f] text-white hover:bg-[#1a3d2e] gap-1.5">
                <Plus className="w-4 h-4 mr-1" />
                Cadastrar Primeiro Agente
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => {
              const servicesCount = agent.services?.length || 0;
              const isAvailable = agent.active && agent.acceptsAppointments;

              return (
                <div
                  key={agent.id}
                  className="border border-zinc-200/90 rounded-2xl p-6 bg-white shadow-xs hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col justify-between text-center gap-5 group"
                >
                  <div className="space-y-3">
                    {/* Initials Avatar */}
                    <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-bold text-base flex items-center justify-center mx-auto shadow-2xs group-hover:scale-105 transition-transform">
                      {getInitials(agent.name)}
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-zinc-900 leading-tight">
                        {agent.title ? `${agent.title} ` : ''}
                        {agent.name}
                      </h3>
                      <span className="text-xs text-zinc-500 font-medium block mt-0.5">
                        {agent.actingRole}
                      </span>
                    </div>

                    {/* Stats & Badges */}
                    <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
                        {servicesCount}{' '}
                        {servicesCount === 1 ? 'categoria' : 'categorias'}
                      </span>

                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        )}
                      >
                        {isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Disponível</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-zinc-400" />
                            <span>Indisponível</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-zinc-100 space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={ROUTES.PASTORAL_AGENTS.SCHEDULE(agent.id)}
                        className="text-xs font-medium text-zinc-600 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 flex items-center gap-1 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Grade</span>
                      </Link>

                      <span className="text-zinc-300">·</span>

                      <Link
                        href={ROUTES.PASTORAL_AGENTS.BLOCKED_DATES(agent.id)}
                        className="text-xs font-medium text-zinc-600 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 flex items-center gap-1 transition-colors"
                      >
                        <CalendarOff className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Bloqueios</span>
                      </Link>
                    </div>

                    <Link
                      href={ROUTES.PASTORAL_AGENTS.EDIT(agent.id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#11291f] hover:text-emerald-950 py-1.5 px-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition-all cursor-pointer"
                    >
                      <span>Ver perfil & Editar</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
