// src/services/googleWorkspaceService.ts
import { WorkspaceSyncPayload } from '../types/event';

export interface WorkspaceSyncResult {
  status: 'success' | 'error';
  spreadsheetUrl?: string;
  documentUrl?: string;
  formPublishUrl?: string;
  formEditUrl?: string;
  message?: string;
}

export function buildGoogleCalendarUrl(
  title: string,
  details: string,
  location: string,
  startDateIso: string
): string {
  const formattedDate = startDateIso.replace(/-|:|\.\d\d\d/g, '');
  const datesParam = `${formattedDate}/${formattedDate}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
    location
  )}&dates=${datesParam}`;
}

export function buildGmailComposeUrl(to: string, subject: string, body: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    to
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildGoogleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export async function triggerWorkspaceWebhookSync(
  payload: WorkspaceSyncPayload
): Promise<WorkspaceSyncResult> {
  const webhookUrl = (import.meta as unknown as { env?: { VITE_GAS_WEBHOOK_URL?: string } }).env?.VITE_GAS_WEBHOOK_URL;

  if (!webhookUrl) {
    // Offline / Demo Fallback URLs
    return {
      status: 'success',
      spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/demo-auraplan-master-sheet/edit',
      documentUrl: 'https://docs.google.com/document/d/demo-auraplan-executive-dossier/edit',
      formPublishUrl: 'https://docs.google.com/forms/d/e/demo-auraplan-guest-rsvp/viewform',
      formEditUrl: 'https://docs.google.com/forms/d/demo-auraplan-guest-rsvp/edit',
    };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return {
      status: 'error',
      message: errMsg || 'Failed to sync with Google Workspace Webhook.',
    };
  }
}
