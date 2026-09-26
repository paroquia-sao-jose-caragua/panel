import { AuthUser } from "@/stores/useAuthStore";
import { api } from "../utils/api";

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const login = async (values: { email: string; password: string }) => {
  const result = await api<LoginResponse>("/sessions", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(values),
  });

  return result;
};
