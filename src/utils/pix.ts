/**
 * Utility for generating Brazilian Central Bank PIX (BR Code / EMV) payload strings.
 */

function formatEMV(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export interface PixPayloadParams {
  key: string;
  name: string;
  city: string;
  amount?: number;
  txid?: string;
}

export function generatePixPayload({
  key,
  name,
  city,
  amount,
  txid = '***',
}: PixPayloadParams): string {
  let formattedKey = key.trim();
  const digitsOnly = formattedKey.replace(/\D/g, '');

  // If it's a phone number (10 or 11 digits), prefix with +55
  if (digitsOnly.length === 10 || digitsOnly.length === 11) {
    formattedKey = `+55${digitsOnly}`;
  }

  // Sanitize name: no accents, uppercase, max 25 chars
  const cleanName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .slice(0, 25);

  // Sanitize city: no accents, uppercase, max 15 chars
  const cleanCity = city
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .slice(0, 15);

  // 00: Payload Format Indicator (01)
  const formatIndicator = formatEMV('00', '01');

  // 26: Merchant Account Information
  // 00: GUI (br.gov.bcb.pix)
  // 01: Pix key
  const gui = formatEMV('00', 'br.gov.bcb.pix');
  const keyField = formatEMV('01', formattedKey);
  const merchantAccountInfo = formatEMV('26', `${gui}${keyField}`);

  // 52: Merchant Category Code (0000)
  const mcc = formatEMV('52', '0000');

  // 53: Transaction Currency (986 = BRL)
  const currency = formatEMV('53', '986');

  // 54: Transaction Amount (optional)
  const amountField = amount ? formatEMV('54', amount.toFixed(2)) : '';

  // 58: Country Code (BR)
  const countryCode = formatEMV('58', 'BR');

  // 59: Merchant Name
  const merchantName = formatEMV('59', cleanName);

  // 60: Merchant City
  const merchantCity = formatEMV('60', cleanCity);

  // 62: Additional Data Field Template (05: txid)
  const txidField = formatEMV('05', txid || '***');
  const additionalData = formatEMV('62', txidField);

  // Build raw payload without CRC
  const rawPayload = `${formatIndicator}${merchantAccountInfo}${mcc}${currency}${amountField}${countryCode}${merchantName}${merchantCity}${additionalData}6304`;

  // Calculate CRC16 checksum
  const crc = calculateCRC16(rawPayload);

  return `${rawPayload}${crc}`;
}
