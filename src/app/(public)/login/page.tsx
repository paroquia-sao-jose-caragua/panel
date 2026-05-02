import { Describe } from '@/components/typography/Describe';
import Image from 'next/image';
import { Form } from './form';

export default function Login() {
  return (
    <main className="min-h-screen flex flex-row items-center justify-center">
      <div className='hidden lg:block h-screen w-1/2 bg-cover bg-center bg-[url("/login/cover.png")]' />
      <div className="flex flex-col gap-6 row-start-2 items-center justify-center max-w-100 w-full mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center border-b border-divider pb-6 w-full">
          <Image
            src="/avatar.svg"
            alt="São José com o Menino Jesus"
            width={75}
            height={75}
            priority
          />
          <h1 className="text-2xl font-medium text-brand-900 mt-4">
            Acessar Painel
          </h1>
          <Describe>Jesus, Maria e José, a nossa família vossa é!</Describe>
        </div>
        <Form />
      </div>
    </main>
  );
}
