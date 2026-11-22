import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import Image from 'next/image';
import { Form } from './form';

export default function Login() {
  return (
    <main className='relative min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-[url("/login/cover.png")]'>
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center gap-5 max-w-100 w-full">
        <div className="w-full bg-white rounded-4xl shadow-lg overflow-hidden">
          <div className="bg-brand-800 px-6 py-8 flex flex-col items-center justify-center border-b border-brand-700/60 w-full text-center">
            <Image
              src="/login/avatar-sao-jose.png"
              alt="São José com o Menino Jesus"
              width={96}
              height={96}
              priority
              className="w-24 h-24 rounded-full object-cover border-2 border-brand-300/60 bg-white/10 shadow-md"
            />
            <h1 className="text-2xl font-bold text-white mt-4 font-serif">
              Acessar Painel
            </h1>
            <p className="text-center text-xs italic text-brand-200/90 mt-1">
              Jesus, Maria e José, a nossa família vossa é!
            </p>
          </div>

          <div className="p-6 w-full">
            <Form />
          </div>
        </div>

        <Link
          href={ROUTES.AUTH.FORGOT_PASSWORD}
          className="text-sm font-semibold text-white/95 hover:text-white drop-shadow-sm hover:underline transition"
        >
          Esqueceu sua senha?
        </Link>
      </div>
    </main>
  );
}
