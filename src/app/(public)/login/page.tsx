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
            src="/avatar.svg"
            alt="São José com o Menino Jesus"
            width={75}
            height={75}
            priority
          />
          <h1 className="text-2xl font-medium text-zinc-900 mt-4">
            Acessar Painel
          </h1>
          <Describe className="text-center">
            Jesus, Maria e José, a nossa família vossa é!
          </Describe>
        </div>
        <Form />
      </div>
    </main>
  );
}
