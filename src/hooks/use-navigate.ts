"use client";

import { useRouter } from "next/navigation";

export const useNavigate = () => {
  const router = useRouter();

  return {
    push: (to: string) => router.push(to),
    replace: (to: string) => router.replace(to),
    redirect: (to: string) => {
      if (typeof window !== "undefined") {
        window.location.href = to;
      }
      return new Promise<never>(() => {}); // nunca resolve para aguardar o redirecionamento ser concluído
    },
  };
};
