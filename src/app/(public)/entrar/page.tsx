import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { Describe } from '@/components/ui/typography/describe';
import Image from 'next/image';
import { Form } from './form';

export default function Login() {
  return (
    <main className="relative min-h-screen flex flex-row items-center justify-center bg-brand-0">
      <div className='absolute lg:relative z-0 block h-screen lg:w-1/2 w-full bg-cover bg-center bg-[url("/login/cover.png")]' />
      <div className="z-10 lg:z-0 flex flex-col gap-6 row-start-2 items-center justify-center max-w-100 w-full lg:mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 mx-4">
        <div className="flex flex-col items-center justify-center border-b border-divider pb-6 w-full">
          <Image
            src="/avatar.png"
            alt="São José com o Menino Jesus"
            width={100}
            height={100}
            priority
          />
          <h1 className="text-3xl font-semibold text-zinc-900 mt-4 font-serif">
            Acessar Painel
          </h1>
          <Describe className="text-center">
            Jesus, Maria e José, a nossa família vossa é!
          </Describe>
        </div>
        <Form />

        <div className="pt-2 border-t border-zinc-100 text-center w-full">
          <Link
            href="/ajuda"
            className="text-xs text-brand-700 hover:text-brand-900 font-medium inline-flex items-center gap-1.5 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Precisa de ajuda? Acesse a Central de Ajuda</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
