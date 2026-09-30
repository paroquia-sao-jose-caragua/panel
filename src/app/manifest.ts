import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Painel Administrativo - Paróquia São José",
    short_name: "Painel São José",
    description:
      "Painel de gestão administrativa e pastoral da Paróquia São José de Caraguatatuba - SP.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f0e7",
    theme_color: "#18181b",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
