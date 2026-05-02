import { DevNoticeCard } from '@/components/DevNoticeCard';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';

export default function Faq() {
  return (
    <>
      <TypographyH1>Perguntas Frequentes (FAQ)</TypographyH1>

      <Describe>
        Encontre respostas para as perguntas mais comuns sobre o uso do painel
        de controle.
      </Describe>

      <div className="py-6">
        <DevNoticeCard />
      </div>
    </>
  );
}
