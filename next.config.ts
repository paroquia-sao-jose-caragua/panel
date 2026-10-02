import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_DOMAIN || 'localhost',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/entrar',
        permanent: true,
      },
      // Standardized: Agenda Pastoral
      {
        source: '/atendimentos',
        destination: '/agenda-pastoral',
        permanent: true,
      },
      {
        source: '/atendimentos/:path*',
        destination: '/agenda-pastoral/:path*',
        permanent: true,
      },
      // Standardized: Programação & Eventos
      {
        source: '/programacao-paroquial',
        destination: '/programacao-e-eventos',
        permanent: true,
      },
      {
        source: '/programacao-paroquial/:path*',
        destination: '/programacao-e-eventos/:path*',
        permanent: true,
      },
      {
        source: '/calendar',
        destination: '/programacao-e-eventos',
        permanent: true,
      },
      {
        source: '/calendar/:path*',
        destination: '/programacao-e-eventos/:path*',
        permanent: true,
      },
      {
        source: '/avisos/alerta/editar',
        destination: '/programacao-e-eventos/alerta/editar',
        permanent: true,
      },
      {
        source: '/avisos/alerta',
        destination: '/programacao-e-eventos/alerta',
        permanent: true,
      },
      {
        source: '/avisos/adicionar',
        destination: '/programacao-e-eventos/banners/adicionar',
        permanent: true,
      },
      {
        source: '/avisos/editar/:id',
        destination: '/programacao-e-eventos/banners/editar/:id',
        permanent: true,
      },
      {
        source: '/avisos',
        destination: '/programacao-e-eventos/banners',
        permanent: true,
      },
      {
        source: '/announcements',
        destination: '/programacao-e-eventos/banners',
        permanent: true,
      },
      {
        source: '/announcements/:path*',
        destination: '/programacao-e-eventos/banners/:path*',
        permanent: true,
      },
      // Standardized: Dados Institucionais
      {
        source: '/clerigos',
        destination: '/dados-institucionais/clerigos',
        permanent: true,
      },
      {
        source: '/clerigos/:path*',
        destination: '/dados-institucionais/clerigos/:path*',
        permanent: true,
      },
      {
        source: '/clergies',
        destination: '/dados-institucionais/clerigos',
        permanent: true,
      },
      {
        source: '/clergies/:path*',
        destination: '/dados-institucionais/clerigos/:path*',
        permanent: true,
      },
      {
        source: '/secretaria',
        destination: '/dados-institucionais/secretaria',
        permanent: true,
      },
      {
        source: '/secretaria/:path*',
        destination: '/dados-institucionais/secretaria/:path*',
        permanent: true,
      },
      {
        source: '/secretariat',
        destination: '/dados-institucionais/secretaria',
        permanent: true,
      },
      {
        source: '/secretariat/:path*',
        destination: '/dados-institucionais/secretaria/:path*',
        permanent: true,
      },
      {
        source: '/pastorais',
        destination: '/dados-institucionais/pastorais',
        permanent: true,
      },
      {
        source: '/pastorals',
        destination: '/dados-institucionais/pastorais',
        permanent: true,
      },
      {
        source: '/adicionar-comunidade',
        destination: '/dados-institucionais/adicionar-comunidade',
        permanent: true,
      },
      {
        source: '/add',
        destination: '/dados-institucionais/adicionar-comunidade',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
