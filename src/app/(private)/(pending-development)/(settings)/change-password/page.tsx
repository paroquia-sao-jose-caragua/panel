import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/typography/Describe';
import { Title } from '@/components/typography/Title';

export default function ChangePassword() {
  return (
    <>
      <Title>Alterar Senha</Title>

      <Describe>
        Gerencie a segurança da sua conta alterando sua senha regularmente.
      </Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
