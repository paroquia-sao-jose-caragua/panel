import useLocaleConfigStore from '@/stores/useLocaleConfigStore';
import { apiBaseUrl } from '../../utils/api';
import useAuthStore from '@/stores/useAuthStore';

export async function uploadFileWithProgress(
  file: File,
  onProgress: (percent: number) => void
) {
  const { lang, timezoneOffset, timezone } = useLocaleConfigStore.getState();
  const { token, setLoggedOut } = useAuthStore.getState();

  return new Promise<{ attachmentId: string }>((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${apiBaseUrl}/attachments/images`);

    // Headers extras
    xhr.setRequestHeader('Accept-Language', lang);
    xhr.setRequestHeader('X-Timezone-Offset', String(timezoneOffset));
    xhr.setRequestHeader('X-Timezone', timezone);

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        if (xhr.status === 400) {
          try {
            const response = JSON.parse(xhr.responseText) as {
              message: string;
              errors?: {
                field: string;
                message: string;
              }[];
            };

            if (response.errors) {
              reject(response.errors[0].message);
            }
          } catch (e) {}
        } else {
          try {
            const response = JSON.parse(xhr.responseText);

            if (response.errors) {
              reject(response?.message || 'Erro desconhecido ao fazer upload');
            }
          } catch (e) {
            reject(`Erro ao fazer upload: ${xhr.statusText}`);
          }
        }

        if (xhr.status === 401) {
          setLoggedOut();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
    };

    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(formData);
  });
}
