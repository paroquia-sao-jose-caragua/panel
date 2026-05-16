import useLocaleConfigStore from '@/stores/useLocaleConfigStore';
import useAuthStore from '@/stores/useAuthStore';
import { logout } from '../users/logout';
import { refresh } from '../users/refresh';

export const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_API_URL as string;

interface ResponseErrorFields<K extends string> {
  errors?: {
    field: K;
    message: string;
  }[];
}

export const api = async <ResponseData, K extends string = never>(
  path: string,
  init?: RequestInit,
  options?: {
    apiBaseUrl?: string;
    retry?: boolean;
  }
): Promise<
  ResponseErrorFields<K> &
    ResponseData & {
      statusCode: number;
      message?: string;
    }
> => {
  const { lang, timezoneOffset, timezone } = useLocaleConfigStore.getState();
  const { token, setLoggedOut } = useAuthStore.getState();

  const endpoint = `${options?.apiBaseUrl || apiBaseUrl}${path}`;

  const headers = {
    'Accept-Language': lang,
    'Content-Type': 'application/json',
    'X-Timezone-Offset': timezoneOffset,
    'X-Timezone': timezone,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...init?.headers,
  };

  const response = await fetch(endpoint, { ...init, headers });
  const data = (await response.json()) as ResponseErrorFields<K> & ResponseData;

  if (
    response.status === 401 &&
    typeof options?.retry === 'boolean' &&
    options.retry !== false
  ) {
    const { statusCode, token: newToken } = await refresh();

    if (statusCode !== 200) {
      setLoggedOut();
      await logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
      return new Promise<never>(() => {});
    }

    useAuthStore.setState({ token: newToken });

    // Recursivo: tenta novamente com retry=true para evitar loop infinito
    return api(
      path,
      {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${newToken}`,
        },
      },
      { ...options, retry: false }
    );
  }

  return { ...data, statusCode: response.status };
};
