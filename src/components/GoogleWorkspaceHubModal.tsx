// src/components/GoogleWorkspaceHubModal.tsx
import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Calendar,
  Mail,
  MapPin,
  Video,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { EventPlanState } from '../types/event';
import {
  buildGoogleCalendarUrl,
  buildGmailComposeUrl,
  buildGoogleMapsSearchUrl,
  triggerWorkspaceWebhookSync,
  WorkspaceSyncResult,
} from '../services/googleWorkspaceService';

export interface GoogleWorkspaceHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventPlan: EventPlanState;
}

export const GoogleWorkspaceHubModal: React.FC<GoogleWorkspaceHubModalProps> = ({
  isOpen,
  onClose,
  eventPlan,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<WorkspaceSyncResult | null>(null);

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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileSpreadsheet className="w-5 h-5" />
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier 1: Zero-Auth Instant Action Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Tier 1: Zero-Auth Instant Action Links (Works with 0 Setup)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 flex items-center justify-between font-bold text-slate-800"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Add Event to Google Calendar</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 flex items-center justify-between font-bold text-slate-800"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600" />
                <span>Draft Vendor RFP in Gmail</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 flex items-center justify-between font-bold text-slate-800"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Search Venues in Google Maps</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 flex items-center justify-between font-bold text-slate-800"
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Start Instant Google Meet</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Tier 2: 1-Click Apps Script Sync */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Tier 2: 1-Click Export Live to Google Drive
            </h4>
            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
              Sheets + Docs + Forms
            </span>
          </div>
          <p className="text-xs text-indigo-800 leading-relaxed">
            Instantiates a 3-sheet workbook (`Budget_Breakdown`, `Vendor_Ledger`, `Dietary_Matrix`), an Executive Dossier doc, and an RSVP Google Form directly in Google Drive.
          </p>

          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncToDrive}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {isSyncing ? (
              <span>Deploying to Google Workspace...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Live Google Sheets, Docs & Forms</span>
              </>
            )}
          </button>

          {syncResult && (
            <div className="bg-white rounded-xl p-3 border border-indigo-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Live Google Drive Assets Created Successfully:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={syncResult.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-slate-50 border border-slate-200 text-indigo-600 font-semibold hover:underline block truncate"
                >
                  📊 Google Sheet
                </a>
                <a
                  href={syncResult.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-slate-50 border border-slate-200 text-indigo-600 font-semibold hover:underline block truncate"
                >
                  📄 Google Doc Dossier
                </a>
                <a
                  href={syncResult.formPublishUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-slate-50 border border-slate-200 text-indigo-600 font-semibold hover:underline block truncate"
                >
                  📝 RSVP Google Form
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
