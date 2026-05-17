export const formatFullAddress = ({
  zipCode,
  state,
  street,
  number,
  district,
  city,
}: {
  zipCode?: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
}) => {
  if (!street || !number || !district || !zipCode || !city || !state) {
    return undefined;
  }

  return `${street}, ${number} - ${district}, ${city} - ${state}, ${zipCode}`;
};

export const parseFullAddress = (address?: string) => {
  // Format: "street, number - district, city - state, zipCode"
  if (!address) {
    return {
      street: '',
      number: '',
      district: '',
      zipCode: '',
      city: '',
      state: '',
    };
  }

  const parts = address.split(',');

  if (parts.length < 4) {
    return {
      street: '',
      number: '',
      district: '',
      zipCode: '',
      city: '',
      state: '',
    };
  }

  // First part: street
  const street = parts[0].trim();

  // Second part: "number - district"
  const numberDistrictParts = parts[1].split(' - ');
  const number = numberDistrictParts[0].trim();
  const district = numberDistrictParts[1]?.trim() || '';

  // Third part: "city - state"
  const cityStateParts = parts[2].split(' - ');
  const city = cityStateParts[0].trim();
  const state = cityStateParts[1]?.trim() || '';

  // Fourth part: zipCode
  const zipCode = parts[3].trim();

  return {
    street,
    number,
    district,
    zipCode,
    city,
    state,
  };
};
