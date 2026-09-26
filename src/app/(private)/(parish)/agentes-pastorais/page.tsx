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
  CalendarCheck,
  Tag,
} from 'lucide-react';

import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePastoralAgents } from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';

export default function PastoralAgentsPage() {
  const { agents, isPending: isPendingAgents } = usePastoralAgents();

  return (
    <main className="max-w-325 w-full min-w-0 px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <AppBreadcrumb
        links={[
          {
            key: 'agentes',
            href: ROUTES.APPOINTMENTS.HOME,
            title: 'Agentes Pastorais',
            icon: CalendarCheck,
          },
        ]}
      />

      {/* Header and Actions */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TypographyH1>Agentes Pastorais</TypographyH1>

          <Link href={ROUTES.PASTORAL_AGENTS.ADD}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Agente
            </Button>
          </Link>

        </div>

        <Describe>
          Gerenciamento de clérigos, ministros e agentes que realizam atendimentos, confissões, visitas e bênçãos.
        </Describe>
      </div>

      {/* Agents Cards Grid */}
      {isPendingAgents ? (
        <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-4 w-48 rounded" />
              <div className="pt-2 flex gap-2">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="border border-dashed border-zinc-300 rounded-2xl p-12 text-center bg-zinc-50/50">
          <Users className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-zinc-800">Nenhum agente cadastrado</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto mb-4">
            Cadastre clérigos, diáconos ou ministros da eucaristia para que os fiéis possam agendar atendimentos pelo site.
          </p>
          <Link href={ROUTES.PASTORAL_AGENTS.ADD}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Primeiro Agente
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 xl:grid-cols-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="border border-zinc-200 rounded-2xl p-5 bg-white shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between gap-4 min-w-0"
            >
              <div className="space-y-3.5">
                {/* Top Info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-bold text-base text-zinc-900 leading-tight">
                        {agent.title ? `${agent.title} ` : ''}
                        {agent.name}
                      </h3>
                      <span className="text-xs text-brand-700 font-medium block">
                        {agent.actingRole}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {agent.active ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[11px]">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-zinc-100 text-zinc-600 border-zinc-300 text-[11px]">
                        Inativo
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Status: Accepts appointments */}
                <div className="text-xs flex items-center gap-1.5 text-zinc-600">
                  {agent.acceptsAppointments ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Recebendo agendamentos
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                      <XCircle className="w-3.5 h-3.5" />
                      Agenda pausada
                    </span>
                  )}
                </div>

                {/* Contact */}
                <div className="text-xs space-y-1 text-zinc-600 pt-1 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{agent.phone}</span>
                  </div>
                  {agent.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                  )}
                </div>

                {/* Services Provided */}
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                    Serviços que realiza:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.services && agent.services.length > 0 ? (
                      agent.services.map((svc) => (
                        <span
                          key={svc.id}
                          className="bg-brand-50 text-brand-800 border border-brand-200/70 text-[11px] font-medium px-2 py-0.5 rounded-md"
                        >
                          {svc.title}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-400 italic">Nenhum serviço vinculado</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-1.5">
                <Link href={ROUTES.PASTORAL_AGENTS.EDIT(agent.id)}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs font-semibold"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Editar
                  </Button>
                </Link>

                <div className="flex items-center gap-1">
                  <Link href={ROUTES.PASTORAL_AGENTS.SCHEDULE(agent.id)}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-brand-700 hover:bg-brand-50"
                    >
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      Grade
                    </Button>
                  </Link>

                  <Link href={ROUTES.PASTORAL_AGENTS.BLOCKED_DATES(agent.id)}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-zinc-600 hover:bg-zinc-100"
                    >
                      <CalendarOff className="w-3.5 h-3.5 mr-1" />
                      Bloqueios
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
