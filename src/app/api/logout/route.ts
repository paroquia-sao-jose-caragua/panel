import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTranslator } from '@/dictionaries/utils/getTranslator';

export async function POST(request: Request) {
  const lang = request.headers.get('Accept-Language') || 'pt-BR';

  const t = getTranslator(lang);

  const { set } = await cookies();

  const isDevEnv = process.env.ENVIRONMENT === 'development';

  set('refreshToken', '', {
    httpOnly: true,
    secure: true,
    sameSite: isDevEnv ? 'none' : 'lax',
    maxAge: 0,
    path: '/',
    ...(isDevEnv
      ? { domain: 'localhost' }
      : { domain: '.paroquiasaojosecaragua.org.br' }),
  });

  return NextResponse.json({
    message: t('successfully-logged-out'),
  });
}
