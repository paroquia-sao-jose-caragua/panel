'use client';

import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommunity } from '@/api/communities/use-community';
import { Church, MapPin, Pen } from 'lucide-react';
import Link from 'next/link';
import { OrdinaryMassesList } from '@/components/features/mass-schedules/ordinary-mass/list';
import { DevotionalMassesList } from '@/components/features/mass-schedules/devotional-mass/list';
import { AnnualMassesList } from '@/components/features/mass-schedules/annual-mass/list';

export default function ChurchPage() {
  const { community } = useCommunity();

  return (
    <main className="max-w-300 w-full px-4 pt-20 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <AppBreadcrumb
        links={[
          {
            key: 'churched',
            href: '/',
            title: 'Início',
            icon: Church,
          },
          {
            key: 'church',
            title: community?.name,
            href: `/${community?.slug}`,
          },
        ]}
      />

      <div className="w-full rounded-lg shadow-sm bg-white flex flex-col overflow-hidden mb-8">
        <div
          style={{
            backgroundImage: community?.coverUrl
              ? `url('${community?.coverUrl}')`
              : '',
          }}
          className="relative w-full h-80 bg-cover bg-center aspect-4/3"
        >
          {community?.type === 'parish_church' && (
            <div className="sm:absolute sm:top-4 sm:left-4 sm:z-10">
              <span className="px-2.5 py-1.5 text-sm rounded-md w-fit-content bg-brand-800 text-white font-semibold">
                Igreja Matriz
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col p-6 sm:flex-row gap-6">
          <div className="flex-1">
            {community ? (
              <div className="flex flex-row items-center gap-2">
                <TypographyH1>{community.name}</TypographyH1>
              </div>
            ) : (
              <Skeleton className="h-8 w-62.5" />
            )}

            {community ? (
              <div className="flex flex-row items-start gap-2 mt-3">
                <MapPin className="text-zinc-400" />
                <span className="flex-1 text-lg text-zinc-600">
                  {community.address}
                </span>
              </div>
            ) : (
              <Skeleton className="h-8 w-62.5" />
            )}
          </div>

          <Link href={`/${community?.slug}/edit`}>
            <Button variant="outline">
              <Pen />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <OrdinaryMassesList />

        <AnnualMassesList />

        <DevotionalMassesList />
      </div>
    </main>
  );
}
