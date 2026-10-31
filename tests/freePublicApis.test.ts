// tests/freePublicApis.test.ts
import { describe, it, expect } from 'vitest';
import {
  resolveCityCoordinates,
  fetchLiveExchangeRates,
  checkHolidaySurge,
} from '../src/services/freePublicApis';
import { buildUPIPaymentUri, generateQRMatrixSvg } from '../src/utils/qrGenerator';

describe('Zero-Key Public APIs & Utilities', () => {
  it('Geocoding Fallback: Resolves coordinates with offline resilience', async () => {
    const geo = await resolveCityCoordinates('Chennai');
    expect(geo.latitude).toBeCloseTo(13.08, 1);
    expect(geo.longitude).toBeCloseTo(80.27, 1);
  });

  it('Live FX Fallback: Returns ECB exchange rates object with USD, EUR, GBP', async () => {
    const rates = await fetchLiveExchangeRates('INR');
    expect(rates.USD).toBeDefined();
    expect(rates.EUR).toBeDefined();
  });

  it('Holiday Surge Check: Returns object with isSurge boolean', async () => {
    const result = await checkHolidaySurge('IN', '2026-08-15');
    expect(typeof result.isSurge).toBe('boolean');
  });

  it('UPI URI Builder: Constructs valid NPCI payment URI', () => {
    const uri = buildUPIPaymentUri({
      payeeVpa: 'auraplan@icici',
      payeeName: 'Grand Palace Banquet',
      amount: 45000,
      transactionNote: '30% Advance Deposit',
    });
    expect(uri).toContain('upi://pay?pa=auraplan%40icici');
    expect(uri).toContain('am=45000.00');
  });

  it('QR Matrix SVG: Returns valid SVG markup string', () => {
    const svg = generateQRMatrixSvg('upi://pay?pa=test@upi', 180);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });
});
