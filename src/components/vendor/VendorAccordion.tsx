// src/components/vendor/VendorAccordion.tsx
import React from 'react';
import { Building2, AlertTriangle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { VendorRecord, VendorCategoryKey } from '../../types/event';
import { evaluateAdvanceRisk } from '../../shared/vendorEngine';
import { VendorChecklistItem } from './VendorChecklistItem';

interface VendorAccordionProps {
  vendor: VendorRecord;
  currency: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleCheck: (category: VendorCategoryKey, checkId: string) => void;
  onAdvanceChange: (category: VendorCategoryKey, advancePct: number) => void;
  onGenerateRfp: (vendor: VendorRecord) => void;
}

/**
 * Accessible accordion item rendering vendor payment tranches and 10 domain checklist deliverables.
 */
export const VendorAccordion: React.FC<VendorAccordionProps> = ({
  vendor,
  currency,
  isExpanded,
  onToggleExpand,
  onToggleCheck,
  onAdvanceChange,
  onGenerateRfp,
}) => {
  const advanceAudit = evaluateAdvanceRisk(vendor.advancePaidPct);
  const advanceAmount = Math.round((vendor.allocatedBudget * vendor.advancePaidPct) / 100);
  const holdbackAmount = Math.round((vendor.allocatedBudget * vendor.postEventHoldbackPct) / 100);
  const sliderId = `advance-slider-${vendor.category}`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={onToggleExpand}
        className="w-full p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Building2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">{vendor.categoryLabel}</h3>
            <div className="text-xs text-slate-500 mt-0.5">
              Partner: <span className="font-semibold text-slate-700">{vendor.vendorName}</span> • Allocated:{' '}
              <span className="font-mono font-bold text-slate-800">{currency} {vendor.allocatedBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Readiness Score</div>
            <div className="font-mono text-sm font-black text-indigo-700">{vendor.readinessScorePct}%</div>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" aria-hidden="true" /> : <ChevronDown className="w-5 h-5 text-slate-400" aria-hidden="true" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Milestone Payment Tranches (30 / 50 / 20)
              </span>
              {advanceAudit.isHighRisk && (
                <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> High Advance Warning (&gt;50%)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label htmlFor={sliderId} className="text-slate-500 font-medium block">
                  Tranche 1: Booking Advance ({vendor.advancePaidPct}%)
                </label>
                <div className="text-base font-black text-slate-900 tabular-nums mt-0.5">
                  {currency} {advanceAmount.toLocaleString()}
                </div>
                <input
                  id={sliderId}
                  type="range"
                  min={10}
                  max={80}
                  step={5}
                  value={vendor.advancePaidPct}
                  aria-label={`${vendor.categoryLabel} booking advance percentage`}
                  aria-valuemin={10}
                  aria-valuemax={80}
                  aria-valuenow={vendor.advancePaidPct}
                  onChange={(e) => onAdvanceChange(vendor.category, Number(e.target.value))}
                  className="w-full mt-2 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-slate-500 font-medium">Tranche 2: Event Day Delivery (50%)</div>
                <div className="text-base font-black text-slate-900 tabular-nums mt-0.5">
                  {currency} {Math.round(vendor.allocatedBudget * 0.5).toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Released upon setup check</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-slate-500 font-medium">Tranche 3: Safe Holdback (20%)</div>
                <div className="text-base font-black text-emerald-700 tabular-nums mt-0.5">
                  {currency} {holdbackAmount.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-600 mt-1 block">Protected against damages</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
              Domain Deliverables & Verification Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vendor.checklistItems.map((chk) => (
                <VendorChecklistItem
                  key={chk.id}
                  id={chk.id}
                  category={vendor.category}
                  taskTitle={chk.taskTitle}
                  completed={chk.completed}
                  onToggle={onToggleCheck}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onGenerateRfp(vendor)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Draft AI WhatsApp RFP & Negotiation Script</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
