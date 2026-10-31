// src/components/VendorChecklistView.tsx
import React, { useState } from 'react';
import {
  Building2,
  CheckSquare,
  Square,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { VendorRecord, VendorCategoryKey } from '../types/event';
import { calculateVendorReadiness, evaluateAdvanceRisk } from '../shared/vendorEngine';

export interface VendorChecklistViewProps {
  vendors: VendorRecord[];
  currency: string;
  onUpdateVendors: (updated: VendorRecord[]) => void;
  onGenerateRfp: (vendor: VendorRecord) => void;
}

export const VendorChecklistView: React.FC<VendorChecklistViewProps> = ({
  vendors,
  currency,
  onUpdateVendors,
  onGenerateRfp,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<VendorCategoryKey | null>('VENUE_RENTAL');

  const handleToggleCheck = (category: VendorCategoryKey, checkId: string) => {
    const updated = vendors.map((v) => {
      if (v.category !== category) return v;
      const updatedItems = v.checklistItems.map((item) =>
        item.id === checkId ? { ...item, completed: !item.completed } : item
      );
      return {
        ...v,
        checklistItems: updatedItems,
        readinessScorePct: calculateVendorReadiness(updatedItems, v.advancePaidPct),
      };
    });
    onUpdateVendors(updated);
  };

  const handleAdvanceChange = (category: VendorCategoryKey, advancePct: number) => {
    const updated = vendors.map((v) => {
      if (v.category !== category) return v;
      const isHighRisk = advancePct > 50;
      return {
        ...v,
        advancePaidPct: advancePct,
        highAdvanceRiskFlag: isHighRisk,
        readinessScorePct: calculateVendorReadiness(v.checklistItems, advancePct),
      };
    });
    onUpdateVendors(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Step 5: 12-Category Vendor Checklist & Payment Tranches
          </h2>
          <p className="text-xs text-slate-500">
            Track 120 domain deliverables, enforce safe 30/50/20 payment tranches, and dispatch WhatsApp RFPs.
          </p>
        </div>
      </div>

      {/* 12 Vendor Accordions */}
      <div className="space-y-3">
        {vendors.map((vendor) => {
          const isExpanded = expandedCategory === vendor.category;
          const advanceAudit = evaluateAdvanceRisk(vendor.advancePaidPct);
          const advanceAmount = Math.round((vendor.allocatedBudget * vendor.advancePaidPct) / 100);
          const holdbackAmount = Math.round((vendor.allocatedBudget * vendor.postEventHoldbackPct) / 100);

          return (
            <div
              key={vendor.category}
              className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden"
            >
              {/* Accordion Header */}
              <div
                onClick={() => setExpandedCategory(isExpanded ? null : vendor.category)}
                className="p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Building2 className="w-5 h-5" />
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
                  {/* Readiness Progress */}
                  <div className="text-right">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Readiness Score</div>
                    <div className="font-mono text-sm font-black text-indigo-700">{vendor.readinessScorePct}%</div>
                  </div>

                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  {/* Payment Tranches Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Milestone Payment Tranches (30 / 50 / 20)
                      </span>
                      {advanceAudit.isHighRisk && (
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5" /> High Advance Warning (&gt;50%)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="text-slate-500 font-medium">Tranche 1: Booking Advance ({vendor.advancePaidPct}%)</div>
                        <div className="text-base font-black text-slate-900 tabular-nums mt-0.5">
                          {currency} {advanceAmount.toLocaleString()}
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={80}
                          step={5}
                          value={vendor.advancePaidPct}
                          onChange={(e) => handleAdvanceChange(vendor.category, Number(e.target.value))}
                          className="w-full mt-2 accent-indigo-600"
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

                  {/* 10 Checklists */}
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                      Domain Deliverables & Verification Checklist
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {vendor.checklistItems.map((chk) => (
                        <div
                          key={chk.id}
                          onClick={() => handleToggleCheck(vendor.category, chk.id)}
                          className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                            chk.completed ? 'bg-emerald-50 border-emerald-200 text-slate-800' : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {chk.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className={chk.completed ? 'line-through text-slate-400' : ''}>
                            {chk.taskTitle}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RFP Action CTA */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onGenerateRfp(vendor)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Draft AI WhatsApp RFP & Negotiation Script</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
