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
      {
        source: '/clergies',
        destination: '/clerigos',
        permanent: true,
      },
      {
        source: '/clergies/add',
        destination: '/clerigos/adicionar',
        permanent: true,
      },
      {
        source: '/clergies/edit/:id',
        destination: '/clerigos/editar/:id',
        permanent: true,
      },
      {
        source: '/clergies/:id/edit',
        destination: '/clerigos/editar/:id',
        permanent: true,
      },
      {
        source: '/announcements',
        destination: '/avisos',
        permanent: true,
      },
      {
        source: '/announcements/add',
        destination: '/avisos/adicionar',
        permanent: true,
      },
      {
        source: '/announcements/alert/edit',
        destination: '/avisos/alerta/editar',
        permanent: true,
      },
      {
        source: '/announcements/edit/:id',
        destination: '/avisos/editar/:id',
        permanent: true,
      },
      {
        source: '/calendar',
        destination: '/agenda',
        permanent: true,
      },
      {
        source: '/calendar/add-event-schedule',
        destination: '/agenda/adicionar-evento',
        permanent: true,
      },
      {
        source: '/calendar/event-schedule/:id/edit',
        destination: '/agenda/evento/:id/editar',
        permanent: true,
      },
      {
        source: '/secretariat',
        destination: '/secretaria',
        permanent: true,
      },
      {
        source: '/secretariat/edit',
        destination: '/secretaria/editar',
        permanent: true,
      },
      {
        source: '/secretariat/donations',
        destination: '/secretaria/doacoes',
        permanent: true,
      },
      {
        source: '/donations',
        destination: '/secretaria/doacoes',
        permanent: true,
      },
      {
        source: '/add',
        destination: '/adicionar-comunidade',
        permanent: true,
      },
      {
        source: '/pastorals',
        destination: '/pastorais',
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
