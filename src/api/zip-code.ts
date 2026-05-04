interface BrasilApiResponseData {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
  location: {
    type: string;
    coordinates: {
      longitude: string;
      latitude: string;
    };
  };
}

const addressMapper = (data: BrasilApiResponseData) => ({
  zipCode: data.cep,
  state: data.state,
  city: data.city,
  district: data.neighborhood,
  street: data.street,
});

export const findAddressByZipCode = async (zipCode: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // Cancela após 3 segundos

  try {
    const response = await fetch(
      `https://brasilapi.com.br/api/cep/v2/${zipCode}`,
      {
        method: 'GET',
        signal: controller.signal, // Passa o sinal para o fetch
      }
    );

    clearTimeout(timeoutId); // Limpa o timeout se a resposta for recebida a tempo

    const data = (await response.json()) as BrasilApiResponseData;

    if (response.status === 200) {
      return {
        success: {
          message: 'Address found',
        },
        data: addressMapper(data),
        responseStatusCode: 200,
      };
    }

    if (response.status === 404) {
      return {
        error: {
          message: 'Address not found',
        },
        responseStatusCode: 404,
      };
    }

    return {
      error: {
        message: 'Internal server error',
      },
      responseStatusCode: 500,
    };
  } catch (error) {
    return {
      error: {
        message: 'Internal server error',
      },
      responseStatusCode: 500,
    };
  }
};
