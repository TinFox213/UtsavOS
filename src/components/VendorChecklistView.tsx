// src/components/VendorChecklistView.tsx
import React, { useState } from 'react';
import { VendorRecord, VendorCategoryKey } from '../types/event';
import { calculateVendorReadiness } from '../shared/vendorEngine';
import { VendorAccordion } from './vendor/VendorAccordion';

export interface VendorChecklistViewProps {
  vendors: VendorRecord[];
  currency: string;
  onUpdateVendors: (updated: VendorRecord[]) => void;
  onGenerateRfp: (vendor: VendorRecord) => void;
}

/**
 * Step 5 Vendor Checklist & Payment Tranches view managing 12 domain categories,
 * escrow holdback buffers, and WhatsApp RFP generation.
 */
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

      <div className="space-y-3">
        {vendors.map((vendor) => (
          <VendorAccordion
            key={vendor.category}
            vendor={vendor}
            currency={currency}
            isExpanded={expandedCategory === vendor.category}
            onToggleExpand={() => setExpandedCategory((prev) => (prev === vendor.category ? null : vendor.category))}
            onToggleCheck={handleToggleCheck}
            onAdvanceChange={handleAdvanceChange}
            onGenerateRfp={onGenerateRfp}
          />
        ))}
      </div>
    </div>
  );
};
