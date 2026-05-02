import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/typography/Describe';
import { Title } from '@/components/typography/Title';

export default function ManageAccess() {
  return (
    <>
      <Title>Gerenciar Acessos</Title>

      <Describe>
        Restrinja o acesso a funcionalidades específicas do painel de controle
        para cada usuário do sistema.
      </Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
