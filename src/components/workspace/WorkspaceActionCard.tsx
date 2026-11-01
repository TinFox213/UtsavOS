// src/components/workspace/WorkspaceActionCard.tsx
import React from 'react';
import { Calendar, Mail, MapPin, Video, ExternalLink } from 'lucide-react';

interface WorkspaceActionCardProps {
  calUrl: string;
  gmailUrl: string;
  mapsUrl: string;
}

/**
 * Tier 1 Zero-Auth Instant Action deep links for Google Calendar, Gmail, Maps, and Meet.
 */
export const WorkspaceActionCard: React.FC<WorkspaceActionCardProps> = ({
  calUrl,
  gmailUrl,
  mapsUrl,
}) => {
  return (
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
            <Calendar className="w-4 h-4 text-blue-600" aria-hidden="true" />
            <span>Add Event to Google Calendar</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        </a>

        <a
          href={gmailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 flex items-center justify-between font-bold text-slate-800"
        >
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-600" aria-hidden="true" />
            <span>Draft Vendor RFP in Gmail</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        </a>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 flex items-center justify-between font-bold text-slate-800"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Search Venues in Google Maps</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        </a>

        <a
          href="https://meet.google.com/new"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 flex items-center justify-between font-bold text-slate-800"
        >
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <span>Start Instant Google Meet</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};
