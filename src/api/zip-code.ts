interface BrasilApiResponseData {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
  location?: {
    type: string;
    coordinates: {
      longitude: string;
      latitude: string;
    };
  };
}

interface ViaCepResponseData {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

export interface ZipCodeAddressData {
  zipCode: string;
  state: string;
  city: string;
  district: string;
  street: string;
}

const brasilApiMapper = (data: BrasilApiResponseData): ZipCodeAddressData => ({
  zipCode: data.cep,
  state: data.state || '',
  city: data.city || '',
  district: data.neighborhood || '',
  street: data.street || '',
});

const viaCepMapper = (data: ViaCepResponseData): ZipCodeAddressData => ({
  zipCode: data.cep || '',
  state: data.uf || '',
  city: data.localidade || '',
  district: data.bairro || '',
  street: data.logradouro || '',
});

const fetchWithTimeout = async (url: string, timeoutMs = 6000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

export const findAddressByZipCode = async (zipCode: string) => {
  const cleanZipCode = zipCode.replace(/\D/g, '');

  if (cleanZipCode.length !== 8) {
    return {
      error: {
        message: 'CEP inválido',
      },
      responseStatusCode: 400,
    };
  }

  // 1. Primary provider: BrasilAPI v2
  try {
    const response = await fetchWithTimeout(
      `https://brasilapi.com.br/api/cep/v2/${cleanZipCode}`,
      6000
    );

    if (response.status === 200) {
      const data = (await response.json()) as BrasilApiResponseData;

      return {
        success: {
          message: 'Address found',
        },
        data: brasilApiMapper(data),
        responseStatusCode: 200,
      };
    }
  } catch {
    // Fall through to ViaCEP fallback
  }

  // 2. Fallback provider: ViaCEP
  try {
    const response = await fetchWithTimeout(
      `https://viacep.com.br/ws/${cleanZipCode}/json/`,
      6000
    );

    if (response.status === 200) {
      const data = (await response.json()) as ViaCepResponseData;

      if (!data.erro) {
        return {
          success: {
            message: 'Address found',
          },
          data: viaCepMapper(data),
          responseStatusCode: 200,
        };
      }

      return {
        error: {
          message: 'CEP não encontrado',
        },
        responseStatusCode: 404,
      };
    }
  } catch {
    // Fall through to generic error
  }

  return {
    error: {
      message: 'Não foi possível consultar o CEP no momento',
    },
    responseStatusCode: 500,
  };
};
