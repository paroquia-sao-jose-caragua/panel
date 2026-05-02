'use client';

import { listCommunities } from '@/api/communities/list';
import { Describe } from '@/components/typography/Describe';
import { Title } from '@/components/typography/Title';
import { useQuery } from '@tanstack/react-query';
import { ChurchCard } from './church-card';

export default function MassSchedules() {
  const { data } = useQuery({
    queryKey: ['communities'],
    queryFn: listCommunities,
    refetchOnWindowFocus: false,
  });

  const communities = data?.communities || [];

  return (
    <>
      <Title>Horários de Missa</Title>

      <Describe>
        Gerencie os horários de missa da sua paróquia, adicione novos horários,
        edite informações existentes e mantenha os dados atualizados.
      </Describe>

      <div className="flex flex-col gap-6 py-6">
        {communities
          .sort((a, b) =>
            a.type === 'parish_church' && b.type === 'chapel' ? -1 : 1
          )
          .map((community) => (
            <ChurchCard key={community.id} community={community} />
          ))}
      </div>
    </>
  );
}
