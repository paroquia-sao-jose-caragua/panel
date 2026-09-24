import type { Metadata } from 'next';
import { Geist, Geist_Mono, Lora } from "next/font/google";
import './globals.css';
import AppProvider from '@/providers/AppProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html
      lang="pt-BR"
        className={`${geistSans.variable} ${geistMono.variable} ${lora.className} antialiased`}
    >
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
