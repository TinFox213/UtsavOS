// src/components/workspace/WebhookSyncPanel.tsx
import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { WorkspaceSyncResult } from '../../services/googleWorkspaceService';

interface WebhookSyncPanelProps {
  isSyncing: boolean;
  syncResult: WorkspaceSyncResult | null;
  onSync: () => void;
}

/**
 * Tier 2 Google Workspace integration panel triggering Drive, Sheets, Docs, and Forms generation.
 */
export const WebhookSyncPanel: React.FC<WebhookSyncPanelProps> = ({
  isSyncing,
  syncResult,
  onSync,
}) => {
  return (
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
        Instantiates a 3-sheet workbook, an Executive Dossier doc, and an RSVP Google Form directly in Google Drive.
      </p>

      <button
        type="button"
        disabled={isSyncing}
        onClick={onSync}
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
      >
        {isSyncing ? (
          <span>Deploying to Google Workspace...</span>
        ) : (
          <>
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Generate Live Google Sheets, Docs & Forms</span>
          </>
        )}
      </button>

      {syncResult && (
        <div className="bg-white rounded-xl p-3 border border-indigo-200 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Live Google Drive Assets Created Successfully:
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
  );
};
