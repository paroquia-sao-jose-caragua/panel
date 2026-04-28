import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppProvider from '@/providers/AppProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Paróquia São José - Caraguatatuba',
  description:
    'Site oficial da Paróquia São José em Caraguatatuba, SP. Encontre informações sobre missas, eventos, ministérios e serviços comunitários. Junte-se a nós na fé e na celebração da vida cristã.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased bg-brand-0`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <AppProvider>
          <div className="min-h-screen">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
