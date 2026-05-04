export const formatFullAddress = ({
  zipCode,
  state,
  street,
  number,
  district,
  city,
}: {
  zipCode: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
}) => {
  return `${street}, ${number} - ${district}, ${city} - ${state}, ${zipCode}`;
};
