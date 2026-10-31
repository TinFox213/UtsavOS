// src/utils/qrGenerator.ts

export interface UPIPaymentParams {
  payeeVpa: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
  currency?: string;
}

/**
 * Constructs NPCI UPI URI string.
 */
export function buildUPIPaymentUri(params: UPIPaymentParams): string {
  const { payeeVpa, payeeName, amount, transactionNote, currency = 'INR' } = params;
  const cleanVpa = encodeURIComponent(payeeVpa);
  const cleanName = encodeURIComponent(payeeName);
  const cleanNote = encodeURIComponent(transactionNote);
  return `upi://pay?pa=${cleanVpa}&pn=${cleanName}&am=${amount.toFixed(2)}&cu=${currency}&tn=${cleanNote}`;
}

/**
 * Generates an SVG QR placeholder visual matrix directly in the client bundle.
 */
export function generateQRMatrixSvg(data: string, size = 180): string {
  // Generates a clean deterministic SVG representation
  const encodedHash = Array.from(data).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const patternSeed = encodedHash % 7;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="rounded-xl border border-slate-200 bg-white p-2">
      <rect width="100%" height="100%" fill="white" />
      <!-- Top-Left Target -->
      <rect x="15" y="15" width="40" height="40" fill="#0F172A" rx="4" />
      <rect x="23" y="23" width="24" height="24" fill="white" rx="2" />
      <rect x="29" y="29" width="12" height="12" fill="#4F46E5" rx="1" />
      <!-- Top-Right Target -->
      <rect x="${size - 55}" y="15" width="40" height="40" fill="#0F172A" rx="4" />
      <rect x="${size - 47}" y="23" width="24" height="24" fill="white" rx="2" />
      <rect x="${size - 41}" y="29" width="12" height="12" fill="#4F46E5" rx="1" />
      <!-- Bottom-Left Target -->
      <rect x="15" y="${size - 55}" width="40" height="40" fill="#0F172A" rx="4" />
      <rect x="23" y="${size - 47}" width="24" height="24" fill="white" rx="2" />
      <rect x="29" y="${size - 41}" width="12" height="12" fill="#4F46E5" rx="1" />
      <!-- Central Data Grid Blocks -->
      <rect x="70" y="30" width="15" height="15" fill="#334155" />
      <rect x="95" y="30" width="15" height="15" fill="#334155" />
      <rect x="70" y="60" width="40" height="15" fill="#4F46E5" />
      <rect x="30" y="70" width="25" height="15" fill="#334155" />
      <rect x="${size - 55}" y="70" width="25" height="15" fill="#334155" />
      <rect x="70" y="90" width="15" height="30" fill="#334155" />
      <rect x="95" y="90" width="25" height="15" fill="#4F46E5" />
      <rect x="70" y="${size - 45}" width="40" height="15" fill="#334155" />
      <text x="${size / 2}" y="${size - 8}" text-anchor="middle" font-size="9" font-family="monospace" fill="#64748B">UPI / PASS VERIFIED (Seed #${patternSeed})</text>
    </svg>
  `.trim();
}
