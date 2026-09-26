'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Tag,
  Plus,
  Pencil,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Users,
  Search,
  Cross,
  Home,
  HeartHandshake,
} from 'lucide-react';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Describe } from '@/components/ui/typography/describe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useAppointmentServices } from '@/api/appointments/use-appointments';
import { ROUTES } from '@/constants/routes';
import type { AppointmentServiceCategory } from '@/entities/appointment-service';

export default function AppointmentServicesPage() {
  const { services, isPending } = useAppointmentServices({ all: true });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredServices = (services || []).filter((svc) => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = svc.title.toLowerCase().includes(term);
      const matchDesc = svc.description?.toLowerCase().includes(term);
      if (!matchTitle && !matchDesc) return false;
    }

    if (selectedCategory !== 'all' && svc.category !== selectedCategory) {
      return false;
    }

    if (selectedStatus === 'active' && !svc.active) return false;
    if (selectedStatus === 'inactive' && svc.active) return false;

    return true;
  });

  const getCategoryMeta = (category: AppointmentServiceCategory) => {
    switch (category) {
      case 'clergy_sacramental':
        return {
          label: 'Sacramental',
          sub: 'Exclusivo Padres',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Cross,
        };
      case 'home_visit':
        return {
          label: 'Visita Domiciliar',
          sub: 'Em Residência',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Home,
        };
      case 'pastoral':
      default:
        return {
          label: 'Pastoral & Escuta',
          sub: 'Aberto / Geral',
          badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
          icon: HeartHandshake,
        };
    }
  };

  return (
    <main className="max-w-325 w-full min-w-0 px-4 pt-28 pb-16 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <AppBreadcrumb
        links={[
          {
            key: 'categorias',
            href: ROUTES.APPOINTMENT_SERVICES.HOME,
            title: 'Categorias de Atendimento',
            icon: Tag,
          },
        ]}
      />

      {/* Header and Actions */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TypographyH1>Categorias de Atendimento</TypographyH1>

          <Link href={ROUTES.APPOINTMENT_SERVICES.ADD}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </Link>
        </div>

        <Describe>
          Configure os tipos de atendimento pastoral, confissões e visitas domiciliares oferecidos aos fiéis da Paróquia.
        </Describe>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou descrição..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-3 rounded-lg border border-zinc-200 text-xs bg-white text-zinc-700"
          >
            <option value="all">Todas as naturezas</option>
            <option value="clergy_sacramental">Sacramental (Exclusivo Padres)</option>
            <option value="home_visit">Visita Domiciliar</option>
            <option value="pastoral">Pastoral & Acolhimento</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 px-3 rounded-lg border border-zinc-200 text-xs bg-white text-zinc-700"
          >
            <option value="all">Todos os status</option>
            <option value="active">Apenas ativas</option>
            <option value="inactive">Apenas inativas</option>
          </select>
        </div>
      </div>

      {/* Services List / Cards */}
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-3">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center space-y-3">
          <Tag className="w-12 h-12 text-zinc-300 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900">
            Nenhuma categoria de atendimento encontrada
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'Tente ajustar os filtros de busca para encontrar o atendimento desejado.'
              : 'Comece criando a primeira categoria de atendimento pastoral para permitir agendamentos.'}
          </p>
          <div className="pt-2">
            <Link href={ROUTES.APPOINTMENT_SERVICES.ADD}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Categoria
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredServices.map((service) => {
            const meta = getCategoryMeta(service.category);
            const Icon = meta.icon;

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-zinc-200 shadow-2xs hover:shadow-xs transition-all p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {/* Top Bar: Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={meta.badgeColor}>
                      <Icon className="w-3 h-3 mr-1" />
                      {meta.label}
                    </Badge>

                    {service.active ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Ativa
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                        <XCircle className="w-3 h-3" /> Inativa
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 leading-snug">
                      {service.title}
                    </h3>
                    <span className="text-xs text-zinc-500 font-medium">
                      {meta.sub}
                    </span>
                  </div>

                  {/* Description */}
                  {service.description && (
                    <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  )}

                  {/* Details Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="flex items-center gap-1 text-[11px] text-zinc-600 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200 font-medium">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {service.defaultDurationMinutes} min
                    </span>

                    {service.requiresAddress ? (
                      <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        Requer Endereço
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200">
                        Local Paroquial
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-end">
                  <Link href={ROUTES.APPOINTMENT_SERVICES.EDIT(service.id)}>
                    <Button variant="outline" size="sm">
                      <Pencil className="w-3.5 h-3.5 mr-1.5" />
                      Editar
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
