import { DevNoticeCard } from '@/components/common/dev-notice-card';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function ChangePassword() {
  return (
    <>
      <TypographyH1>Alterar Senha</TypographyH1>

      <Describe>
        Gerencie a segurança da sua conta alterando sua senha regularmente.
      </Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
