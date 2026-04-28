import { AddCard } from '@/components/AddCard';
import { Describe } from '@/components/Typographies/Describe';
import { Title } from '@/components/Typographies/Title';
import Link from 'next/link';
import { CommunitiesList } from './list';

export default function Churches() {
  return (
    <>
      <Title>Igrejas</Title>

      <Describe>
        Gerencie as igrejas da sua paróquia, adicione novas igrejas, edite
        informações existentes e mantenha os dados atualizados.
      </Describe>

      <div className="grid xl:grid xl:grid-cols-card gap-6 py-6">
        <CommunitiesList />
        <Link href="/churches/add">
          <AddCard
            title="Adicione uma igreja"
            subtitle="para
            gerenciar a programação e as informações de cada comunidade da
            paróquia."
          />
        </Link>
      </div>
    </>
  );
}
