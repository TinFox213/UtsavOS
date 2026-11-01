// src/components/GoogleWorkspaceHubModal.tsx
import React, { useState, useEffect } from 'react';
import { X, FileSpreadsheet } from 'lucide-react';
import { EventPlanState } from '../types/event';
import {
  buildGoogleCalendarUrl,
  buildGmailComposeUrl,
  buildGoogleMapsSearchUrl,
  triggerWorkspaceWebhookSync,
  WorkspaceSyncResult,
} from '../services/googleWorkspaceService';
import { WorkspaceActionCard } from './workspace/WorkspaceActionCard';
import { WebhookSyncPanel } from './workspace/WebhookSyncPanel';

export interface GoogleWorkspaceHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventPlan: EventPlanState;
}

/**
 * 3-Tier Google Workspace Command Hub modal supporting Zero-Auth Instant Action links
 * and Apps Script Drive synchronization.
 */
export const GoogleWorkspaceHubModal: React.FC<GoogleWorkspaceHubModalProps> = ({
  isOpen,
  onClose,
  eventPlan,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<WorkspaceSyncResult | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSyncToDrive = async () => {
    setIsSyncing(true);
    const payload = {
      eventName: eventPlan.eventName,
      eventDate: eventPlan.eventDateIso,
      city: eventPlan.city,
      currency: eventPlan.currency,
      totalBudget: eventPlan.budget.totalBudget,
      guestCount: eventPlan.guestCount,
      allocations: eventPlan.budget.categories.map((c) => ({
        label: c.label,
        percent: Number(((c.allocatedAmount / eventPlan.budget.netAllocatableBudget) * 100).toFixed(1)),
        amount: c.allocatedAmount,
        locked: c.isLocked,
      })),
      milestones: eventPlan.milestones.map((m) => ({
        offsetLabel: m.phaseLabel,
        title: m.title,
        owner: m.owner,
        scheduledDate: m.dueDateIso,
      })),
      vendors: eventPlan.vendors.map((v) => ({
        category: v.categoryLabel,
        totalAmount: v.allocatedBudget,
        advance30: Math.round((v.allocatedBudget * v.advancePaidPct) / 100),
        eventDay50: Math.round(v.allocatedBudget * 0.5),
        holdback20: Math.round((v.allocatedBudget * v.postEventHoldbackPct) / 100),
        completedChecks: v.checklistItems.filter((i) => i.completed).length,
      })),
    };

    const res = await triggerWorkspaceWebhookSync(payload);
    setIsSyncing(false);
    setSyncResult(res);
  };

  const calUrl = buildGoogleCalendarUrl(
    eventPlan.eventName,
    `AuraPlan OS Master Event: ${eventPlan.guestCount} guests | Budget: ${eventPlan.currency} ${eventPlan.budget.totalBudget.toLocaleString()}`,
    eventPlan.city,
    eventPlan.eventDateIso
  );

  const gmailUrl = buildGmailComposeUrl(
    'vendor@auraplan-partner.com',
    `RFP Inquiry: ${eventPlan.eventName} (${eventPlan.eventDateIso})`,
    `Hello Partner,\n\nWe are organizing ${eventPlan.eventName} for ${eventPlan.guestCount} guests in ${eventPlan.city}.\n\nTarget Budget Cap: ${eventPlan.currency} ${eventPlan.budget.totalBudget.toLocaleString()}.\n\nPayment Terms: 30% Booking Advance / 50% Event Day / 20% Post-Event Holdback.\n\nPlease share your quotation.\n\nWarm regards,\n${eventPlan.organizer.fullName}`
  );

  const mapsUrl = buildGoogleMapsSearchUrl(`${eventPlan.city} banquet hall convention center`);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Google Workspace Command Hub Modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileSpreadsheet className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                3-Tier Google Workspace Command Hub
              </h3>
              <p className="text-xs text-slate-500">
                Instantly export event models to Google Calendar, Sheets, Docs, Forms & Gmail.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Google Workspace modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <WorkspaceActionCard calUrl={calUrl} gmailUrl={gmailUrl} mapsUrl={mapsUrl} />

        <WebhookSyncPanel isSyncing={isSyncing} syncResult={syncResult} onSync={handleSyncToDrive} />
      </div>
    </div>
  );
};
