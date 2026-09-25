import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { UserRole, UserStatus } from "@/entities/user";

export type AuthUser = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  lastLoginAt?: string | null;
};

interface States {
  isLogged: boolean;
  token: string | null;
  user: AuthUser;
  initialized: boolean;
  wasCodeSent: boolean;
  email: string;
  sessionId: string;
  showOnboarding: boolean;
  onboardingName: string;
  setLogged: (data: {
    token?: string;
    user: AuthUser;
    initialized?: boolean;
  }) => void;
  setLoggedOut: () => void;
  setEmail: (email: string) => void;
  setWasCodeSent: (wasCodeSent: boolean) => void;
  closeOnboarding: () => void;
  setOnboarding: (name: string, open: boolean) => void;
}

const useAuthStore = create<States>()(
  persist(
    (set) => ({
      userIdentifier: "",
      wasCodeSent: false,
      isLogged: false,
      token: null,
      user: {
        name: "",
        email: "",
        role: "viewer",
      },
      initialized: false,
      logoutReason: null,
      email: "",
      sessionId: "",
      showOnboarding: false,
      onboardingName: "",
      setLogged: (values) =>
        set((state) => ({
          ...state,
          ...values,
          isLogged: Boolean(values.token),
        })),
      setLoggedOut: () => {
        return set({
          email: "",
          sessionId: "",
          wasCodeSent: false,
          isLogged: false,
          token: null,
          user: {
            name: "",
            email: "",
            role: "viewer",
          },
          initialized: false,
        });
      },
      setEmail: (email: string) => set({ email }),
      setWasCodeSent: (wasCodeSent: boolean) => set({ wasCodeSent }),
      closeOnboarding: () => set({ showOnboarding: false }),
      setOnboarding: (name: string, open: boolean) =>
        set({ onboardingName: name, showOnboarding: open }),
    }),
    {
      name: "authentication-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
      }),
    },
  ),
);

export default useAuthStore;
