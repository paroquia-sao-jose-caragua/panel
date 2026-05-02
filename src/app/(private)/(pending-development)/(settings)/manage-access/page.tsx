import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function ManageAccess() {
  return (
    <>
      <TypographyH1>Gerenciar Acessos</TypographyH1>

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
